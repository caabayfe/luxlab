import { gs, GlideRecord } from '@servicenow/glide'
import { IncidentFacts, TimelineEvent } from './types.ts'
import { epoch } from './sources.ts'

export function slaEvents(facts: IncidentFacts): TimelineEvent[] {
    const events: TimelineEvent[] = []
    // The SLA engine can re-attach the same definition (one completed, one in progress); report each moment once
    const seen: { [key: string]: boolean } = {}
    const add = (event: TimelineEvent) => {
        const key = `${event.kind}|${event.summary}|${event.at}`
        if (!seen[key]) events.push(event)
        seen[key] = true
    }
    const sla = new GlideRecord('task_sla')
    sla.addQuery('task', facts.sysId)
    sla.addQuery('stage', '!=', 'cancelled')
    sla.query()
    while (sla.next()) {
        const name = sla.getDisplayValue('sla')
        const id = sla.getUniqueValue()
        const start = sla.getValue('start_time')
        if (start) add({ key: `sla:${id}:start`, at: epoch(start), source: 'sla', kind: 'sla_start', actor: '', summary: `SLA started: ${name}`, keyMoment: false })
        const breachAt = sla.getValue('planned_end_time')
        if (sla.getValue('has_breached') === '1' && breachAt) {
            add({ key: `sla:${id}:breach`, at: epoch(breachAt), source: 'sla', kind: 'sla_breach', actor: '', summary: `SLA breached: ${name}`, keyMoment: true })
        }
    }
    return events
}

export function taskEvents(facts: IncidentFacts): TimelineEvent[] {
    const events: TimelineEvent[] = []
    const task = new GlideRecord('incident_task')
    task.addQuery('incident', facts.sysId)
    task.query()
    while (task.next()) {
        const label = `${task.getValue('number')} (${task.getDisplayValue('assignment_group') || 'no group'})`
        events.push({
            key: `task:${task.getUniqueValue()}:opened`,
            at: epoch(task.getValue('opened_at')),
            source: 'task',
            kind: 'task_opened',
            actor: task.getDisplayValue('opened_by'),
            summary: `Task opened ${label}: ${task.getValue('short_description') || ''}`,
            keyMoment: false,
        })
        const closed = task.getValue('closed_at')
        if (closed) {
            events.push({ key: `task:${task.getUniqueValue()}:closed`, at: epoch(closed), source: 'task', kind: 'task_closed', actor: task.getDisplayValue('closed_by'), summary: `Task closed ${label}`, keyMoment: false })
        }
    }
    return events
}

export function childEvents(facts: IncidentFacts): TimelineEvent[] {
    const events: TimelineEvent[] = []
    const child = new GlideRecord('incident')
    child.addQuery('parent_incident', facts.sysId)
    child.query()
    while (child.next()) {
        events.push({
            key: `child:${child.getUniqueValue()}`,
            at: epoch(child.getValue('opened_at')),
            source: 'child',
            kind: 'child_reported',
            actor: child.getDisplayValue('caller_id'),
            summary: `Related report ${child.getValue('number')}: ${child.getValue('short_description') || ''}`,
            keyMoment: false,
        })
    }
    return events
}

// Event Management and Major Incident tables may be missing or restricted; the replay still works without them
function optionalSource(name: string, collect: () => TimelineEvent[]): TimelineEvent[] {
    try {
        return collect()
    } catch (e) {
        gs.warn(`LuxLab replay: skipped ${name}: ${e}`)
        return []
    }
}

export function alertEvents(facts: IncidentFacts): TimelineEvent[] {
    return optionalSource('em_alert', () => {
        const events: TimelineEvent[] = []
        const alert = new GlideRecord('em_alert')
        if (!alert.isValid()) return events
        alert.addQuery('incident', facts.sysId)
        alert.query()
        while (alert.next()) {
            const first = alert.getValue('initial_remote_time') || alert.getValue('sys_created_on')
            events.push({
                key: `alert:${alert.getUniqueValue()}`,
                at: epoch(first),
                source: 'alert',
                kind: 'alert',
                actor: alert.getValue('node') || '',
                summary: `Alert ${alert.getValue('number')}: ${alert.getValue('description') || ''}`,
                keyMoment: true,
            })
        }
        return events
    })
}

export function commsEvents(facts: IncidentFacts): TimelineEvent[] {
    return optionalSource('incident_alert', () => {
        const events: TimelineEvent[] = []
        const plan = new GlideRecord('incident_alert')
        if (!plan.isValid()) return events
        plan.addQuery('source_incident', facts.sysId)
        plan.query()
        while (plan.next()) {
            events.push({
                key: `comms:${plan.getUniqueValue()}`,
                at: epoch(plan.getValue('sys_created_on')),
                source: 'comms',
                kind: 'comms_plan',
                actor: plan.getValue('sys_created_by') || '',
                summary: `Communication plan: ${plan.getDisplayValue('type') || plan.getDisplayValue('number')}`,
                keyMoment: false,
            })
        }
        return events
    })
}
