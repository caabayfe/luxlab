import { GlideDateTime, GlideRecord } from '@servicenow/glide'
import { IncidentFacts, TimelineEvent } from './types.ts'

// Field changes worth replaying; journal fields are read from sys_journal_field instead
const AUDITED_FIELDS = ['state', 'assignment_group', 'assigned_to', 'priority', 'hold_reason', 'major_incident_state', 'impact']

// Audit rows written with the insert itself describe initial values, not changes
const INSERT_TOLERANCE_MS = 5 * 1000

export function epoch(value: string): number {
    return new GlideDateTime(value).getNumericValue()
}

function optionalEpoch(value: string): number | null {
    return value ? epoch(value) : null
}

const displayCache: { [key: string]: string } = {}

// Audit rows hold raw values (sys_ids, choice values); resolve them through a scratch incident
function displayOf(field: string, raw: string): string {
    if (!raw) return ''
    const key = `${field}:${raw}`
    if (!(key in displayCache)) {
        const scratch = new GlideRecord('incident')
        scratch.initialize()
        scratch.setValue(field as any, raw)
        displayCache[key] = scratch.getDisplayValue(field as any) || raw
    }
    return displayCache[key]
}

function clip(text: string, max: number): string {
    return text.length > max ? `${text.substring(0, max - 1)}…` : text
}

export function loadFacts(incident: GlideRecord<'incident'>): IncidentFacts {
    return {
        sysId: incident.getUniqueValue(),
        number: incident.getValue('number'),
        priority: incident.getValue('priority') || '5',
        openedAt: epoch(incident.getValue('opened_at')),
        resolvedAt: optionalEpoch(incident.getValue('resolved_at')),
        closedAt: optionalEpoch(incident.getValue('closed_at')),
        state: incident.getValue('state') || '',
        assignmentGroup: incident.getValue('assignment_group') || '',
        assignedTo: incident.getValue('assigned_to') || '',
    }
}

export function recordEvents(incident: GlideRecord<'incident'>, facts: IncidentFacts): TimelineEvent[] {
    const events: TimelineEvent[] = [
        {
            at: facts.openedAt,
            source: 'record',
            kind: 'opened',
            actor: incident.getDisplayValue('opened_by'),
            summary: `Incident opened: ${clip(incident.getValue('short_description') || '', 160)}`,
            keyMoment: true,
        },
    ]
    if (facts.resolvedAt) {
        const code = incident.getDisplayValue('close_code')
        events.push({
            at: facts.resolvedAt,
            source: 'record',
            kind: 'resolved',
            actor: incident.getDisplayValue('resolved_by'),
            summary: code ? `Resolved (${code})` : 'Resolved',
            detail: incident.getValue('close_notes') || '',
            keyMoment: true,
        })
    }
    if (facts.closedAt) {
        events.push({ at: facts.closedAt, source: 'record', kind: 'closed', actor: '', summary: 'Closed', keyMoment: false })
    }
    return events
}

function auditSummary(field: string, from: string, to: string): string {
    switch (field) {
        case 'assignment_group':
            return from ? `Reassigned from ${from} to ${to || '(no group)'}` : `Assigned to group ${to}`
        case 'assigned_to':
            return to ? `Assigned to ${to}` : `Unassigned (was ${from})`
        case 'priority':
            return `Priority changed: ${from} → ${to}`
        case 'hold_reason':
            return to ? `On hold: ${to}` : 'Hold reason cleared'
        case 'state':
            return `State changed: ${from || '(empty)'} → ${to}`
        case 'major_incident_state':
            return `Major incident ${to || 'state cleared'}`
        default:
            return `${field.replace(/_/g, ' ')}: ${from || '(empty)'} → ${to || '(empty)'}`
    }
}

function isReopen(field: string, fromRaw: string, toRaw: string): boolean {
    return field === 'state' && fromRaw === '6' && toRaw !== '7'
}

function isKeyChange(field: string, fromRaw: string, toRaw: string): boolean {
    if (isReopen(field, fromRaw, toRaw)) return true
    if (field === 'assignment_group' || field === 'major_incident_state') return true
    // Escalations matter, de-escalations are noise
    if (field === 'priority') return parseInt(toRaw, 10) < parseInt(fromRaw, 10)
    return false
}

export function auditEvents(facts: IncidentFacts): TimelineEvent[] {
    const events: TimelineEvent[] = []
    const audit = new GlideRecord('sys_audit')
    audit.addQuery('tablename', 'incident')
    audit.addQuery('documentkey', facts.sysId)
    audit.addQuery('fieldname', 'IN', AUDITED_FIELDS.join(','))
    audit.orderBy('sys_created_on')
    audit.query()
    while (audit.next()) {
        const at = epoch(audit.getValue('sys_created_on'))
        const field = audit.getValue('fieldname')
        const fromRaw = audit.getValue('oldvalue') || ''
        const toRaw = audit.getValue('newvalue') || ''
        const initial = !fromRaw && at - facts.openedAt <= INSERT_TOLERANCE_MS
        if (fromRaw === toRaw) continue
        const fromValue = displayOf(field, fromRaw)
        const toValue = displayOf(field, toRaw)
        events.push({
            at,
            source: 'audit',
            kind: initial ? `initial_${field}` : field,
            actor: audit.getValue('user') || '',
            summary: isReopen(field, fromRaw, toRaw) ? `Reopened: ${fromValue} → ${toValue}` : auditSummary(field, fromValue, toValue),
            field,
            fromRaw,
            toRaw,
            fromValue,
            toValue,
            keyMoment: !initial && isKeyChange(field, fromRaw, toRaw),
        })
    }
    return events
}

export function journalEvents(facts: IncidentFacts): TimelineEvent[] {
    const events: TimelineEvent[] = []
    const journal = new GlideRecord('sys_journal_field')
    journal.addQuery('name', 'incident')
    journal.addQuery('element_id', facts.sysId)
    journal.addQuery('element', 'IN', 'work_notes,comments')
    journal.orderBy('sys_created_on')
    journal.query()
    while (journal.next()) {
        const text = journal.getValue('value') || ''
        const isNote = journal.getValue('element') === 'work_notes'
        events.push({
            at: epoch(journal.getValue('sys_created_on')),
            source: 'journal',
            kind: isNote ? 'work_note' : 'comment',
            actor: journal.getValue('sys_created_by') || '',
            summary: `${isNote ? 'Work note' : 'Customer update'}: ${clip(text.replace(/\s+/g, ' '), 140)}`,
            detail: clip(text, 4000),
            keyMoment: false,
        })
    }
    return events
}
