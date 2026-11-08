import { GlideRecord } from '@servicenow/glide'
import { RUN } from '../briefing/agents.ts'
import { toolById } from '../briefing/tools.ts'
import { COMMS_SKILL } from '../coach/coach.ts'

// The platform meters every skill execution and agent run in sys_gen_ai_usage_log; LuxLab only reads it
const USAGE_LOG = 'sys_gen_ai_usage_log'
const SCOPE = 'x_everi_luxlab'
const SCOPE_ID = 'fb5abdbad5284c47ba44798f6f5ad965'
const QUERY_CHUNK = 100
const MONTH_DAYS = 30
// Agent runs are billed by tool actions: up to 4 is Small (25 assists), 5 to 8 Medium (50), 9 to 20 Large (150)
const SMALL_MAX_ACTIONS = 4

export interface UsageRow {
    feature: string
    kind: 'agent' | 'skill'
    name: string
    runs: number
    failed: number
    // Runs the platform metered; the rest never reached a usage record (e.g. failed before running)
    metered: number
    assists: number
    // Part of assists counted against a trial allowance rather than the licence
    trialAssists: number
    // Agents only: the most tool actions in one run, which sets its billing tier
    maxToolActions: number
}

export interface UsageDto {
    days: number
    rows: UsageRow[]
    assists: number
    trialAssists: number
    // Assists at this period's pace over 30 days
    monthlyAssists: number
    smallMaxActions: number
}

interface Metered {
    assists: number
    trial: number
}

function int(record: GlideRecord<any>, field: string): number {
    return parseInt(record.getValue(field), 10) || 0
}

function chunks(items: string[]): string[][] {
    const out: string[][] = []
    for (let i = 0; i < items.length; i += QUERY_CHUNK) out.push(items.slice(i, i + QUERY_CHUNK))
    return out
}

function featureOfTool(tool: string): { feature: string; name: string } {
    if (tool === 'pattern-proposal') return { feature: 'Response Patterns', name: 'Pattern fix proposal' }
    if (tool === 'replay-review') return { feature: 'Incident Replay', name: 'Replay Analyst: review' }
    if (tool === 'replay-follow-ups') return { feature: 'Incident Replay', name: 'Replay Analyst: follow-ups' }
    const briefing = toolById(tool)
    return { feature: 'Daily Briefing', name: briefing ? briefing.name : tool }
}

// Each execution plan points at the usage record the platform wrote for the run
function meteredByPlan(planIds: string[]): { [planId: string]: Metered } {
    const usageOf: { [planId: string]: string } = {}
    for (const chunk of chunks(planIds)) {
        const plan = new GlideRecord('sn_aia_execution_plan')
        plan.addQuery('sys_id', 'IN', chunk.join(','))
        plan.query()
        while (plan.next()) {
            const usage = plan.getValue('gen_ai_usage_log')
            if (usage) usageOf[plan.getUniqueValue()] = usage
        }
    }
    const metered: { [usageId: string]: Metered } = {}
    for (const chunk of chunks(Object.keys(usageOf).map((planId) => usageOf[planId]))) {
        const usage = new GlideRecord(USAGE_LOG)
        usage.addQuery('sys_id', 'IN', chunk.join(','))
        usage.query()
        while (usage.next()) metered[usage.getUniqueValue()] = { assists: int(usage, 'assists'), trial: int(usage, 'trial_assists') }
    }
    const byPlan: { [planId: string]: Metered } = {}
    Object.keys(usageOf).forEach((planId) => {
        if (metered[usageOf[planId]]) byPlan[planId] = metered[usageOf[planId]]
    })
    return byPlan
}

// Tool steps only: orchestrator and communicator steps are not billed actions
function toolActionsByPlan(planIds: string[]): { [planId: string]: number } {
    const actions: { [planId: string]: number } = {}
    for (const chunk of chunks(planIds)) {
        const task = new GlideRecord('sn_aia_execution_task')
        task.addQuery('execution_plan', 'IN', chunk.join(','))
        task.addQuery('type', 'tool')
        task.query()
        while (task.next()) {
            const planId = task.getValue('execution_plan')
            actions[planId] = (actions[planId] || 0) + 1
        }
    }
    return actions
}

function agentRows(days: number): UsageRow[] {
    const rows: { [tool: string]: UsageRow } = {}
    const plansOf: { [tool: string]: string[] } = {}
    const run = new GlideRecord(RUN)
    run.addEncodedQuery(`sys_created_on>=javascript:gs.daysAgoStart(${days})`)
    run.query()
    while (run.next()) {
        const tool = run.getValue('tool')
        const row =
            rows[tool] ||
            (rows[tool] = { ...featureOfTool(tool), kind: 'agent', runs: 0, failed: 0, metered: 0, assists: 0, trialAssists: 0, maxToolActions: 0 })
        row.runs++
        if (run.getValue('state') === 'failed') row.failed++
        const plan = run.getValue('execution_plan')
        if (plan) (plansOf[tool] = plansOf[tool] || []).push(plan)
    }
    const allPlans = Object.keys(plansOf).reduce((list, tool) => list.concat(plansOf[tool]), [] as string[])
    const metered = meteredByPlan(allPlans)
    const actions = toolActionsByPlan(allPlans)
    Object.keys(plansOf).forEach((tool) => {
        const row = rows[tool]
        plansOf[tool].forEach((plan) => {
            row.maxToolActions = Math.max(row.maxToolActions, actions[plan] || 0)
            const usage = metered[plan]
            if (!usage) return
            row.metered++
            row.assists += usage.assists + usage.trial
            row.trialAssists += usage.trial
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

// Skill runs (incident form buttons, the live coach's Draft update) are metered one usage record per execution
function skillRows(days: number): UsageRow[] {
    const names = skillNames()
    const rows: { [configId: string]: UsageRow } = {}
    const usage = new GlideRecord(USAGE_LOG)
    usage.addEncodedQuery(`source_scope=${SCOPE}^strategy=CAPABILITY_EXECUTION^sys_created_on>=javascript:gs.daysAgoStart(${days})`)
    usage.query()
    while (usage.next()) {
        const configId = usage.getValue('skill_config_id') || ''
        const name = names[configId] || 'LuxLab skill'
        const row =
            rows[configId] ||
            (rows[configId] = {
                feature: name === COMMS_SKILL ? 'Live Coach' : 'Incident Replay',
                kind: 'skill',
                name,
                runs: 0,
                failed: 0,
                metered: 0,
                assists: 0,
                trialAssists: 0,
                maxToolActions: 0,
            })
        row.runs++
        row.metered++
        if (usage.getValue('status') !== 'completed') row.failed++
        row.assists += int(usage, 'assists') + int(usage, 'trial_assists')
        row.trialAssists += int(usage, 'trial_assists')
    }
    return Object.keys(rows).map((configId) => rows[configId])
}

export function usage(days: number): UsageDto {
    const rows = agentRows(days)
        .concat(skillRows(days))
        .sort((a, b) => a.feature.localeCompare(b.feature) || b.assists - a.assists)
    const assists = rows.reduce((sum, row) => sum + row.assists, 0)
    return {
        days,
        rows,
        assists,
        trialAssists: rows.reduce((sum, row) => sum + row.trialAssists, 0),
        monthlyAssists: Math.round((assists * MONTH_DAYS) / days),
        smallMaxActions: SMALL_MAX_ACTIONS,
    }
}
