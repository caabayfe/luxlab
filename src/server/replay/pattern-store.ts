import { GlideRecord } from '@servicenow/glide'

export const PATTERN = 'x_everi_luxlab_pattern'

export interface PatternEvidence {
    sysId: string
    number: string
    shortDescription: string
    minutes: number
}

export interface Facet {
    name: string
    count: number
}

export interface PatternDto {
    sysId: string
    key: string
    type: string
    title: string
    group: string
    target: string
    dimension: string
    incidentCount: number
    minutesLost: number
    medianMinutes: number
    medianTtr: number
    baselineTtr: number
    incidents: PatternEvidence[]
    facets: { services: Facet[]; categories: Facet[] }
    active: boolean
    firstSeen: string
    minedOn: string
    state: string
    proposal: string
    fixType: string
    proposedOn: string
    decidedBy: string
    decidedOn: string
    problem: { sysId: string; number: string } | null
}

export interface PatternLink {
    sysId: string
    type: string
    title: string
}

function int(record: GlideRecord, field: string): number {
    return parseInt(record.getValue(field), 10) || 0
}

function json<T>(record: GlideRecord, field: string, fallback: T): T {
    try {
        return JSON.parse(record.getValue(field) || '') as T
    } catch (e) {
        return fallback
    }
}

export function patternDto(pattern: GlideRecord): PatternDto {
    const problem = pattern.getValue('problem')
    return {
        sysId: pattern.getUniqueValue(),
        key: pattern.getValue('key'),
        type: pattern.getValue('type'),
        title: pattern.getValue('title') || '',
        group: pattern.getValue('group') || '',
        target: pattern.getValue('target') || '',
        dimension: pattern.getValue('dimension') || '',
        incidentCount: int(pattern, 'incident_count'),
        minutesLost: int(pattern, 'minutes_lost'),
        medianMinutes: int(pattern, 'median_minutes'),
        medianTtr: int(pattern, 'median_ttr'),
        baselineTtr: int(pattern, 'baseline_ttr'),
        incidents: json(pattern, 'incidents', [] as PatternEvidence[]),
        facets: json(pattern, 'facets', { services: [], categories: [] }),
        active: pattern.getValue('active') === '1',
        firstSeen: pattern.getValue('first_seen') || '',
        minedOn: pattern.getValue('mined_on') || '',
        state: pattern.getValue('state'),
        proposal: pattern.getValue('proposal') || '',
        fixType: pattern.getValue('fix_type') || '',
        proposedOn: pattern.getValue('proposed_on') || '',
        decidedBy: pattern.getDisplayValue('decided_by'),
        decidedOn: pattern.getValue('decided_on') || '',
        problem: problem ? { sysId: problem, number: pattern.getDisplayValue('problem') } : null,
    }
}

// Patterns the latest mining still finds, plus accepted ones whose fix may be why they stopped
export function listPatterns(): PatternDto[] {
    const patterns: PatternDto[] = []
    const pattern = new GlideRecord(PATTERN)
    pattern.addEncodedQuery('active=true^ORstate=accepted')
    pattern.orderByDesc('minutes_lost')
    pattern.query()
    while (pattern.next()) patterns.push(patternDto(pattern))
    return patterns
}

// The evidence JSON holds incident sys_ids, so a LIKE finds the patterns an incident is part of
export function patternsOfIncident(incidentId: string): PatternLink[] {
    const links: PatternLink[] = []
    const pattern = new GlideRecord(PATTERN)
    pattern.addQuery('active', true)
    pattern.addQuery('incidents', 'CONTAINS', incidentId)
    pattern.orderByDesc('minutes_lost')
    pattern.query()
    while (pattern.next()) {
        links.push({ sysId: pattern.getUniqueValue(), type: pattern.getValue('type'), title: pattern.getValue('title') || '' })
    }
    return links
}
