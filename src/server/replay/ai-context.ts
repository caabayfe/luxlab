import { GlideDateTime, GlideRecord, GlideRecordSecure } from '@servicenow/glide'
import { PHASES } from './types.ts'
import { formatMinutes } from './analysis.ts'
import { buildReplay } from './store.ts'

// Keeps the prompt within a predictable size on very chatty incidents
const MAX_EVENTS = 150
const MAX_NOTE = 300

const INCIDENT_FIELDS = [
    'short_description',
    'description',
    'priority',
    'impact',
    'urgency',
    'category',
    'cmdb_ci',
    'business_service',
    'assignment_group',
    'close_code',
    'close_notes',
] as const

export interface ReplayContext {
    error?: string
    incident?: string
    metrics?: string
    phases?: string
    timeline?: string
}

function minutesBetween(from: string, to: string): number {
    if (!from || !to) return 0
    return Math.round((new GlideDateTime(to).getNumericValue() - new GlideDateTime(from).getNumericValue()) / 60000)
}

function clip(text: string, max: number): string {
    const flat = text.replace(/\s+/g, ' ').trim()
    return flat.length > max ? `${flat.substring(0, max - 1)}…` : flat
}

// The review is blameless: people are described by role, never by name
function eventLine(event: GlideRecord, impactStart: string): string {
    const kind = event.getValue('kind')
    let summary = event.getValue('summary') || ''
    if (kind === 'assigned_to') summary = event.getValue('to_value') ? 'Engineer assigned' : 'Engineer unassigned'
    const detail = event.getValue('source') === 'journal' ? '' : clip(event.getValue('detail') || '', MAX_NOTE)
    const marker = event.getValue('key_moment') === '1' ? ' [KEY]' : ''
    const offset = formatMinutes(minutesBetween(impactStart, event.getValue('occurred_at')))
    const phase = event.getValue('phase') || 'n/a'
    return `T+${offset} (${phase})${marker} ${clip(summary, 400)}${detail ? ` — ${detail}` : ''}`
}

function incidentText(incident: GlideRecordSecure<'incident'>): string {
    const lines = [`Number: ${incident.getValue('number')}`]
    INCIDENT_FIELDS.forEach((field) => {
        const value = incident.getDisplayValue(field)
        if (value) lines.push(`${field.replace(/_/g, ' ')}: ${clip(value, 1500)}`)
    })
    const major = incident.getDisplayValue('major_incident_state')
    if (major) lines.push(`major incident state: ${major}`)
    return lines.join('\n')
}

function metricsText(replay: GlideRecord): string {
    const ongoing = replay.getValue('ongoing') === '1'
    return [
        `Impact start: ${replay.getValue('impact_start')} (UTC)`,
        `Opened: ${replay.getValue('opened_at')} (UTC)`,
        `Resolved: ${replay.getValue('resolved_at') || 'not yet'} (UTC)`,
        `${ongoing ? 'Open for' : 'Time to resolve'}: ${formatMinutes(parseInt(replay.getValue('minutes_to_resolve'), 10) || 0)}`,
        `Group reassignments: ${replay.getValue('reassignments') || 0}`,
        `Engineer handoffs: ${replay.getValue('handoffs') || 0}`,
        `Silent gaps (no updates beyond the priority's limit): ${replay.getValue('silent_gaps') || 0}`,
    ].join('\n')
}

function phasesText(replay: GlideRecord): string {
    const phases = JSON.parse(replay.getValue('phases') || '{}')
    return PHASES.filter((phase) => phases[phase])
        .map((phase) => `${phase}: ${formatMinutes(phases[phase])}`)
        .join(', ')
}

function timelineText(replayId: string, impactStart: string): string {
    const event = new GlideRecord('x_everi_luxlab_replay_event')
    event.addQuery('replay', replayId)
    event.orderBy('sequence')
    event.setLimit(MAX_EVENTS)
    event.query()
    const lines: string[] = []
    while (event.next()) lines.push(eventLine(event, impactStart))
    return lines.join('\n')
}

function readyReplay(incident: GlideRecordSecure<'incident'>): GlideRecord | null {
    const replay = new GlideRecord('x_everi_luxlab_replay')
    if (replay.get('incident', incident.getUniqueValue()) && replay.getValue('status') === 'ready') return replay
    buildReplay(incident)
    return replay.get('incident', incident.getUniqueValue()) && replay.getValue('status') === 'ready' ? replay : null
}

// Flattened, name-free view of a replay for the Replay AI skills; builds the replay when missing
export function replayContext(incidentNumber: string): ReplayContext {
    const incident = new GlideRecordSecure('incident')
    if (!incidentNumber || !incident.get('number', incidentNumber.trim())) {
        return { error: `Incident ${incidentNumber} not found or not readable` }
    }
    const replay = readyReplay(incident)
    if (!replay) return { error: `The replay for ${incidentNumber} could not be built` }
    return {
        incident: incidentText(incident),
        metrics: metricsText(replay),
        phases: phasesText(replay),
        timeline: timelineText(replay.getUniqueValue(), replay.getValue('impact_start')),
    }
}
