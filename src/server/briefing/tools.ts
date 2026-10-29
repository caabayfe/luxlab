// Daily briefing tools, each backed by an out-of-the-box AI agent. Objectives keep the agents read-only:
// the briefing presents work, it never reassigns, updates or saves anything on the user's behalf.

export interface BriefingTool {
    id: string
    name: string
    description: string
    agentId: string
    agentName: string
    objective: (userName: string) => string
}

export const BRIEFING_TOOLS: BriefingTool[] = [
    {
        id: 'analyze-queue',
        name: 'Analyze My Queue',
        description: 'Queue health readout: workload mix, risks, patterns and next actions.',
        agentId: 'ff52e1f12bd3f6100171f8014391bf98',
        agentName: 'Incident context AI agent',
        objective: (user) =>
            `Analyze the open incidents currently assigned to ${user}. Summarize the workload by priority and state, ` +
            'call out SLA risks and common patterns (same service, CI or caller), and finish with the three most useful next actions. Do not change any record.',
    },
    {
        id: 'next-best-order',
        name: 'Next Best Work Order',
        description: 'Suggested order to work your tickets based on SLA, priority and impact.',
        agentId: '9ff26cf63bb262101888f0ec73e45a87',
        agentName: 'Prioritize work AI agent',
        objective: (user) =>
            `Prioritize the open tasks assigned to ${user} for today and present the ordered work plan with a one-line reason per task. ` +
            'Present the plan only: do not wait for approval and do not save the plan.',
    },
    {
        id: 'stalled-work',
        name: 'Stalled Work Detector',
        description: 'Assigned work that is aging, on hold, or missing a recent update.',
        agentId: '19833a852fa88794cbef413bcfa4e3cd',
        agentName: 'Proactive Escalation AI Agent',
        objective: (user) =>
            `Assess the open tasks assigned to ${user} and list the ones that are stalled or at risk of escalation, with the reason for each ` +
            '(aging, on hold, SLA, no recent update). Present the results only: do not escalate or update any record.',
    },
    {
        id: 'customer-impact',
        name: 'Customer Impact Brief',
        description: 'Active work grouped by customer, turned into impact and escalation notes.',
        agentId: 'ff52e1f12bd3f6100171f8014391bf98',
        agentName: 'Incident context AI agent',
        objective: (user) =>
            `Group the open incidents assigned to ${user} by caller company or affected business service. For each group, describe the business impact ` +
            'and whether an escalation note to the customer is advisable. Do not change any record.',
    },
    {
        id: 'update-draft',
        name: 'Update Draft Assistant',
        description: 'Customer-facing updates for tickets that have gone quiet.',
        agentId: 'ff52e1f12bd3f6100171f8014391bf98',
        agentName: 'Incident context AI agent',
        objective: (user) =>
            `Find the open incidents assigned to ${user} whose last customer-visible comment is older than two days and draft a short, ` +
            'professional customer update for each one. Present the drafts only: do not post any comment.',
    },
    {
        id: 'weekly-summary',
        name: 'Weekly Summary',
        description: 'This week against last week: opened incidents and what changed.',
        agentId: '146ee3943314d310e4525e1ace5c7bc5',
        agentName: 'Period comparison AI agent (AIT)',
        objective: () =>
            'Compare the incidents created in the last 7 days with the 7 days before, grouped by priority, ' +
            'and explain which groups account for the difference.',
    },
]

export function toolById(id: string): BriefingTool | null {
    return BRIEFING_TOOLS.filter((tool) => tool.id === id)[0] || null
}
