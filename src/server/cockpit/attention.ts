import { GlideDateTime, GlideRecord, GlideRecordSecure } from '@servicenow/glide'
import { WORK_CLASS_QUERY, currentUserId } from './scope.ts'

const MAX_TASKS = 200
const DAY_MS = 24 * 60 * 60 * 1000

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

interface SlaFlags {
    breached: boolean
    atRisk: boolean
}

// One query for all SLAs of the candidate tasks, instead of one query per task
function slaFlagsFor(taskIds: string[]): { [taskId: string]: SlaFlags } {
    const flags: { [taskId: string]: SlaFlags } = {}
    if (!taskIds.length) return flags
    const sla = new GlideRecord('task_sla')
    sla.addEncodedQuery(`active=true^taskIN${taskIds.join(',')}`)
    sla.query()
    while (sla.next()) {
        const taskId = sla.getValue('task')
        const current = flags[taskId] || { breached: false, atRisk: false }
        if (sla.getValue('has_breached') === '1') current.breached = true
        else if (parseFloat(sla.getValue('percentage')) >= 75) current.atRisk = true
        flags[taskId] = current
    }
    return flags
}

// Breaches dominate, then SLA risk, then priority, then how long nobody touched it
function scoreOf(item: AttentionItem): number {
    const priorityWeight = (6 - (parseInt(item.priority, 10) || 5)) * 100
    return (item.slaBreached ? 1000 : 0) + (item.slaAtRisk ? 400 : 0) + priorityWeight + Math.min(item.staleDays, 365)
}

export function getAttention(page: number, pageSize: number): AttentionPage {
    const now = new GlideDateTime().getNumericValue()
    const items: AttentionItem[] = []

    // Secure query so the list only shows what the user is allowed to read
    const task = new GlideRecordSecure('task')
    task.addEncodedQuery(`active=true^assigned_to=${currentUserId()}^${WORK_CLASS_QUERY}`)
    task.setLimit(MAX_TASKS)
    task.query()
    while (task.next()) {
        const updated = new GlideDateTime(task.getValue('sys_updated_on')).getNumericValue()
        items.push({
            sysId: task.getUniqueValue(),
            table: task.getValue('sys_class_name'),
            number: task.getValue('number'),
            shortDescription: task.getValue('short_description') || '',
            priority: task.getValue('priority') || '5',
            assignmentGroup: task.getDisplayValue('assignment_group'),
            staleDays: Math.floor((now - updated) / DAY_MS),
            slaBreached: false,
            slaAtRisk: false,
            score: 0,
        })
    }

    const flags = slaFlagsFor(items.map((item) => item.sysId))
    for (const item of items) {
        const sla = flags[item.sysId]
        if (sla) {
            item.slaBreached = sla.breached
            item.slaAtRisk = sla.atRisk
        }
        item.score = scoreOf(item)
    }
    items.sort((a, b) => b.score - a.score)

    const start = (page - 1) * pageSize
    return { total: items.length, page, pageSize, items: items.slice(start, start + pageSize) }
}
