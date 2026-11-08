import { GlideDateTime, GlideRecord, GlideRecordSecure } from '@servicenow/glide'
import { PHASES } from './types.ts'
import { blamelessSummary, formatMinutes } from './analysis.ts'
import { buildReplay } from './store.ts'
import { followUpsOf } from './follow-ups.ts'

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
    'location',
    'business_impact',
    'assignment_group',
    'close_code',
    'close_notes',
] as const

// Records the PIR's technical overview and action items draw on
const RELATED_FIELDS = [
    { field: 'problem_id', label: 'problem' },
    { field: 'rfc', label: 'change request' },
    { field: 'caused_by', label: 'caused by change' },
] as const

export interface ReplayContext {
    error?: string
    incident?: string
    metrics?: string
    phases?: string
    timeline?: string
    followUps?: string
}

function minutesBetween(from: string, to: string): number {
    if (!from || !to) return 0
    return Math.round((new GlideDateTime(to).getNumericValue() - new GlideDateTime(from).getNumericValue()) / 60000)
}

function clip(text: string, max: number): string {
    const flat = text.replace(/\s+/g, ' ').trim()
    return flat.length > max ? `${flat.substring(0, max - 1)}…` : flat
}

function eventLine(event: GlideRecord, impactStart: string): string {
    const summary = blamelessSummary(event.getValue('kind'), event.getValue('summary') || '', event.getValue('to_value') || '')
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
    RELATED_FIELDS.forEach(({ field, label }) => {
        if (!incident.getValue(field)) return
        const description = incident.getDisplayValue(`${field}.short_description` as any)
        lines.push(`${label}: ${incident.getDisplayValue(field)}${description ? ` (${clip(description, 300)})` : ''}`)
    })
    return lines.join('\n')
}

// Approved follow-ups already exist as records; proposed ones still wait for a LuxLab manager
function followUpsText(replayId: string): string {
    return followUpsOf(replayId)
        .map((followUp) => {
            const record = followUp.problem || followUp.knowledge
            return `- [${followUp.state}] ${followUp.type}${record ? ` ${record.number}` : ''}: ${clip(followUp.title, 160)}`
        })
        .join('\n')
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

// Events hidden in the PIR are left out; on long incidents key moments and gaps are kept before routine events
function timelineText(replayId: string, impactStart: string): string {
    const event = new GlideRecord('x_everi_luxlab_replay_event')
    event.addQuery('replay', replayId)
    event.orderBy('sequence')
    event.query()
    const lines: { line: string; important: boolean }[] = []
    while (event.next()) {
        // Filtered here rather than in the query: rows built before the column existed have no value
        if (event.getValue('hidden') === '1') continue
        lines.push({ line: eventLine(event, impactStart), important: event.getValue('key_moment') === '1' || event.getValue('kind') === 'silent_gap' })
    }
    if (lines.length <= MAX_EVENTS) return lines.map((entry) => entry.line).join('\n')
    const important = lines.filter((entry) => entry.important).length
    let routine = Math.max(0, MAX_EVENTS - important)
    const kept = lines.filter((entry) => entry.important || routine-- > 0).slice(0, MAX_EVENTS)
    return `${kept.map((entry) => entry.line).join('\n')}\n(${lines.length - kept.length} routine events omitted)`
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
        followUps: followUpsText(replay.getUniqueValue()) || 'none yet',
    }
}
