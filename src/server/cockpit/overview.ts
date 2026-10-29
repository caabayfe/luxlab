import { GlideAggregate, GlideDateTime } from '@servicenow/glide'
import { PRIORITIES, WORK_CLASS_QUERY, currentUserId, inGroupsQuery, myGroupIds } from './scope.ts'

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

function countByPriority(table: string, query: string): { total: number; byPriority: PriorityCount[] } {
    const agg = new GlideAggregate(table)
    agg.addEncodedQuery(query)
    agg.addAggregate('COUNT', null)
    agg.groupBy('priority')
    agg.query()
    const counts: { [priority: string]: number } = {}
    let total = 0
    while (agg.next()) {
        const count = parseInt(agg.getAggregate('COUNT', null), 10) || 0
        counts[agg.getValue('priority')] = count
        total += count
    }
    return { total, byPriority: PRIORITIES.map((priority) => ({ priority, count: counts[priority] || 0 })) }
}

function count(table: string, query: string, refine?: (agg: GlideAggregate) => void): number {
    const agg = new GlideAggregate(table)
    agg.addEncodedQuery(query)
    if (refine) refine(agg)
    agg.addAggregate('COUNT', null)
    agg.query()
    return agg.next() ? parseInt(agg.getAggregate('COUNT', null), 10) || 0 : 0
}

export function getOverview(): Overview {
    const me = currentUserId()
    const groups = myGroupIds()
    const now = new GlideDateTime()
    const in24h = new GlideDateTime()
    in24h.addSeconds(24 * 60 * 60)

    const mySla = `active=true^task.assigned_to=${me}^task.active=true^task.${WORK_CLASS_QUERY}`

    return {
        generatedAt: now.getDisplayValue(),
        myTickets: countByPriority('task', `active=true^assigned_to=${me}^${WORK_CLASS_QUERY}`),
        slaAtRisk: count('task_sla', `${mySla}^has_breached=false^percentage>=75`),
        slaBreached: count('task_sla', `${mySla}^has_breached=true`),
        changesPendingApproval: count('change_request', `active=true^approval=requested^${inGroupsQuery('assignment_group', groups)}`),
        changesNext24h: count('change_request', `active=true^${inGroupsQuery('assignment_group', groups)}`, (agg) => {
            agg.addQuery('start_date', '>=', now)
            agg.addQuery('start_date', '<=', in24h)
        }),
        unassigned: countByPriority(
            'task',
            `active=true^assigned_toISEMPTY^${inGroupsQuery('assignment_group', groups)}^${WORK_CLASS_QUERY}`
        ),
    }
}
