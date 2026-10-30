import { gs, GlideDateTime, GlideRecord } from '@servicenow/glide'
import { LuxLabAgentRuntime } from '@servicenow/glide/x_everi_luxlab'
import { BRIEFING_TOOLS, toolById } from './tools.ts'

export const RUN = 'x_everi_luxlab_briefing_run'

// Execution plan states after which the agent will not write any more steps
const DONE_STATES = ['completed', 'terminated', 'failed', 'cancelled', 'canceled', 'error']
const MAX_THOUGHT = 1500

export interface BriefingStepDto {
    order: number
    type: string
    status: string
    name: string
    thought: string
    actions: string[]
    ms: number
    startedAt: string
}

export interface BriefingRunDto {
    id: string
    tool: string
    state: 'running' | 'completed' | 'failed'
    startedOn: string
    finishedOn: string
    output: string
    error: string
    planState: string
    ms: number
    steps: BriefingStepDto[]
}

export interface BriefingToolDto {
    id: string
    name: string
    description: string
    agentName: string
    lastRun: BriefingRunDto | null
}

function parse(text: string): any {
    try {
        return JSON.parse(text)
    } catch (e) {
        return null
    }
}

function runDto(run: GlideRecord, steps: BriefingStepDto[] = []): BriefingRunDto {
    return {
        id: run.getUniqueValue(),
        tool: run.getValue('tool'),
        state: run.getValue('state') as BriefingRunDto['state'],
        startedOn: run.getValue('sys_created_on'),
        finishedOn: run.getValue('finished_on') || '',
        output: run.getValue('output') || '',
        error: run.getValue('error') || '',
        planState: run.getValue('plan_state') || '',
        ms: parseInt(run.getValue('execution_ms'), 10) || 0,
        steps,
    }
}

// Today's latest run of a tool by the current user, so the briefing survives a page reload
function lastRunToday(toolId: string): GlideRecord | null {
    const run = new GlideRecord(RUN)
    run.addQuery('tool', toolId)
    run.addQuery('user', gs.getUserID())
    run.addQuery('sys_created_on', '>=', gs.beginningOfToday())
    run.orderByDesc('sys_created_on')
    run.setLimit(1)
    run.query()
    return run.next() ? run : null
}

export function listTools(): BriefingToolDto[] {
    return BRIEFING_TOOLS.map((tool) => {
        const run = lastRunToday(tool.id)
        return {
            id: tool.id,
            name: tool.name,
            description: tool.description,
            agentName: tool.agentName,
            lastRun: run ? runDto(run) : null,
        }
    })
}

export interface AgentRunRequest {
    // Briefing tool id, or replay-review / replay-follow-ups for the Replay Analyst
    tool: string
    agentId: string
    agentName: string
    objective: string
    label: string
    incident?: string
}

function startAgent(request: AgentRunRequest): { planId: string; conversationId: string } {
    const result = new LuxLabAgentRuntime().start({
        agentId: request.agentId,
        objective: request.objective,
        conversationLabel: `LuxLab: ${request.label}`,
        // LuxLab runs are unattended: the agent must answer without asking follow-up questions
        canInteractWithUser: false,
    })
    if (!result) throw new Error('AI Agents are not licensed on this instance')
    if (result.status !== 'success' || !result.data || !result.data.executionPlanId) {
        gs.error(`LuxLab agent "${request.agentName}" did not start: ${JSON.stringify(result)}`)
        const reason = (result.error && result.error.message) || 'the AI agent runtime refused the request'
        throw new Error(`${request.agentName} could not start: ${reason}. Check that the agent is active in AI Agent Studio.`)
    }
    return { planId: result.data.executionPlanId, conversationId: result.data.conversationId || '' }
}

export function startRun(request: AgentRunRequest): BriefingRunDto {
    const run = new GlideRecord(RUN)
    run.initialize()
    run.setValue('tool', request.tool)
    run.setValue('user', gs.getUserID())
    run.setValue('agent', request.agentId)
    if (request.incident) run.setValue('incident', request.incident)
    run.setValue('state', 'running')
    try {
        const started = startAgent(request)
        run.setValue('execution_plan', started.planId)
        run.setValue('conversation', started.conversationId)
    } catch (e) {
        run.setValue('state', 'failed')
        run.setValue('error', String((e as any).message || e).substring(0, 1000))
        run.setValue('finished_on', new GlideDateTime())
    }
    run.insert()
    return runDto(run)
}

export function runTool(toolId: string): BriefingRunDto {
    const tool = toolById(toolId)
    if (!tool) throw new Error(`Unknown briefing tool ${toolId}`)
    return startRun({
        tool: tool.id,
        agentId: tool.agentId,
        agentName: tool.agentName,
        objective: tool.objective(`${gs.getUserDisplayName()} (user name ${gs.getUserName()})`),
        label: `briefing ${tool.name}`,
    })
}

function thoughtOf(output: any): { thought: string; actions: string[] } {
    // gen_ai steps carry the ReAct engine answer as a JSON string under result
    const answer = output && typeof output.result === 'string' ? parse(output.result) : output && output.result
    if (!answer || typeof answer !== 'object') return { thought: '', actions: [] }
    const actions: any[] = Array.isArray(answer.Action) ? answer.Action : []
    return {
        thought: String(answer.Thought || '').substring(0, MAX_THOUGHT),
        actions: actions.map((action) => String(action && action.Name)).filter((name) => name && name !== 'undefined'),
    }
}

function stepsOf(planId: string): BriefingStepDto[] {
    const task = new GlideRecord('sn_aia_execution_task')
    task.addQuery('execution_plan', planId)
    task.orderBy('order')
    task.orderBy('sys_created_on')
    task.query()
    const steps: BriefingStepDto[] = []
    while (task.next()) {
        const type = task.getValue('type')
        const reasoning = type === 'gen_ai' ? thoughtOf(parse(task.getValue('output') || '')) : { thought: '', actions: [] }
        steps.push({
            order: parseInt(task.getValue('order'), 10) || 0,
            type,
            status: task.getValue('status') || '',
            name: type === 'gen_ai' ? 'Reasoning' : task.getValue('description') || type,
            thought: reasoning.thought,
            actions: reasoning.actions,
            ms: parseInt(task.getValue('execution_time_ms'), 10) || 0,
            startedAt: task.getValue('start_time') || '',
        })
    }
    return steps
}

// The agent's answer is its latest message addressed to the user (user_message). Tool observations and
// the closing "Completed operations" summary are logged as agent messages too, but without user_message.
function finalAnswer(planId: string): string {
    const message = new GlideRecord('sn_aia_message')
    message.addQuery('execution_plan', planId)
    message.addQuery('role', 'agent')
    message.orderByDesc('sys_created_on')
    message.setLimit(30)
    message.query()
    let plainText = ''
    while (message.next()) {
        const answer = (message.getValue('user_message') || '').trim()
        if (answer) return answer
        const text = (message.getValue('message') || '').trim()
        if (!plainText && text && !/^[{[]/.test(text)) plainText = text
    }
    return plainText
}

// Agents end some answers with "References: {"<label>":"<url>"}"; turn it into markdown links
function withReferenceLinks(answer: string): string {
    return answer.replace(/\n?References:\s*(\{[^\n]*\})\s*$/, (line, json) => {
        const references = parse(json)
        if (!references || typeof references !== 'object') return line
        const links = Object.keys(references).map((label) => `[${label}](${references[label]})`)
        return `\n\nReferences: ${links.join(', ')}`
    })
}

function planErrors(planId: string): string {
    const message = new GlideRecord('sn_aia_message')
    message.addQuery('execution_plan', planId)
    message.addNotNullQuery('error_type')
    message.orderByDesc('sys_created_on')
    message.setLimit(1)
    message.query()
    return message.next() ? `${message.getValue('error_type')}: ${message.getValue('message') || ''}`.substring(0, 1000) : ''
}

// Copies the plan's progress onto the run; once the plan finished the stored answer is final
function refresh(run: GlideRecord) {
    const plan = new GlideRecord('sn_aia_execution_plan')
    if (!plan.get('sys_id', run.getValue('execution_plan'))) return
    const planState = plan.getValue('state') || ''
    run.setValue('plan_state', planState)
    run.setValue('execution_ms', plan.getValue('execution_time_ms') || 0)
    if (DONE_STATES.indexOf(planState) >= 0) {
        const output = withReferenceLinks(finalAnswer(plan.getUniqueValue()))
        const failed = planState !== 'completed' || !output
        run.setValue('state', failed ? 'failed' : 'completed')
        run.setValue('output', output.substring(0, 16000))
        if (failed) {
            const reason = plan.getValue('state_reason') || planErrors(plan.getUniqueValue())
            run.setValue('error', `The agent ${output ? 'stopped' : 'finished without an answer'} (${planState}${reason ? `: ${reason}` : ''})`.substring(0, 1000))
        }
        run.setValue('finished_on', new GlideDateTime())
    }
    run.update()
}

// Runs are private to whoever started them
export function traceOf(runId: string): BriefingRunDto | null {
    const run = new GlideRecord(RUN)
    if (!run.get(runId) || run.getValue('user') !== gs.getUserID()) return null
    if (run.getValue('state') === 'running') refresh(run)
    return runDto(run, run.getValue('execution_plan') ? stepsOf(run.getValue('execution_plan')) : [])
}
