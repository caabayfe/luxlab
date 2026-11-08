export type Phase = 'detection' | 'triage' | 'misrouted' | 'waiting' | 'fixing' | 'recovery'

export const PHASES: Phase[] = ['detection', 'triage', 'misrouted', 'waiting', 'fixing', 'recovery']

export type Source = 'record' | 'audit' | 'journal' | 'sla' | 'task' | 'child' | 'alert' | 'comms' | 'analysis' | 'pir'

export interface TimelineEvent {
    // Stable identity across rebuilds, derived from the source row; matches replay events to PIR timeline events
    key: string
    at: number // epoch ms
    source: Source
    kind: string
    actor: string
    summary: string
    field?: string
    fromValue?: string
    toValue?: string
    fromRaw?: string
    toRaw?: string
    detail?: string
    phase?: Phase
    keyMoment: boolean
    // Curation read back from the Post Incident Review
    hidden?: boolean
    pirFlagged?: boolean
}

export interface IncidentFacts {
    sysId: string
    number: string
    priority: string
    openedAt: number
    resolvedAt: number | null
    closedAt: number | null
    // Current values, used when a field never changed and so has no audit row
    state: string
    assignmentGroup: string
    assignedTo: string
}

export type PhaseMinutes = { [phase in Phase]: number }

export interface Analysis {
    impactStart: number
    end: number
    ongoing: boolean
    minutesToResolve: number
    reassignments: number
    handoffs: number
    silentGaps: number
    phases: PhaseMinutes
}
