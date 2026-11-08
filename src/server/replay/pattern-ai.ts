import { gs, GlideDateTime, GlideRecord, GlideRecordSecure } from '@servicenow/glide'
import { formatMinutes } from './analysis.ts'
import { BriefingRunDto, startRun } from '../briefing/agents.ts'
import { PATTERN, patternDto, PatternDto } from './pattern-store.ts'

export const PATTERN_ANALYST = 'LuxLab Pattern Analyst'

const FIX_TYPES = ['routing', 'knowledge', 'monitoring', 'process', 'problem']
// The agent reads the incidents that cost the most; enough to see what they share
const MAX_EVIDENCE = 8
const MAX_TEXT = 400

const TYPE_TEXT: { [type: string]: string } = {
    misroute: 'Misrouting: incidents spent time with a group that did not resolve them before reaching the resolving group',
    gaps: 'Silent gaps: nothing was logged on the incident for longer than the limit for its priority while this group held it',
    detection: 'Late detection: monitoring raised alerts before anyone opened the incident',
    waiting: 'Waiting: the incident sat on hold (caller, vendor, change or problem) with the resolving group',
}

export interface PatternContext {
    error?: string
    pattern?: string
    evidence?: string
}

function clip(text: string, max: number): string {
    const flat = text.replace(/\s+/g, ' ').trim()
    return flat.length > max ? `${flat.substring(0, max - 1)}…` : flat
}

function patternRecord(patternId: string): GlideRecord | null {
    const pattern = new GlideRecord(PATTERN)
    return pattern.get(patternId) ? pattern : null
}

function facetText(facets: { name: string; count: number }[]): string {
    return facets.map((facet) => `${facet.name} (${facet.count})`).join(', ') || 'none recorded'
}

function patternText(pattern: PatternDto): string {
    return [
        `Pattern: ${pattern.title}`,
        `Type: ${TYPE_TEXT[pattern.type] || pattern.type}`,
        pattern.group ? `Group: ${pattern.group}` : '',
        pattern.target && pattern.target !== pattern.group ? `Resolving group: ${pattern.target}` : '',
        pattern.dimension ? `Service, CI or category: ${pattern.dimension}` : '',
        `Incidents in the last 90 days: ${pattern.incidentCount}`,
        `Time lost: ${formatMinutes(pattern.minutesLost)} in total, ${formatMinutes(pattern.medianMinutes)} per incident (median)`,
        `Median time to resolve: ${formatMinutes(pattern.medianTtr)} for these incidents, ${formatMinutes(pattern.baselineTtr)} for the other P1/P2 incidents`,
        `Top services: ${facetText(pattern.facets.services)}`,
        `Top categories: ${facetText(pattern.facets.categories)}`,
    ]
        .filter((line) => line)
        .join('\n')
}

// Group path from the replay, so the agent sees the route each incident took; groups only, never people
function groupPath(incidentId: string): string {
    const event = new GlideRecord('x_everi_luxlab_replay_event')
    event.addQuery('replay.incident', incidentId)
    event.addQuery('kind', 'assignment_group')
    event.orderBy('sequence')
    event.query()
    const groups: string[] = []
    while (event.next()) {
        if (!groups.length) groups.push(event.getValue('from_value') || '(none)')
        groups.push(event.getValue('to_value') || '(none)')
    }
    return groups.join(' → ')
}

function evidenceText(pattern: PatternDto): string {
    return pattern.incidents
        .slice(0, MAX_EVIDENCE)
        .map((item) => {
            const incident = new GlideRecordSecure('incident')
            if (!incident.get('sys_id', item.sysId)) return ''
            const lines = [
                `- ${incident.getValue('number')}: ${clip(incident.getValue('short_description') || '', 200)}`,
                `  minutes counted: ${item.minutes}; priority ${incident.getValue('priority')}; category ${incident.getDisplayValue('category') || 'none'}; ` +
                    `subcategory ${incident.getDisplayValue('subcategory') || 'none'}; service ${incident.getDisplayValue('business_service') || 'none'}; ` +
                    `CI ${incident.getDisplayValue('cmdb_ci') || 'none'}`,
            ]
            const path = groupPath(item.sysId)
            if (path) lines.push(`  group path: ${path}`)
            const closeNotes = incident.getValue('close_notes')
            if (closeNotes) lines.push(`  resolution: ${clip(closeNotes, MAX_TEXT)}`)
            return lines.join('\n')
        })
        .filter((text) => text)
        .join('\n')
}

// Data tool of the Pattern Analyst agent
export function patternContext(patternId: string): PatternContext {
    const record = patternRecord(patternId)
    if (!record) return { error: `No response pattern with id ${patternId}` }
    const pattern = patternDto(record)
    return { pattern: patternText(pattern), evidence: evidenceText(pattern) }
}

export function savePatternProposal(patternId: string, fixType: string, proposal: string): string {
    const pattern = patternRecord(patternId)
    if (!pattern) throw new Error(`No response pattern with id ${patternId}`)
    if (FIX_TYPES.indexOf(fixType) < 0) throw new Error(`fix_type must be one of ${FIX_TYPES.join(', ')}`)
    if (!proposal.trim()) throw new Error('The proposal is empty')
    if (pattern.getValue('state') === 'accepted') throw new Error('A fix was already accepted for this pattern')
    pattern.setValue('proposal', proposal)
    pattern.setValue('fix_type', fixType)
    pattern.setValue('proposed_on', new GlideDateTime())
    pattern.setValue('state', 'proposed')
    pattern.update()
    return `Fix proposed for "${pattern.getValue('title')}"`
}

function analystId(): string {
    const agent = new GlideRecord('sn_aia_agent')
    return agent.get('name', PATTERN_ANALYST) ? agent.getUniqueValue() : ''
}

export function startProposal(patternId: string): BriefingRunDto {
    const pattern = patternRecord(patternId)
    if (!pattern) throw new Error('Response pattern not found')
    const agentId = analystId()
    if (!agentId) throw new Error(`The ${PATTERN_ANALYST} agent is not installed`)
    return startRun({
        tool: 'pattern-proposal',
        agentId,
        agentName: PATTERN_ANALYST,
        objective: `Propose a fix for the response pattern with id ${patternId} ("${pattern.getValue('title')}") and save it.`,
        label: `pattern ${pattern.getValue('title')}`,
    })
}

// The problem description is a plain text field, so the proposal's Markdown would show literally
function plainText(markdown: string): string {
    return markdown
        .replace(/^#{1,6}\s+(.*)$/gm, (_match, heading: string) => heading.toUpperCase())
        .replace(/\*\*(.+?)\*\*/g, '$1')
        .replace(/__(.+?)__/g, '$1')
        .replace(/`([^`]+)`/g, '$1')
        .replace(/^(\s*)[-*]\s+/gm, '$1• ')
}

// Patterns keep group names; the resolving group owns the problem
function groupId(name: string): string {
    if (!name) return ''
    const group = new GlideRecord('sys_user_group')
    return group.get('name', name) ? group.getUniqueValue() : ''
}

// Links the incidents that are not already tied to another problem
function linkIncidents(problemId: string, incidentIds: string[]) {
    incidentIds.forEach((incidentId) => {
        const incident = new GlideRecordSecure('incident')
        if (!incident.get('sys_id', incidentId) || incident.getValue('problem_id') || !incident.canWrite()) return
        incident.setValue('problem_id', problemId)
        incident.update()
    })
}

function createProblem(pattern: GlideRecord): string {
    const evidence = patternDto(pattern).incidents
    const problem = new GlideRecordSecure('problem')
    problem.initialize()
    problem.setValue('short_description', pattern.getValue('title'))
    problem.setValue('description', `${plainText(pattern.getValue('proposal') || '')}\n\nIncidents: ${evidence.map((item) => item.number).join(', ')}`)
    const group = groupId(pattern.getValue('target') || pattern.getValue('group') || '')
    if (group) problem.setValue('assignment_group', group)
    if (evidence.length) problem.setValue('first_reported_by_task', evidence[0].sysId)
    const id = problem.insert()
    if (!id) throw new Error('You are not allowed to create problem records')
    linkIncidents(id, evidence.map((item) => item.sysId))
    return id
}

// Accepting marks when the fix starts, the baseline for checking later whether it worked
export function decidePattern(patternId: string, accept: boolean): PatternDto {
    const pattern = patternRecord(patternId)
    if (!pattern) throw new Error('Response pattern not found')
    const state = pattern.getValue('state')
    if (state === 'accepted' || state === 'dismissed') throw new Error('This pattern was already decided')
    if (accept && state !== 'proposed') throw new Error('Propose a fix before accepting it')
    if (accept && pattern.getValue('fix_type') === 'problem') pattern.setValue('problem', createProblem(pattern))
    pattern.setValue('state', accept ? 'accepted' : 'dismissed')
    pattern.setValue('decided_by', gs.getUserID())
    pattern.setValue('decided_on', new GlideDateTime())
    pattern.update()
    return patternDto(pattern)
}
