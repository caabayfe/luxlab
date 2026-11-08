import { gs, GlideRecord } from '@servicenow/glide'
import { RUN } from '../briefing/agents.ts'
import { toolById } from '../briefing/tools.ts'

const AI_LOG = 'sys_generative_ai_log'
const SCOPE_ID = 'fb5abdbad5284c47ba44798f6f5ad965'
const QUERY_CHUNK = 100
const MONTH_DAYS = 30

const SETTING = 'x_everi_luxlab_setting'
// Assists per run come from the customer's Now Assist contract; no setting means not set yet
export const AGENT_RATE = 'assists_per_agent_run'
export const SKILL_RATE = 'assists_per_skill_run'

export interface UsageRow {
    feature: string
    kind: 'agent' | 'skill'
    name: string
    runs: number
    failed: number
    llmCalls: number
    inputTokens: number
    outputTokens: number
    estimatedAssists: number | null
}

export interface UsageDto {
    days: number
    rows: UsageRow[]
    rates: { agent: number | null; skill: number | null }
    // Assists at this period's pace over 30 days; null until every rate in use is set
    monthlyAssists: number | null
    canSetRates: boolean
}

interface Tokens {
    calls: number
    input: number
    output: number
}

function rate(name: string): number | null {
    const setting = new GlideRecord(SETTING)
    const value = setting.get('name', name) ? parseFloat(setting.getValue('value') || '') : NaN
    return isNaN(value) || value < 0 ? null : value
}

function addTokens(tokens: Tokens, log: GlideRecord<any>) {
    tokens.calls++
    tokens.input += parseInt(log.getValue('prompt_token_count'), 10) || 0
    tokens.output += parseInt(log.getValue('response_token_count'), 10) || 0
}

function emptyTokens(): Tokens {
    return { calls: 0, input: 0, output: 0 }
}

function featureOfTool(tool: string): { feature: string; name: string } {
    if (tool === 'pattern-proposal') return { feature: 'Response Patterns', name: 'Pattern fix proposal' }
    if (tool === 'replay-review') return { feature: 'Incident Replay', name: 'Replay Analyst: review' }
    if (tool === 'replay-follow-ups') return { feature: 'Incident Replay', name: 'Replay Analyst: follow-ups' }
    const briefing = toolById(tool)
    return { feature: 'Daily Briefing', name: briefing ? briefing.name : tool }
}

// Every LLM call an agent run makes, the platform's own calls after it included, is logged under its conversation
function tokensByConversation(conversations: string[]): { [conversation: string]: Tokens } {
    const tokens: { [conversation: string]: Tokens } = {}
    for (let i = 0; i < conversations.length; i += QUERY_CHUNK) {
        const log = new GlideRecord(AI_LOG)
        log.addQuery('conversation', 'IN', conversations.slice(i, i + QUERY_CHUNK).join(','))
        log.query()
        while (log.next()) {
            const conversation = log.getValue('conversation')
            addTokens(tokens[conversation] || (tokens[conversation] = emptyTokens()), log)
        }
    }
    return tokens
}

function agentRows(days: number): UsageRow[] {
    const rows: { [tool: string]: UsageRow } = {}
    const conversations: { [tool: string]: string[] } = {}
    const run = new GlideRecord(RUN)
    run.addEncodedQuery(`sys_created_on>=javascript:gs.daysAgoStart(${days})`)
    run.query()
    while (run.next()) {
        const tool = run.getValue('tool')
        const row =
            rows[tool] ||
            (rows[tool] = { ...featureOfTool(tool), kind: 'agent', runs: 0, failed: 0, llmCalls: 0, inputTokens: 0, outputTokens: 0, estimatedAssists: null })
        row.runs++
        if (run.getValue('state') === 'failed') row.failed++
        const conversation = run.getValue('conversation')
        if (conversation) (conversations[tool] = conversations[tool] || []).push(conversation)
    }
    const all = Object.keys(conversations).reduce((list, tool) => list.concat(conversations[tool]), [] as string[])
    const tokens = tokensByConversation(all)
    Object.keys(conversations).forEach((tool) => {
        conversations[tool].forEach((conversation) => {
            const used = tokens[conversation]
            if (!used) return
            rows[tool].llmCalls += used.calls
            rows[tool].inputTokens += used.input
            rows[tool].outputTokens += used.output
        })
    })
    return Object.keys(rows).map((tool) => rows[tool])
}

// Skill configs point at the skill's capability, whose name is the skill name
function skillNames(): { [configId: string]: string } {
    const capabilities: { [capabilityId: string]: string } = {}
    const capability = new GlideRecord('sys_one_extend_capability')
    capability.addQuery('sys_scope', SCOPE_ID)
    capability.query()
    while (capability.next()) capabilities[capability.getUniqueValue()] = capability.getValue('name')
    const names: { [configId: string]: string } = {}
    const config = new GlideRecord('sn_nowassist_skill_config')
    config.addQuery('skill_id', 'IN', Object.keys(capabilities).join(','))
    config.query()
    while (config.next()) names[config.getUniqueValue()] = capabilities[config.getValue('skill_id')]
    return names
}

// Skill runs (incident form buttons) have no conversation; each one is a single logged LLM call in LuxLab's scope
function skillRows(days: number): UsageRow[] {
    const names = skillNames()
    const rows: { [configId: string]: UsageRow } = {}
    const log = new GlideRecord(AI_LOG)
    log.addEncodedQuery(`derived_scope=${SCOPE_ID}^conversationISEMPTY^skill_config_idISNOTEMPTY^sys_created_on>=javascript:gs.daysAgoStart(${days})`)
    log.query()
    while (log.next()) {
        const configId = log.getValue('skill_config_id')
        const row =
            rows[configId] ||
            (rows[configId] = {
                feature: 'Incident Replay',
                kind: 'skill',
                name: names[configId] || 'LuxLab skill',
                runs: 0,
                failed: 0,
                llmCalls: 0,
                inputTokens: 0,
                outputTokens: 0,
                estimatedAssists: null,
            })
        row.runs++
        row.llmCalls++
        if (log.getValue('status') !== 'success') row.failed++
        row.inputTokens += parseInt(log.getValue('prompt_token_count'), 10) || 0
        row.outputTokens += parseInt(log.getValue('response_token_count'), 10) || 0
    }
    return Object.keys(rows).map((configId) => rows[configId])
}

export function usage(days: number): UsageDto {
    const rates = { agent: rate(AGENT_RATE), skill: rate(SKILL_RATE) }
    const rows = agentRows(days)
        .concat(skillRows(days))
        .sort((a, b) => a.feature.localeCompare(b.feature) || b.runs - a.runs)
    rows.forEach((row) => {
        const perRun = row.kind === 'agent' ? rates.agent : rates.skill
        row.estimatedAssists = perRun === null ? null : Math.round(row.runs * perRun * 10) / 10
    })
    const unknown = rows.some((row) => row.estimatedAssists === null)
    const total = rows.reduce((sum, row) => sum + (row.estimatedAssists || 0), 0)
    return {
        days,
        rows,
        rates,
        monthlyAssists: unknown ? null : Math.round((total * MONTH_DAYS) / days),
        canSetRates: gs.hasRole('x_everi_luxlab.manager'),
    }
}

export function setRates(agent: number, skill: number) {
    if (!(agent >= 0) || !(skill >= 0)) throw new Error('Rates must be zero or more assists per run')
    saveSetting(AGENT_RATE, String(agent))
    saveSetting(SKILL_RATE, String(skill))
}

function saveSetting(name: string, value: string) {
    const setting = new GlideRecord(SETTING)
    if (!setting.get('name', name)) {
        setting.initialize()
        setting.setValue('name', name)
    }
    setting.setValue('value', value)
    const saved = setting.isNewRecord() ? setting.insert() : setting.update()
    if (!saved) throw new Error(`Could not save ${name}`)
}
