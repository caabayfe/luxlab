// Mirrors the DTOs returned by /api/x_everi_luxlab/v1/cockpit

export interface PriorityCount {
    priority: string
    count: number
}

export interface Overview {
    generatedAt: string
    myTickets: { total: number; byPriority: PriorityCount[] }
    slaAtRisk: number
    slaBreached: number
    changesPendingApproval: number
    changesNext24h: number
    unassigned: { total: number; byPriority: PriorityCount[] }
}

export interface AttentionItem {
    sysId: string
    table: string
    number: string
    shortDescription: string
    priority: string
    assignmentGroup: string
    staleDays: number
    slaBreached: boolean
    slaAtRisk: boolean
    score: number
}

export interface AttentionPage {
    total: number
    page: number
    pageSize: number
    items: AttentionItem[]
}

export type TabId = 'overview' | 'replay' | 'briefing'

export interface Route {
    tab: TabId
    incident: string | null
}

export type Phase = 'detection' | 'triage' | 'misrouted' | 'waiting' | 'fixing' | 'recovery'

export interface ReplayCandidate {
    sysId: string
    number: string
    shortDescription: string
    priority: string
    majorState: string
    group: string
    openedAt: string
    resolvedAt: string
    active: boolean
    replayStatus: string
    replayBuiltOn: string
}

export interface ReplayEvent {
    sequence: number
    occurredAt: string
    source: string
    kind: string
    phase: Phase | ''
    actor: string
    summary: string
    fromValue: string
    toValue: string
    detail: string
    keyMoment: boolean
}

export type FollowUpType = 'problem' | 'knowledge' | 'action'

export interface ReplayFollowUp {
    sysId: string
    type: FollowUpType
    title: string
    description: string
    rationale: string
    state: 'proposed' | 'approved'
    decidedBy: string
    decidedOn: string
    problem: { sysId: string; number: string } | null
}

export interface Replay {
    incident: { sysId: string; number: string; shortDescription: string; priority: string; majorState: string; group: string }
    status: 'ready' | 'failed'
    builtOn: string
    impactStart: string
    openedAt: string
    resolvedAt: string
    ongoing: boolean
    minutesToResolve: number
    reassignments: number
    handoffs: number
    silentGaps: number
    phases: { [phase in Phase]?: number }
    error: string
    events: ReplayEvent[]
    review: string
    reviewedOn: string
    followUpsOn: string
    followUps: ReplayFollowUp[]
    canDecide: boolean
}
