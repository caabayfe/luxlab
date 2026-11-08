import { gs, GlideAggregate, GlideDateTime, GlideRecord, GlideRecordSecure } from '@servicenow/glide'
import { COACH_NOTE_PREFIX, formatMinutes as hoursAndMinutes, gapLimitMinutes } from '../replay/analysis.ts'
import { listPatterns, PatternDto } from '../replay/pattern-store.ts'
import { buildReplay } from '../replay/store.ts'
import { runSkill } from '../replay/ai.ts'

const NUDGE = 'x_everi_luxlab_nudge'
export const COMMS_SKILL = 'LuxLab Comms Drafter'
const WORK_NOTES_PROPERTY = 'x_everi_luxlab.coach.work_notes'

// Live: open P1/P2 or major incidents from the last week; older open ones are abandoned records, not live incidents
const LIVE_DAYS = 7
const LIVE_QUERY = `active=true^stateNOT IN6,7,8^opened_atRELATIVEGT@dayofweek@ago@${LIVE_DAYS}^priorityIN1,2^ORmajor_incident_stateINproposed,accepted`
const MAX_LIVE = 30

// Routing check: enough resolved look-alikes, most of them resolved by one other group
const SIMILAR_DAYS = 90
const MIN_SIMILAR = 3
const MIN_SHARE = 0.6
const MAX_EVIDENCE = 5

// A clock warns at 80% of its limit
const WARN_SHARE = 0.8
const SLA_WARN_MINUTES = 30
// Customer updates while the incident is live; major incidents of lower priority follow the P2 cadence
const COMMS_MINUTES: { [priority: string]: number } = { '1': 30, '2': 60 }
const DEFAULT_COMMS_MINUTES = 60
const STATE_ON_HOLD = '3'
// Silent this long, an incident has gone quiet rather than being worked live: listed apart and never noted
const STALE_MINUTES = 24 * 60
const MINUTE_MS = 60 * 1000
// Same fields Replay treats as someone acting on the incident
const ACTIVITY_FIELDS = ['state', 'assignment_group', 'assigned_to', 'priority', 'hold_reason', 'major_incident_state', 'impact']
const JOURNAL_SCAN = 50
const AUDIT_SCAN = 20
const INSERT_TOLERANCE_MS = 5 * 1000

export type Level = 'ok' | 'warn' | 'breach'
export type NudgeKind = 'silence' | 'comms' | 'routing' | 'pattern' | 'sla'

export interface NudgeAction {
    type: 'reassign' | 'link_problem' | 'draft_update'
    target: string
    label: string
}

export interface NudgeDto {
    key: string
    kind: NudgeKind
    level: Level
    message: string
    detail: string
    evidence: { sysId: string; number: string }[]
    action: NudgeAction | null
    pattern: string
}

// Clocks are sent as epoch milliseconds so the page can tick them between refreshes
export interface ClockDto {
    since: number
    limitMinutes: number
    paused: boolean
}

export interface LiveIncidentDto {
    sysId: string
    number: string
    shortDescription: string
    priority: string
    majorState: string
    state: string
    group: string
    service: string
    openedAt: number
    silence: ClockDto
    comms: ClockDto
    sla: { name: string; dueAt: number; breached: boolean } | null
    nudges: NudgeDto[]
    level: Level
    stale: boolean
    canWrite: boolean
}

export interface LiveDto {
    now: number
    liveDays: number
    workNotes: boolean
    incidents: LiveIncidentDto[]
}

interface Activity {
    lastActivity: number
    lastComment: number
}

// Like the page's countdowns, long spans read in days
function formatMinutes(minutes: number): string {
    if (minutes < 24 * 60) return hoursAndMinutes(minutes)
    const days = Math.floor(minutes / (24 * 60))
    return `${days}d ${Math.floor((minutes % (24 * 60)) / 60)}h`
}

function now(): number {
    return new GlideDateTime().getNumericValue()
}

function epoch(value: string): number {
    return value ? new GlideDateTime(value).getNumericValue() : 0
}

function levelOf(elapsedMinutes: number, limitMinutes: number): Level {
    if (elapsedMinutes >= limitMinutes) return 'breach'
    return elapsedMinutes >= limitMinutes * WARN_SHARE ? 'warn' : 'ok'
}

const LEVEL_RANK: { [level: string]: number } = { breach: 2, warn: 1, ok: 0 }

export function workNotesOn(): boolean {
    return gs.getProperty(WORK_NOTES_PROPERTY, 'true') === 'true'
}

const automatedAuthors: { [userName: string]: boolean } = {}

// Notes written by AI agents (e.g. Otto triage) or the system are not the team responding
function automated(userName: string): boolean {
    if (!userName || userName === 'system') return true
    if (!(userName in automatedAuthors)) {
        const user = new GlideRecord('sys_user')
        automatedAuthors[userName] = user.get('user_name', userName) && user.getValue('identity_type') === 'ai_agent'
    }
    return automatedAuthors[userName]
}

// The coach's own work notes and automated notes are not team activity; the latest customer update is tracked apart for the comms clock
function activityOf(incident: GlideRecord<'incident'>): Activity {
    const opened = epoch(incident.getValue('opened_at'))
    let lastActivity = opened
    let lastComment = 0
    // Rows written with the insert hold initial values, not someone acting on the incident
    const created = epoch(incident.getValue('sys_created_on'))
    const audit = new GlideRecord('sys_audit')
    audit.addQuery('tablename', 'incident')
    audit.addQuery('documentkey', incident.getUniqueValue())
    audit.addQuery('fieldname', 'IN', ACTIVITY_FIELDS.join(','))
    audit.orderByDesc('sys_created_on')
    audit.setLimit(AUDIT_SCAN)
    audit.query()
    while (audit.next()) {
        const at = epoch(audit.getValue('sys_created_on'))
        if (!audit.getValue('oldvalue') && at - created <= INSERT_TOLERANCE_MS) continue
        lastActivity = Math.max(lastActivity, at)
        break
    }
    const journal = new GlideRecord('sys_journal_field')
    journal.addQuery('name', 'incident')
    journal.addQuery('element_id', incident.getUniqueValue())
    journal.addQuery('element', 'IN', 'work_notes,comments')
    journal.orderByDesc('sys_created_on')
    journal.setLimit(JOURNAL_SCAN)
    journal.query()
    let noteFound = false
    while (journal.next() && !(noteFound && lastComment)) {
        const at = epoch(journal.getValue('sys_created_on'))
        const isComment = journal.getValue('element') === 'comments'
        if (isComment && !lastComment) lastComment = at
        if (noteFound || automated(journal.getValue('sys_created_by'))) continue
        if (!isComment && (journal.getValue('value') || '').indexOf(COACH_NOTE_PREFIX) === 0) continue
        lastActivity = Math.max(lastActivity, at)
        noteFound = true
    }
    return { lastActivity, lastComment }
}

function slaOf(incidentId: string): { id: string; name: string; dueAt: number; breached: boolean } | null {
    const sla = new GlideRecord('task_sla')
    sla.addQuery('task', incidentId)
    sla.addQuery('stage', 'in_progress')
    sla.orderBy('planned_end_time')
    sla.setLimit(1)
    sla.query()
    if (!sla.next() || !sla.getValue('planned_end_time')) return null
    return {
        id: sla.getUniqueValue(),
        name: sla.getDisplayValue('sla'),
        dueAt: epoch(sla.getValue('planned_end_time')),
        breached: sla.getValue('has_breached') === '1',
    }
}

function silenceNudge(clock: ClockDto, priority: string, at: number): NudgeDto | null {
    if (clock.paused) return null
    const elapsed = (at - clock.since) / MINUTE_MS
    const level = levelOf(elapsed, clock.limitMinutes)
    if (level === 'ok') return null
    const limit = `P${priority} limit is ${formatMinutes(clock.limitMinutes)}`
    return {
        key: `silence:${clock.since}`,
        kind: 'silence',
        level,
        message: `No update for ${formatMinutes(elapsed)}`,
        detail: level === 'breach' ? limit : `${limit}, ${formatMinutes(clock.limitMinutes - elapsed)} left`,
        evidence: [],
        action: null,
        pattern: '',
    }
}

function commsNudge(clock: ClockDto, at: number): NudgeDto | null {
    const elapsed = (at - clock.since) / MINUTE_MS
    const level = levelOf(elapsed, clock.limitMinutes)
    if (level === 'ok') return null
    const left = clock.limitMinutes - elapsed
    return {
        key: `comms:${clock.since}`,
        kind: 'comms',
        level,
        message: level === 'breach' ? `Customer update overdue by ${formatMinutes(-left)}` : `Customer update due in ${formatMinutes(left)}`,
        detail: `Customers expect an update every ${formatMinutes(clock.limitMinutes)}`,
        evidence: [],
        action: { type: 'draft_update', target: '', label: 'Draft update' },
        pattern: '',
    }
}

function slaNudge(sla: { id: string; name: string; dueAt: number; breached: boolean } | null, at: number): NudgeDto | null {
    if (!sla) return null
    const left = (sla.dueAt - at) / MINUTE_MS
    if (!sla.breached && left > SLA_WARN_MINUTES) return null
    const breached = sla.breached || left <= 0
    return {
        key: `sla:${sla.id}`,
        kind: 'sla',
        level: breached ? 'breach' : 'warn',
        message: breached ? `SLA breached: ${sla.name}` : `${sla.name} breaches in ${formatMinutes(left)}`,
        detail: breached ? 'Tell the customer and agree the next step' : 'Escalate now if this target will be missed',
        evidence: [],
        action: null,
        pattern: '',
    }
}

// Look-alikes share the service, else the CI, else the category
function similarityOf(incident: GlideRecord<'incident'>): { field: string; value: string; label: string; display: string } | null {
    const fields: [string, string][] = [
        ['business_service', 'service'],
        ['cmdb_ci', 'configuration item'],
        ['category', 'category'],
    ]
    for (const [field, label] of fields) {
        const value = incident.getValue(field as any)
        if (value) return { field, value, label, display: incident.getDisplayValue(field as any) }
    }
    return null
}

function groupName(groupId: string): string {
    const group = new GlideRecord('sys_user_group')
    return group.get('sys_id', groupId) ? group.getValue('name') : ''
}

function routingNudge(incident: GlideRecord<'incident'>): NudgeDto | null {
    const current = incident.getValue('assignment_group')
    const similar = similarityOf(incident)
    if (!current || !similar) return null
    const query =
        `${similar.field}=${similar.value}^stateIN6,7^resolved_atRELATIVEGT@dayofweek@ago@${SIMILAR_DAYS}` +
        `^sys_id!=${incident.getUniqueValue()}^assignment_groupISNOTEMPTY`
    const agg = new GlideAggregate('incident')
    agg.addEncodedQuery(query)
    agg.addAggregate('COUNT', null)
    agg.groupBy('assignment_group')
    agg.query()
    let total = 0
    let top = { group: '', count: 0 }
    while (agg.next()) {
        const count = parseInt(agg.getAggregate('COUNT', null), 10) || 0
        total += count
        if (count > top.count) top = { group: agg.getValue('assignment_group'), count }
    }
    if (total < MIN_SIMILAR || top.group === current || top.count / total < MIN_SHARE) return null
    const evidence: { sysId: string; number: string }[] = []
    const resolved = new GlideRecord('incident')
    resolved.addEncodedQuery(`${query}^assignment_group=${top.group}`)
    resolved.orderByDesc('resolved_at')
    resolved.setLimit(MAX_EVIDENCE)
    resolved.query()
    while (resolved.next()) evidence.push({ sysId: resolved.getUniqueValue(), number: resolved.getValue('number') })
    const target = groupName(top.group)
    return {
        key: `routing:${current}>${top.group}`,
        kind: 'routing',
        level: 'warn',
        message: `${top.count} of ${total} similar incidents were resolved by ${target}`,
        detail: `Same ${similar.label} (${similar.display}) · currently with ${incident.getDisplayValue('assignment_group')}`,
        evidence,
        action: { type: 'reassign', target: top.group, label: `Reassign to ${target}` },
        pattern: '',
    }
}

// A mined pattern about the group holding the incident, for the same service; accepted fixes first.
// Categories are too broad to match on ("Inquiry / Help" fits most incidents)
function patternNudge(incident: GlideRecord<'incident'>, patterns: PatternDto[]): NudgeDto | null {
    const group = incident.getDisplayValue('assignment_group')
    const service = incident.getDisplayValue('business_service')
    if (!group || !service) return null
    const matches = patterns.filter(
        (pattern) =>
            pattern.state !== 'dismissed' &&
            pattern.type !== 'detection' &&
            (pattern.group === group || pattern.target === group) &&
            pattern.facets.services.some((facet) => facet.name === service)
    )
    const pattern = matches.find((candidate) => candidate.state === 'accepted' && candidate.problem) || matches[0]
    if (!pattern) return null
    const problem = pattern.problem
    if (problem && incident.getValue('problem_id') === problem.sysId) return null
    return {
        key: `pattern:${pattern.sysId}`,
        kind: 'pattern',
        level: 'warn',
        message: `Looks like a known pattern: ${pattern.title}`,
        detail: problem
            ? `Known problem ${problem.number}, accepted fix`
            : `${pattern.incidentCount} incidents, ${formatMinutes(pattern.medianMinutes)} lost each (median)`,
        evidence: pattern.incidents.slice(0, MAX_EVIDENCE).map((item) => ({ sysId: item.sysId, number: item.number })),
        action: problem && !incident.getValue('problem_id') ? { type: 'link_problem', target: problem.sysId, label: `Link to ${problem.number}` } : null,
        pattern: pattern.sysId,
    }
}

interface NudgeRow {
    state: string
    workNotePosted: boolean
}

function nudgeRows(incidentIds: string[]): { [incidentAndKey: string]: NudgeRow } {
    const rows: { [incidentAndKey: string]: NudgeRow } = {}
    if (!incidentIds.length) return rows
    const nudge = new GlideRecord(NUDGE)
    nudge.addQuery('incident', 'IN', incidentIds.join(','))
    nudge.query()
    while (nudge.next()) {
        rows[`${nudge.getValue('incident')}|${nudge.getValue('key')}`] = { state: nudge.getValue('state'), workNotePosted: nudge.getValue('work_note_posted') === '1' }
    }
    return rows
}

function coachOf(incident: GlideRecord<'incident'>, patterns: PatternDto[], at: number): LiveIncidentDto {
    const priority = incident.getValue('priority') || '5'
    const activity = activityOf(incident)
    const opened = epoch(incident.getValue('opened_at'))
    const silence: ClockDto = { since: activity.lastActivity, limitMinutes: gapLimitMinutes(priority), paused: incident.getValue('state') === STATE_ON_HOLD }
    const comms: ClockDto = { since: activity.lastComment || opened, limitMinutes: COMMS_MINUTES[priority] || DEFAULT_COMMS_MINUTES, paused: false }
    const sla = slaOf(incident.getUniqueValue())
    const nudges = [silenceNudge(silence, priority, at), commsNudge(comms, at), slaNudge(sla, at), routingNudge(incident), patternNudge(incident, patterns)].filter(
        (nudge): nudge is NudgeDto => !!nudge
    )
    return {
        sysId: incident.getUniqueValue(),
        number: incident.getValue('number'),
        shortDescription: incident.getValue('short_description') || '',
        priority,
        majorState: incident.getDisplayValue('major_incident_state'),
        state: incident.getDisplayValue('state'),
        group: incident.getDisplayValue('assignment_group'),
        service: incident.getDisplayValue('business_service'),
        openedAt: opened,
        silence,
        comms,
        sla: sla ? { name: sla.name, dueAt: sla.dueAt, breached: sla.breached } : null,
        nudges,
        level: 'ok',
        stale: !silence.paused && (at - silence.since) / MINUTE_MS > STALE_MINUTES,
        canWrite: incident.canWrite(),
    }
}

// Dismissed nudges stay hidden; acting on one changes the incident, so it disappears by itself
function withoutDismissed(live: LiveIncidentDto[]): LiveIncidentDto[] {
    const rows = nudgeRows(live.map((incident) => incident.sysId))
    live.forEach((incident) => {
        incident.nudges = incident.nudges.filter((nudge) => {
            const row = rows[`${incident.sysId}|${nudge.key}`]
            return !row || row.state !== 'dismissed'
        })
        incident.nudges.sort((a, b) => LEVEL_RANK[b.level] - LEVEL_RANK[a.level])
        incident.level = incident.nudges.length ? incident.nudges[0].level : 'ok'
    })
    return live
}

export function liveIncidents(): LiveDto {
    const at = now()
    const patterns = listPatterns()
    const live: LiveIncidentDto[] = []
    const incident = new GlideRecordSecure('incident')
    incident.addEncodedQuery(LIVE_QUERY)
    incident.orderBy('priority')
    incident.orderBy('opened_at')
    incident.setLimit(MAX_LIVE)
    incident.query()
    while (incident.next()) live.push(coachOf(incident, patterns, at))
    withoutDismissed(live).sort(
        (a, b) =>
            Number(a.stale) - Number(b.stale) || LEVEL_RANK[b.level] - LEVEL_RANK[a.level] || a.priority.localeCompare(b.priority) || a.openedAt - b.openedAt
    )
    return { now: at, liveDays: LIVE_DAYS, workNotes: workNotesOn(), incidents: live }
}

function liveIncident(incidentId: string): GlideRecordSecure<'incident'> | null {
    const incident = new GlideRecordSecure('incident')
    incident.addEncodedQuery(`sys_id=${incidentId}^active=true^stateNOT IN6,7,8`)
    incident.query()
    return incident.next() ? incident : null
}

// The coach of one open incident (Replay page); null once it is resolved
export function incidentCoach(incidentId: string): LiveIncidentDto | null {
    const incident = liveIncident(incidentId)
    return incident ? withoutDismissed([coachOf(incident, listPatterns(), now())])[0] : null
}

function saveNudge(incidentId: string, nudge: NudgeDto, changes: { state?: string; acted?: boolean; workNote?: boolean }) {
    const row = new GlideRecord(NUDGE)
    row.addQuery('incident', incidentId)
    row.addQuery('key', nudge.key)
    row.query()
    if (!row.next()) {
        row.initialize()
        row.setValue('incident', incidentId)
        row.setValue('key', nudge.key)
    }
    row.setValue('kind', nudge.kind)
    row.setValue('level', nudge.level)
    row.setValue('message', nudge.message.substring(0, 255))
    if (changes.state) row.setValue('state', changes.state)
    if (changes.acted) {
        row.setValue('acted_by', gs.getUserID())
        row.setValue('acted_on', new GlideDateTime())
    }
    if (changes.workNote) row.setValue('work_note_posted', true)
    if (row.isNewRecord()) row.insert()
    else row.update()
}

// Actions are checked against the nudges as they stand now, so a stale page cannot reassign to an arbitrary group
function currentNudge(incidentId: string, key: string): { incident: GlideRecordSecure<'incident'>; nudge: NudgeDto } {
    const incident = liveIncident(incidentId)
    if (!incident) throw new Error('The incident is no longer live')
    const nudge = coachOf(incident, listPatterns(), now()).nudges.find((candidate) => candidate.key === key)
    if (!nudge) throw new Error('This nudge no longer applies; refresh the page')
    return { incident, nudge }
}

// Journal fields take a new entry by assignment; setValue on them is silently dropped from scoped code
function addJournalEntry(record: GlideRecord<'incident'>, field: 'work_notes' | 'comments', text: string) {
    ;(record as any)[field] = text
}

function writable(incident: GlideRecordSecure<'incident'>) {
    if (!incident.canWrite()) throw new Error(`You are not allowed to update ${incident.getValue('number')}`)
}

function evidenceText(nudge: NudgeDto): string {
    return nudge.evidence.length ? ` (${nudge.evidence.map((item) => item.number).join(', ')})` : ''
}

export function dismissNudge(incidentId: string, key: string) {
    const { nudge } = currentNudge(incidentId, key)
    saveNudge(incidentId, nudge, { state: 'dismissed', acted: true })
}

export function actOnNudge(incidentId: string, key: string) {
    const { incident, nudge } = currentNudge(incidentId, key)
    writable(incident)
    if (!nudge.action || (nudge.action.type !== 'reassign' && nudge.action.type !== 'link_problem')) throw new Error('This nudge has no action to apply')
    const reassign = nudge.action.type === 'reassign'
    incident.setValue(reassign ? 'assignment_group' : 'problem_id', nudge.action.target)
    if (reassign) incident.setValue('assigned_to', '')
    addJournalEntry(incident, 'work_notes', `${COACH_NOTE_PREFIX} ${nudge.action.label}: ${nudge.message}${evidenceText(nudge)}.`)
    if (!incident.update()) throw new Error(`${incident.getValue('number')} could not be updated`)
    saveNudge(incidentId, nudge, { state: 'acted', acted: true })
}

// The replay is rebuilt first so the draft sees the latest work notes
export function draftUpdate(incidentId: string): string {
    const incident = liveIncident(incidentId)
    if (!incident) throw new Error('The incident is no longer live')
    buildReplay(incident)
    return runSkill(COMMS_SKILL, incident.getValue('number'))
}

export function postUpdate(incidentId: string, text: string, key: string) {
    const incident = liveIncident(incidentId)
    if (!incident) throw new Error('The incident is no longer live')
    writable(incident)
    if (!text.trim()) throw new Error('The update is empty')
    // Read before posting: the update restarts the comms clock, which changes the nudge's key
    const nudge = coachOf(incident, [], now()).nudges.find((candidate) => candidate.key === key)
    addJournalEntry(incident, 'comments', text.trim())
    if (!incident.update()) throw new Error(`${incident.getValue('number')} could not be updated`)
    if (nudge) saveNudge(incidentId, nudge, { state: 'acted', acted: true })
}

// Scheduled job: one work note per breached clock, and one per routing or pattern hint, on live P1/P2 incidents
// that are being worked (not gone quiet)
export function refreshNudges(): number {
    if (!workNotesOn()) return 0
    const at = now()
    const patterns = listPatterns()
    const live: LiveIncidentDto[] = []
    const incident = new GlideRecord('incident')
    incident.addEncodedQuery(`${LIVE_QUERY}^priorityIN1,2`)
    incident.setLimit(MAX_LIVE)
    incident.query()
    while (incident.next()) live.push(coachOf(incident, patterns, at))
    const rows = nudgeRows(live.map((item) => item.sysId))
    let posted = 0
    live.forEach((item) => {
        if (item.stale) return
        const due = item.nudges.filter((nudge) => {
            const row = rows[`${item.sysId}|${nudge.key}`]
            if (row && (row.workNotePosted || row.state !== 'open')) return false
            return nudge.kind === 'routing' || nudge.kind === 'pattern' || nudge.level === 'breach'
        })
        if (!due.length) return
        const target = new GlideRecord('incident')
        if (!target.get('sys_id', item.sysId)) return
        addJournalEntry(target, 'work_notes', due.map((nudge) => `${COACH_NOTE_PREFIX} ${nudge.message}. ${nudge.detail}${evidenceText(nudge)}.`).join('\n'))
        target.update()
        due.forEach((nudge) => saveNudge(item.sysId, nudge, { workNote: true }))
        posted += due.length
    })
    return posted
}
