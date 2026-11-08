import { GlideDateTime } from '@servicenow/glide'
import { Analysis, IncidentFacts, Phase, PhaseMinutes, PHASES, TimelineEvent } from './types.ts'

const MINUTE_MS = 60 * 1000
const STATE_ON_HOLD = '3'
const STATE_RESOLVED = '6'
const TRACKED = ['state', 'assignment_group', 'assigned_to']

// Longest acceptable silence while an incident is open, by priority
const GAP_MINUTES: { [priority: string]: number } = { '1': 30, '2': 60, '3': 240 }
const DEFAULT_GAP_MINUTES = 480

// Events that only describe the incident, not someone acting on it
// PIR notes are written after the fact, and coach notes are LuxLab's own nudges, so neither can break a silence
export const PASSIVE_KINDS = ['sla_start', 'sla_breach', 'silent_gap', 'pir_note', 'coach_note']

// Work notes the live coach posts start with this, so they are told apart from the team's own notes
export const COACH_NOTE_PREFIX = '[LuxLab coach]'

interface Snapshot {
    state: string
    assignment_group: string
    assigned_to: string
}

export function gapLimitMinutes(priority: string): number {
    return GAP_MINUTES[priority] || DEFAULT_GAP_MINUTES
}

export function formatMinutes(minutes: number): string {
    const hours = Math.floor(minutes / 60)
    const rest = Math.round(minutes % 60)
    return hours ? `${hours}h ${rest}m` : `${rest}m`
}

// Reviews and the PIR timeline are blameless: engineers are described by role, never by name
export function blamelessSummary(kind: string, summary: string, toValue: string): string {
    if (kind === 'assigned_to') return toValue ? 'Engineer assigned' : 'Engineer unassigned'
    return summary
}

function initialSnapshot(facts: IncidentFacts, events: TimelineEvent[]): Snapshot {
    const snapshot: Snapshot = { state: facts.state, assignment_group: facts.assignmentGroup, assigned_to: facts.assignedTo }
    for (const field of TRACKED) {
        const first = events.find((event) => event.field === field)
        if (first) snapshot[field] = first.kind === `initial_${field}` ? first.toRaw : first.fromRaw
    }
    return snapshot
}

function changesOf(events: TimelineEvent[]): TimelineEvent[] {
    return events.filter((event) => event.source === 'audit' && TRACKED.includes(event.field) && !event.kind.startsWith('initial_'))
}

function snapshotAt(start: Snapshot, changes: TimelineEvent[], at: number): Snapshot {
    const snapshot = { ...start }
    for (const change of changes) {
        if (change.at > at) break
        snapshot[change.field] = change.toRaw
    }
    return snapshot
}

interface Groups {
    first: string
    final: string
}

function phaseOf(snapshot: Snapshot, at: number, facts: IncidentFacts, groups: Groups, end: number): Phase {
    if (at < facts.openedAt) return 'detection'
    if (at >= end) return 'recovery'
    // Resolved too early and later reopened: the gap is time spent waiting on confirmation
    if (snapshot.state === STATE_ON_HOLD || snapshot.state === STATE_RESOLVED) return 'waiting'
    const group = snapshot.assignment_group
    // First-line handling is triage; any other group that did not resolve it was a wrong turn
    if (group !== groups.final) return group === groups.first || !group ? 'triage' : 'misrouted'
    return snapshot.assigned_to ? 'fixing' : 'triage'
}

function silentGaps(events: TimelineEvent[], facts: IncidentFacts, end: number): TimelineEvent[] {
    const limit = gapLimitMinutes(facts.priority) * MINUTE_MS
    const activity = events
        .filter((event) => !PASSIVE_KINDS.includes(event.kind) && event.at >= facts.openedAt && event.at <= end)
        .map((event) => event.at)
    activity.push(end)
    const gaps: TimelineEvent[] = []
    let previous = facts.openedAt
    for (const at of activity) {
        if (at - previous > limit) {
            const minutes = (at - previous) / MINUTE_MS
            gaps.push({
                key: `gap:${previous}`,
                at: previous + 1,
                source: 'analysis',
                kind: 'silent_gap',
                actor: '',
                summary: `No updates for ${formatMinutes(minutes)} (limit ${formatMinutes(limit / MINUTE_MS)} for P${facts.priority})`,
                detail: `Nothing was logged on the incident or its tasks for ${formatMinutes(minutes)}, above the ${formatMinutes(limit / MINUTE_MS)} expected for P${facts.priority}.`,
                keyMoment: false,
            })
        }
        previous = Math.max(previous, at)
    }
    return gaps
}

// Annotates events with phases and adds silent-gap events; returns the summary metrics
export function analyse(facts: IncidentFacts, events: TimelineEvent[]): { events: TimelineEvent[]; analysis: Analysis } {
    events.sort((a, b) => a.at - b.at)
    const alerts = events.filter((event) => event.kind === 'alert').map((event) => event.at)
    const impactStart = Math.min(facts.openedAt, ...alerts)
    const ongoing = !facts.resolvedAt
    const end = facts.resolvedAt || new GlideDateTime().getNumericValue()

    const start = initialSnapshot(facts, events)
    const changes = changesOf(events)
    const groups: Groups = { first: start.assignment_group, final: snapshotAt(start, changes, end).assignment_group }

    const phases = PHASES.reduce((all, phase) => ({ ...all, [phase]: 0 }), {} as PhaseMinutes)
    const boundaries = [impactStart, facts.openedAt, ...changes.map((change) => change.at), end]
        .filter((at) => at >= impactStart && at <= end)
        .sort((a, b) => a - b)
    for (let i = 0; i < boundaries.length - 1; i++) {
        const from = boundaries[i]
        const phase = phaseOf(snapshotAt(start, changes, from), from, facts, groups, end)
        phases[phase] += (boundaries[i + 1] - from) / MINUTE_MS
    }
    if (facts.resolvedAt && facts.closedAt) phases.recovery = (facts.closedAt - facts.resolvedAt) / MINUTE_MS

    const gaps = silentGaps(events, facts, end)
    const all = events.concat(gaps).sort((a, b) => a.at - b.at)
    let firstAssignee = true
    for (const event of all) {
        event.phase = phaseOf(snapshotAt(start, changes, event.at), event.at, facts, groups, end)
        if (event.field === 'assigned_to' && event.toRaw && firstAssignee) {
            event.keyMoment = true
            firstAssignee = false
        }
    }

    for (const phase of PHASES) phases[phase] = Math.round(phases[phase])
    return {
        events: all,
        analysis: {
            impactStart,
            end,
            ongoing,
            minutesToResolve: Math.round((end - facts.openedAt) / MINUTE_MS),
            reassignments: changes.filter((change) => change.field === 'assignment_group' && change.fromRaw).length,
            handoffs: changes.filter((change) => change.field === 'assigned_to' && change.fromRaw && change.toRaw).length,
            silentGaps: gaps.length,
            phases,
        },
    }
}
