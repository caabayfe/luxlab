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
