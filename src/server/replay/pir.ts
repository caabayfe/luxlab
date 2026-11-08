import { gs, GlideDateTime, GlideRecord, GlideRecordSecure } from '@servicenow/glide'
import { TimelineEvent } from './types.ts'
import { epoch } from './sources.ts'
import { blamelessSummary } from './analysis.ts'
import { markdownToHtml } from './markdown.ts'

// Post Incident Review of SOW Incident (sn_sow_inc). Its timeline is a JSON array on the PIR record, and regenerating it
// rebuilds every system event but keeps CUSTOM_EVENT entries as they are (PIRManagerSNC._getCustomEvents), so LuxLab
// writes custom events only.
const PIR = 'sn_sow_inc_post_incident_review'
const SUPPLEMENTAL = 'sys_activity_supplemental'
const CUSTOM_EVENT = 'CUSTOM_EVENT'
const REPLAY = 'x_everi_luxlab_replay'
const EVENT = 'x_everi_luxlab_replay_event'

// Ids of the events LuxLab writes; the rest of the id is the replay event key
const LUX_PREFIX = 'lux:'

// The PIR builds its own milestones and incident task events; PIR notes came from there in the first place
const COVERED_SOURCES = ['record', 'task', 'pir']
const PUSHED_KINDS = ['silent_gap', 'sla_breach']
const PUSHED_SOURCES = ['alert', 'comms']
// The PIR timeline editor accepts up to 100 characters, so longer messages could not be edited there
const MAX_MESSAGE = 100

interface PirEvent {
    id: string
    timestamp: string
    message: string
    eventType: string
    generatedBy?: string
    isHidden?: boolean
    isDeleted?: boolean
    // What LuxLab last wrote; a different message means someone edited the event in the PIR
    luxlabMessage?: string
    [property: string]: any
}

// empty: nothing to lose; ours: still exactly what LuxLab wrote; other: the platform's starting summary or someone's edits
export type ReportState = 'empty' | 'ours' | 'other'

export interface PirDto {
    sysId: string
    state: string
    canWrite: boolean
    pushedOn: string
    pushedCount: number
    canWriteReport: boolean
    reportState: ReportState
    reportOn: string
}

function refusal(message: string, status: number): Error {
    const error: any = new Error(message)
    error.status = status
    return error
}

// SOW Incident may be missing, or its tables restricted; the replay works without it
function optional<T>(name: string, fallback: T, read: () => T): T {
    try {
        return read()
    } catch (e) {
        gs.warn(`LuxLab replay: skipped ${name}: ${e}`)
        return fallback
    }
}

function pirInstalled(): boolean {
    return optional(PIR, false, () => new GlideRecord(PIR).isValid())
}

function pirOf(incidentId: string): GlideRecord<'sn_sow_inc_post_incident_review'> | null {
    if (!pirInstalled()) return null
    const pir = new GlideRecord(PIR)
    pir.addQuery('incident_ref', incidentId)
    pir.setLimit(1)
    pir.query()
    return pir.next() ? pir : null
}

function timelineOf(pir: GlideRecord<'sn_sow_inc_post_incident_review'>): PirEvent[] {
    try {
        const events = JSON.parse(pir.getValue('timeline_events') || '{}').events
        return Array.isArray(events) ? events : []
    } catch (e) {
        gs.warn(`LuxLab replay: unreadable PIR timeline on ${pir.getUniqueValue()}: ${e}`)
        return []
    }
}

function isLuxLab(event: PirEvent): boolean {
    return event.eventType === CUSTOM_EVENT && String(event.id || '').indexOf(LUX_PREFIX) === 0
}

function wasEdited(event: PirEvent): boolean {
    return event.message !== event.luxlabMessage
}

// Work notes and comments flagged in the activity stream; flags exist before the PIR does
function flaggedJournalKeys(incidentId: string): { [key: string]: boolean } {
    return optional(SUPPLEMENTAL, {}, () => {
        const keys: { [key: string]: boolean } = {}
        const activity = new GlideRecord(SUPPLEMENTAL as any)
        if (!activity.isValid()) return keys
        activity.addQuery('document_id', incidentId)
        activity.query()
        while (activity.next()) {
            let payload: any = {}
            try {
                payload = JSON.parse(activity.getValue('payload' as any) || '{}')
            } catch (e) {
                continue
            }
            if (payload && payload.flag) keys[`journal:${activity.getValue('event_id' as any)}`] = true
        }
        return keys
    })
}

function noteEvent(event: PirEvent): TimelineEvent {
    return {
        key: `pir:${event.id}`,
        at: epoch(event.timestamp),
        source: 'pir',
        kind: 'pir_note',
        actor: '',
        summary: `PIR note: ${String(event.message || '').replace(/\s+/g, ' ')}`,
        // Someone added it to the review on purpose
        keyMoment: true,
        hidden: !!event.isHidden,
    }
}

// Applies the curation done in the PIR to freshly collected events and adds the notes written there; returns the PIR sys_id
export function applyPirCuration(incidentId: string, events: TimelineEvent[]): string {
    const flagged = flaggedJournalKeys(incidentId)
    const pir = pirOf(incidentId)
    const hidden: { [key: string]: boolean } = {}
    if (pir) {
        timelineOf(pir).forEach((event) => {
            if (event.eventType !== CUSTOM_EVENT) return
            // Hiding or deleting a LuxLab event in the PIR means it should not count in the replay either
            if (isLuxLab(event)) {
                if (event.isHidden || event.isDeleted) hidden[event.id.substring(LUX_PREFIX.length)] = true
            } else if (!event.isDeleted && event.timestamp) {
                events.push(noteEvent(event))
            }
        })
    }
    events.forEach((event) => {
        if (flagged[event.key]) {
            event.keyMoment = true
            event.pirFlagged = true
        }
        if (hidden[event.key]) event.hidden = true
    })
    return pir ? pir.getUniqueValue() : ''
}

function reportStateOf(pir: GlideRecord<'sn_sow_inc_post_incident_review'>, replay: GlideRecord): ReportState {
    const draft = (pir.getValue('report_draft') || '').trim()
    if (!draft) return 'empty'
    return draft === (replay.getValue('pir_report') || '').trim() ? 'ours' : 'other'
}

export function pirStatus(incidentId: string, replay: GlideRecord): PirDto | null {
    if (!pirInstalled()) return null
    const pir = new GlideRecordSecure(PIR)
    pir.addQuery('incident_ref', incidentId)
    pir.query()
    if (!pir.next()) return null
    return {
        sysId: pir.getUniqueValue(),
        state: pir.getValue('state'),
        canWrite: pir.canWrite(),
        pushedOn: replay.getValue('pir_pushed_on') || '',
        pushedCount: parseInt(replay.getValue('pir_pushed_count'), 10) || 0,
        // The report draft has its own write ACL, stricter than the record's
        canWriteReport: pir.getElement('report_draft').canWrite(),
        reportState: reportStateOf(pir, replay),
        reportOn: replay.getValue('pir_report_on') || '',
    }
}

function phaseName(phase: string): string {
    return phase ? phase.charAt(0).toUpperCase() + phase.substring(1) : 'Replay'
}

function pushable(row: GlideRecord): boolean {
    if (row.getValue('hidden') === '1' || row.getValue('pir_flagged') === '1') return false
    if (COVERED_SOURCES.indexOf(row.getValue('source')) >= 0) return false
    return row.getValue('key_moment') === '1' || PUSHED_KINDS.indexOf(row.getValue('kind')) >= 0 || PUSHED_SOURCES.indexOf(row.getValue('source')) >= 0
}

function messageOf(row: GlideRecord): string {
    const summary = blamelessSummary(row.getValue('kind'), row.getValue('summary') || '', row.getValue('to_value') || '')
    const message = `[Replay · ${phaseName(row.getValue('phase'))}] ${summary}`
    return message.length > MAX_MESSAGE ? `${message.substring(0, MAX_MESSAGE - 1)}…` : message
}

// The replay events worth a place in the PIR, keyed by PIR event id
function selectedEvents(replayId: string): { [id: string]: { timestamp: string; message: string } } {
    const selected: { [id: string]: { timestamp: string; message: string } } = {}
    const row = new GlideRecord(EVENT)
    row.addQuery('replay', replayId)
    row.orderBy('sequence')
    row.query()
    while (row.next()) {
        if (!pushable(row) || !row.getValue('event_key')) continue
        // Timestamps in UTC, like the PIR's own system events
        selected[LUX_PREFIX + row.getValue('event_key')] = { timestamp: row.getValue('occurred_at'), message: messageOf(row) }
    }
    return selected
}

// Edits made in the PIR win: hidden, deleted and reworded LuxLab events are kept as they are
function mergeTimeline(current: PirEvent[], selected: { [id: string]: { timestamp: string; message: string } }): PirEvent[] {
    const merged = current.filter((event) => !isLuxLab(event))
    const previous: { [id: string]: PirEvent } = {}
    current.filter(isLuxLab).forEach((event) => (previous[event.id] = event))
    Object.keys(selected).forEach((id) => {
        const { timestamp, message } = selected[id]
        const existing = previous[id]
        delete previous[id]
        if (!existing) {
            merged.push({ id, timestamp, message, eventType: CUSTOM_EVENT, generatedBy: 'USER', luxlabMessage: message })
        } else if (wasEdited(existing)) {
            merged.push({ ...existing, timestamp })
        } else {
            merged.push({ ...existing, timestamp, message, luxlabMessage: message })
        }
    })
    // Events the replay no longer selects are removed, unless they carry someone's edit
    Object.keys(previous).forEach((id) => {
        const event = previous[id]
        if (event.isHidden || event.isDeleted || wasEdited(event)) merged.push(event)
    })
    return merged
}

function draftPir(incidentId: string): GlideRecordSecure<'sn_sow_inc_post_incident_review'> {
    if (!pirInstalled()) throw refusal('Post incident reviews are not available on this instance', 409)
    const pir = new GlideRecordSecure(PIR)
    pir.addQuery('incident_ref', incidentId)
    pir.query()
    if (!pir.next()) throw refusal('There is no post incident review yet: it is created when the major incident is resolved and accepted', 409)
    if (pir.getValue('state') !== 'draft') throw refusal('The post incident review is already published', 409)
    return pir
}

function readyReplay(incidentId: string): GlideRecord {
    const replay = new GlideRecord(REPLAY)
    if (!replay.get('incident', incidentId) || replay.getValue('status') !== 'ready') throw refusal('The replay could not be built', 500)
    return replay
}

// Sends the replay's key moments to the PIR timeline; the platform's PIR ACLs decide who may write (OOB: itil and up,
// while the report_draft field is limited to major incident managers, the assignee and co-authors)
export function pushToPir(incidentId: string): number {
    const pir = draftPir(incidentId)
    if (!pir.canWrite()) throw refusal('You are not allowed to edit this post incident review', 403)

    const replay = readyReplay(incidentId)
    const selected = selectedEvents(replay.getUniqueValue())
    const events = mergeTimeline(timelineOf(pir), selected)
    pir.setValue('timeline_events', JSON.stringify({ events }))
    if (!pir.update()) throw refusal('The post incident review could not be updated', 403)

    const count = Object.keys(selected).length
    replay.setValue('pir_id', pir.getUniqueValue())
    replay.setValue('pir_pushed_on', new GlideDateTime())
    replay.setValue('pir_pushed_count', count)
    replay.update()
    return count
}

const REPORT_NOTE = '<p><em>Drafted by LuxLab Incident Replay from the incident replay. Review it before publishing.</em></p>'

// Writes the incident review into the PIR report draft; text LuxLab did not write is only replaced when the user says so
export function writePirReport(incidentId: string, replace: boolean): void {
    const pir = draftPir(incidentId)
    if (!pir.getElement('report_draft').canWrite()) {
        throw refusal('Only major incident managers, the assigned engineer and co-authors can edit the report of this post incident review', 403)
    }
    const replay = readyReplay(incidentId)
    const review = (replay.getValue('review') || '').trim()
    if (!review) throw refusal('Write the incident review first', 409)
    if (reportStateOf(pir, replay) === 'other' && !replace) {
        throw refusal('The post incident review draft has text LuxLab did not write. Confirm to replace it.', 409)
    }
    // The PIR shows this draft with line breaks kept, so the markup carries no newlines between tags
    pir.setValue('report_draft', `${markdownToHtml(review).replace(/\n/g, '')}${REPORT_NOTE}`)
    if (!pir.update()) throw refusal('The post incident review could not be updated', 403)

    // Kept as the platform stored it, since saving an HTML field can rewrite the markup
    const written = new GlideRecord(PIR)
    written.get('sys_id', pir.getUniqueValue())
    replay.setValue('pir_id', pir.getUniqueValue())
    replay.setValue('pir_report', written.getValue('report_draft') || '')
    replay.setValue('pir_report_on', new GlideDateTime())
    replay.update()
}
