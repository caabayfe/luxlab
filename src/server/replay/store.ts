import { gs, GlideDateTime, GlideRecord, GlideRecordSecure } from '@servicenow/glide'
import { Analysis, TimelineEvent } from './types.ts'
import { auditEvents, journalEvents, loadFacts, recordEvents } from './sources.ts'
import { alertEvents, childEvents, commsEvents, slaEvents, taskEvents } from './related.ts'
import { analyse } from './analysis.ts'

const REPLAY = 'x_everi_luxlab_replay'
const EVENT = 'x_everi_luxlab_replay_event'

export interface ReplayEventDto {
    sequence: number
    occurredAt: string
    source: string
    kind: string
    phase: string
    actor: string
    summary: string
    fromValue: string
    toValue: string
    detail: string
    keyMoment: boolean
}

export interface ReplayDto {
    incident: { sysId: string; number: string; shortDescription: string; priority: string; majorState: string; group: string }
    status: string
    builtOn: string
    impactStart: string
    openedAt: string
    resolvedAt: string
    ongoing: boolean
    minutesToResolve: number
    reassignments: number
    handoffs: number
    silentGaps: number
    phases: { [phase: string]: number }
    error: string
    events: ReplayEventDto[]
}

// Source tables like sys_audit are read without ACLs, so access is gated on the incident itself
export function readableIncident(incidentId: string): GlideRecordSecure<'incident'> | null {
    const incident = new GlideRecordSecure('incident')
    return incident.get('sys_id', incidentId) ? incident : null
}

function dateTime(ms: number): GlideDateTime {
    const value = new GlideDateTime()
    value.setNumericValue(ms)
    return value
}

function replayFor(incidentId: string): GlideRecord {
    const replay = new GlideRecord(REPLAY)
    if (!replay.get('incident', incidentId)) {
        replay.initialize()
        replay.setValue('incident', incidentId)
    }
    return replay
}

function saveEvents(replayId: string, events: TimelineEvent[]) {
    const old = new GlideRecord(EVENT)
    old.addQuery('replay', replayId)
    old.deleteMultiple()
    events.forEach((event, index) => {
        const row = new GlideRecord(EVENT)
        row.initialize()
        row.setValue('replay', replayId)
        row.setValue('sequence', index + 1)
        row.setValue('occurred_at', dateTime(event.at))
        row.setValue('source', event.source)
        row.setValue('kind', event.kind)
        row.setValue('phase', event.phase || '')
        row.setValue('actor', event.actor || '')
        row.setValue('summary', event.summary.substring(0, 500))
        row.setValue('from_value', (event.fromValue || '').substring(0, 255))
        row.setValue('to_value', (event.toValue || '').substring(0, 255))
        row.setValue('detail', event.detail || '')
        row.setValue('key_moment', event.keyMoment)
        row.insert()
    })
}

function saveAnalysis(replay: GlideRecord, analysis: Analysis, eventCount: number, resolvedAt: number | null) {
    replay.setValue('status', 'ready')
    replay.setValue('error', '')
    replay.setValue('built_on', new GlideDateTime())
    replay.setValue('impact_start', dateTime(analysis.impactStart))
    replay.setValue('resolved_at', resolvedAt ? dateTime(resolvedAt) : '')
    replay.setValue('ongoing', analysis.ongoing)
    replay.setValue('minutes_to_resolve', analysis.minutesToResolve)
    replay.setValue('reassignments', analysis.reassignments)
    replay.setValue('handoffs', analysis.handoffs)
    replay.setValue('silent_gaps', analysis.silentGaps)
    replay.setValue('event_count', eventCount)
    replay.setValue('phases', JSON.stringify(analysis.phases))
}

export function buildReplay(incident: GlideRecordSecure<'incident'>): void {
    const replay = replayFor(incident.getUniqueValue())
    try {
        const facts = loadFacts(incident)
        const collected = [
            ...recordEvents(incident, facts),
            ...auditEvents(facts),
            ...journalEvents(facts),
            ...slaEvents(facts),
            ...taskEvents(facts),
            ...childEvents(facts),
            ...alertEvents(facts),
            ...commsEvents(facts),
        ]
        // Initial-value rows only seed the analysis; they are not moments in the story
        const { events, analysis } = analyse(facts, collected)
        const story = events.filter((event) => !event.kind.startsWith('initial_'))
        replay.setValue('opened_at', dateTime(facts.openedAt))
        saveAnalysis(replay, analysis, story.length, facts.resolvedAt)
        const replayId = replay.isNewRecord() ? replay.insert() : (replay.update(), replay.getUniqueValue())
        saveEvents(replayId, story)
    } catch (e) {
        gs.error(`LuxLab replay failed for ${incident.getValue('number')}: ${e}`)
        replay.setValue('status', 'failed')
        replay.setValue('error', String(e).substring(0, 1000))
        if (replay.isNewRecord()) replay.insert()
        else replay.update()
    }
}

function eventsOf(replayId: string): ReplayEventDto[] {
    const events: ReplayEventDto[] = []
    const row = new GlideRecord(EVENT)
    row.addQuery('replay', replayId)
    row.orderBy('sequence')
    row.query()
    while (row.next()) {
        events.push({
            sequence: parseInt(row.getValue('sequence'), 10),
            occurredAt: row.getValue('occurred_at'),
            source: row.getValue('source'),
            kind: row.getValue('kind'),
            phase: row.getValue('phase') || '',
            actor: row.getValue('actor') || '',
            summary: row.getValue('summary') || '',
            fromValue: row.getValue('from_value') || '',
            toValue: row.getValue('to_value') || '',
            detail: row.getValue('detail') || '',
            keyMoment: row.getValue('key_moment') === '1',
        })
    }
    return events
}

export function loadReplay(incident: GlideRecordSecure<'incident'>): ReplayDto | null {
    const replay = new GlideRecord(REPLAY)
    if (!replay.get('incident', incident.getUniqueValue())) return null
    return {
        incident: {
            sysId: incident.getUniqueValue(),
            number: incident.getValue('number'),
            shortDescription: incident.getValue('short_description') || '',
            priority: incident.getValue('priority') || '5',
            majorState: incident.getDisplayValue('major_incident_state'),
            group: incident.getDisplayValue('assignment_group'),
        },
        status: replay.getValue('status'),
        builtOn: replay.getValue('built_on') || '',
        impactStart: replay.getValue('impact_start') || '',
        openedAt: replay.getValue('opened_at') || '',
        resolvedAt: replay.getValue('resolved_at') || '',
        ongoing: replay.getValue('ongoing') === '1',
        minutesToResolve: parseInt(replay.getValue('minutes_to_resolve'), 10) || 0,
        reassignments: parseInt(replay.getValue('reassignments'), 10) || 0,
        handoffs: parseInt(replay.getValue('handoffs'), 10) || 0,
        silentGaps: parseInt(replay.getValue('silent_gaps'), 10) || 0,
        phases: JSON.parse(replay.getValue('phases') || '{}'),
        error: replay.getValue('error') || '',
        events: eventsOf(replay.getUniqueValue()),
    }
}
