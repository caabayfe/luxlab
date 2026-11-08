import { GlideDateTime, GlideRecord, GlideRecordSecure } from '@servicenow/glide'
import { gapLimitMinutes, PASSIVE_KINDS } from './analysis.ts'
import { buildReplay, readableIncident } from './store.ts'
import { canDecide } from './follow-ups.ts'
import { Facet, listPatterns, PATTERN, PatternDto, PatternEvidence } from './pattern-store.ts'

const REPLAY = 'x_everi_luxlab_replay'
const EVENT = 'x_everi_luxlab_replay_event'

export const WINDOW_DAYS = 90
// Same population as the replay candidates: P1/P2 and accepted major incidents, here only resolved ones
const IN_WINDOW = `resolved_atRELATIVEGT@dayofweek@ago@${WINDOW_DAYS}^priorityIN1,2^ORmajor_incident_state=accepted`
const REPLAY_IN_WINDOW =
    `status=ready^ongoing=false^incident.resolved_atRELATIVEGT@dayofweek@ago@${WINDOW_DAYS}` +
    '^incident.priorityIN1,2^ORincident.major_incident_state=accepted'
// Opened and resolved in the same minute: loaded records with no response to learn from
const WITH_HISTORY = '^minutes_to_resolve>0'

// A batch stays well inside the REST transaction limit; the page and the nightly job call it until nothing is left
const BATCH_SIZE = 15
const BATCH_MS = 20 * 1000
const QUERY_CHUNK = 200

const MIN_INCIDENTS = 2
const MIN_DETECTION_MINUTES = 5
const MIN_WAITING_MINUTES = 30
// One incident left open for months must not outweigh a pattern seen every week
const CAP_MINUTES = 3 * 24 * 60
const MAX_FACETS = 3
const MINUTE_MS = 60 * 1000

export interface Coverage {
    windowDays: number
    incidents: number
    replayed: number
    pending: number
    // Replayed, but resolved the minute they were opened, so left out of the patterns
    withoutHistory: number
}

export interface PatternsDto {
    coverage: Coverage
    patterns: PatternDto[]
    canDecide: boolean
}

interface Row {
    at: number
    kind: string
    fromValue: string
    toValue: string
}

interface Sample {
    incidentId: string
    number: string
    shortDescription: string
    priority: string
    group: string
    service: string
    category: string
    ci: string
    openedAt: number
    impactStart: number
    resolvedAt: number
    minutesToResolve: number
    waiting: number
    events: Row[]
}

interface Segment {
    group: string
    from: number
    to: number
}

interface Found {
    key: string
    type: string
    title: string
    group: string
    target: string
    dimension: string
    hits: { sample: Sample; minutes: number }[]
}

function now(): number {
    return new GlideDateTime().getNumericValue()
}

function epoch(value: string): number {
    return value ? new GlideDateTime(value).getNumericValue() : 0
}

function chunks<T>(items: T[], size: number): T[][] {
    const out: T[][] = []
    for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size))
    return out
}

function median(values: number[]): number {
    if (!values.length) return 0
    const sorted = values.slice().sort((a, b) => a - b)
    const middle = Math.floor(sorted.length / 2)
    return Math.round(sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2)
}

function windowIncidents(): string[] {
    const ids: string[] = []
    const incident = new GlideRecordSecure('incident')
    incident.addEncodedQuery(IN_WINDOW)
    incident.query()
    while (incident.next()) ids.push(incident.getUniqueValue())
    return ids
}

// A replay built while the incident was still open misses its ending; failed builds count as done so batches always finish
function pendingOf(incidentIds: string[]): string[] {
    const done: { [incidentId: string]: boolean } = {}
    for (const chunk of chunks(incidentIds, QUERY_CHUNK)) {
        const replay = new GlideRecord(REPLAY)
        replay.addQuery('incident', 'IN', chunk.join(','))
        replay.addEncodedQuery('ongoing=false^ORstatus=failed')
        replay.query()
        while (replay.next()) done[replay.getValue('incident')] = true
    }
    return incidentIds.filter((id) => !done[id])
}

function withoutHistory(): number {
    const replays = new GlideRecord(REPLAY)
    replays.addEncodedQuery(`${REPLAY_IN_WINDOW}^minutes_to_resolve<=0`)
    replays.query()
    return replays.getRowCount()
}

function coverageOf(incidents: number, pending: number): Coverage {
    return { windowDays: WINDOW_DAYS, incidents, replayed: incidents - pending, pending, withoutHistory: withoutHistory() }
}

export function coverage(): Coverage {
    const incidents = windowIncidents()
    return coverageOf(incidents.length, pendingOf(incidents).length)
}

// Builds the next batch of missing replays; returns the coverage after it
export function replayBatch(): Coverage {
    const started = now()
    const incidents = windowIncidents()
    const pending = pendingOf(incidents)
    let built = 0
    for (const incidentId of pending) {
        if (built >= BATCH_SIZE || now() - started > BATCH_MS) break
        const incident = readableIncident(incidentId)
        if (incident) buildReplay(incident)
        built++
    }
    return coverageOf(incidents.length, pending.length - built)
}

function loadSamples(): Sample[] {
    const samples: { [replayId: string]: Sample } = {}
    const replay = new GlideRecord(REPLAY)
    replay.addEncodedQuery(REPLAY_IN_WINDOW + WITH_HISTORY)
    replay.query()
    while (replay.next()) {
        const phases = JSON.parse(replay.getValue('phases') || '{}')
        samples[replay.getUniqueValue()] = {
            incidentId: replay.getValue('incident'),
            number: replay.getDisplayValue('incident'),
            shortDescription: replay.getValue('incident.short_description') || '',
            priority: replay.getValue('incident.priority') || '',
            group: replay.getDisplayValue('incident.assignment_group'),
            service: replay.getDisplayValue('incident.business_service'),
            category: replay.getDisplayValue('incident.category'),
            ci: replay.getDisplayValue('incident.cmdb_ci'),
            openedAt: epoch(replay.getValue('opened_at')),
            impactStart: epoch(replay.getValue('impact_start')),
            resolvedAt: epoch(replay.getValue('resolved_at')),
            minutesToResolve: parseInt(replay.getValue('minutes_to_resolve'), 10) || 0,
            waiting: Math.round(phases.waiting || 0),
            events: [],
        }
    }
    for (const chunk of chunks(Object.keys(samples), QUERY_CHUNK)) {
        const event = new GlideRecord(EVENT)
        event.addQuery('replay', 'IN', chunk.join(','))
        event.orderBy('sequence')
        event.query()
        while (event.next()) {
            samples[event.getValue('replay')].events.push({
                at: epoch(event.getValue('occurred_at')),
                kind: event.getValue('kind'),
                fromValue: event.getValue('from_value') || '',
                toValue: event.getValue('to_value') || '',
            })
        }
    }
    return Object.keys(samples).map((id) => samples[id])
}

// Who held the incident and when; the first group change names the group it was opened with
function segmentsOf(sample: Sample): Segment[] {
    const changes = sample.events.filter((event) => event.kind === 'assignment_group')
    const segments: Segment[] = []
    let group = changes.length ? changes[0].fromValue : sample.group
    let from = sample.openedAt
    for (const change of changes) {
        segments.push({ group, from, to: change.at })
        group = change.toValue
        from = change.at
    }
    segments.push({ group, from, to: sample.resolvedAt })
    return segments
}

function groupAt(segments: Segment[], at: number): string {
    const segment = segments.find((candidate) => at >= candidate.from && at < candidate.to)
    return (segment || segments[segments.length - 1]).group
}

function add(found: { [key: string]: Found }, pattern: Omit<Found, 'hits'>, sample: Sample, minutes: number) {
    const entry = found[pattern.key] || (found[pattern.key] = { ...pattern, hits: [] })
    const hit = entry.hits.find((candidate) => candidate.sample === sample)
    if (hit) hit.minutes += minutes
    else entry.hits.push({ sample, minutes })
}

// Intermediate groups only: first-line triage handing over to the resolver is the normal path, as in the misrouted phase
function findMisroutes(found: { [key: string]: Found }, sample: Sample, segments: Segment[]) {
    const target = segments[segments.length - 1].group
    if (!target) return
    segments.slice(1).forEach((segment) => {
        const minutes = (segment.to - segment.from) / MINUTE_MS
        if (!segment.group || segment.group === target || minutes <= 0) return
        add(
            found,
            { key: `misroute:${segment.group}>${target}`, type: 'misroute', title: `Sent to ${segment.group}, resolved by ${target}`, group: segment.group, target, dimension: '' },
            sample,
            minutes
        )
    })
}

// A gap lasts until the next event someone acted on; only the minutes above the priority's limit count
function findGaps(found: { [key: string]: Found }, sample: Sample, segments: Segment[]) {
    const limit = gapLimitMinutes(sample.priority)
    sample.events.forEach((event, index) => {
        if (event.kind !== 'silent_gap') return
        const next = sample.events.slice(index + 1).find((later) => !PASSIVE_KINDS.includes(later.kind) && later.at > event.at)
        const minutes = ((next ? next.at : sample.resolvedAt) - event.at) / MINUTE_MS - limit
        const group = groupAt(segments, event.at)
        if (minutes <= 0 || !group) return
        add(found, { key: `gaps:${group}`, type: 'gaps', title: `Silent gaps while with ${group}`, group, target: '', dimension: '' }, sample, minutes)
    })
}

function findDetection(found: { [key: string]: Found }, sample: Sample) {
    const minutes = (sample.openedAt - sample.impactStart) / MINUTE_MS
    const dimension = sample.service || sample.ci || sample.category
    if (minutes < MIN_DETECTION_MINUTES || !dimension) return
    add(
        found,
        { key: `detection:${dimension}`, type: 'detection', title: `Alerts raised before the incident was opened: ${dimension}`, group: '', target: '', dimension },
        sample,
        minutes
    )
}

function findWaiting(found: { [key: string]: Found }, sample: Sample, segments: Segment[]) {
    const target = segments[segments.length - 1].group
    if (sample.waiting < MIN_WAITING_MINUTES || !target) return
    add(found, { key: `waiting:${target}`, type: 'waiting', title: `Long on-hold time with ${target}`, group: target, target, dimension: '' }, sample, sample.waiting)
}

function facetsOf(samples: Sample[], value: (sample: Sample) => string): Facet[] {
    const counts: { [name: string]: number } = {}
    samples.forEach((sample) => {
        const name = value(sample)
        if (name) counts[name] = (counts[name] || 0) + 1
    })
    return Object.keys(counts)
        .map((name) => ({ name, count: counts[name] }))
        .sort((a, b) => b.count - a.count)
        .slice(0, MAX_FACETS)
}

function savePattern(pattern: Found, samples: Sample[], minedOn: GlideDateTime) {
    const hits = pattern.hits.map((hit) => ({ sample: hit.sample, minutes: Math.min(Math.round(hit.minutes), CAP_MINUTES) }))
    hits.sort((a, b) => b.minutes - a.minutes)
    const members = hits.map((hit) => hit.sample)
    const others = samples.filter((sample) => members.indexOf(sample) < 0)
    const evidence: PatternEvidence[] = hits.map((hit) => ({
        sysId: hit.sample.incidentId,
        number: hit.sample.number,
        shortDescription: hit.sample.shortDescription,
        minutes: hit.minutes,
    }))

    const record = new GlideRecord(PATTERN)
    if (!record.get('key', pattern.key)) {
        record.initialize()
        record.setValue('key', pattern.key)
        record.setValue('first_seen', minedOn)
    }
    record.setValue('type', pattern.type)
    record.setValue('title', pattern.title.substring(0, 255))
    record.setValue('group', pattern.group)
    record.setValue('target', pattern.target)
    record.setValue('dimension', pattern.dimension)
    record.setValue('incident_count', hits.length)
    record.setValue('minutes_lost', hits.reduce((sum, hit) => sum + hit.minutes, 0))
    record.setValue('median_minutes', median(hits.map((hit) => hit.minutes)))
    record.setValue('median_ttr', median(members.map((sample) => sample.minutesToResolve)))
    record.setValue('baseline_ttr', median(others.map((sample) => sample.minutesToResolve)))
    record.setValue('incidents', JSON.stringify(evidence))
    record.setValue(
        'facets',
        JSON.stringify({ services: facetsOf(members, (sample) => sample.service), categories: facetsOf(members, (sample) => sample.category) })
    )
    record.setValue('active', true)
    record.setValue('mined_on', minedOn)
    if (record.isNewRecord()) record.insert()
    else record.update()
}

// Rebuilds every pattern from the replays in the window; patterns no longer found stay, marked inactive
export function minePatterns(): number {
    const samples = loadSamples()
    const found: { [key: string]: Found } = {}
    for (const sample of samples) {
        const segments = segmentsOf(sample)
        findMisroutes(found, sample, segments)
        findGaps(found, sample, segments)
        findDetection(found, sample)
        findWaiting(found, sample, segments)
    }
    const minedOn = new GlideDateTime()
    const keys = Object.keys(found).filter((key) => found[key].hits.length >= MIN_INCIDENTS)
    keys.forEach((key) => savePattern(found[key], samples, minedOn))

    const stale = new GlideRecord(PATTERN)
    stale.addQuery('active', true)
    stale.query()
    while (stale.next()) {
        if (keys.indexOf(stale.getValue('key')) >= 0) continue
        stale.setValue('active', false)
        stale.update()
    }
    return keys.length
}

export function patternsDto(): PatternsDto {
    return { coverage: coverage(), patterns: listPatterns(), canDecide: canDecide() }
}

// Nightly job: replay whatever is missing, then mine
export function refreshPatterns(maxMs: number): number {
    const started = now()
    let left = coverage().pending
    while (left > 0 && now() - started < maxMs) {
        const next = replayBatch().pending
        if (next >= left) break
        left = next
    }
    return minePatterns()
}
