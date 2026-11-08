import '@servicenow/sdk/global'
import { AiAgent } from '@servicenow/sdk/core'

// Tools go through the LuxLabReplayAI bridge, like the Replay Analyst's
const getPatternScript = `(function(inputs) {
    try {
        return new x_everi_luxlab.LuxLabReplayAI().getPatternContext(inputs.pattern_id);
    } catch (e) {
        gs.error('LuxLab Pattern Analyst could not read the pattern: ' + e.message);
        return { error: 'The response pattern could not be read' };
    }
})(inputs);`

const saveProposalScript = `(function(inputs) {
    try {
        return { status: 'success', message: new x_everi_luxlab.LuxLabReplayAI().savePatternProposal(inputs.pattern_id, inputs.fix_type, inputs.proposal) };
    } catch (e) {
        return { status: 'error', message: e.message };
    }
})(inputs);`

export const patternAnalyst = AiAgent({
    $id: Now.ID['pattern_analyst_agent'],
    name: 'LuxLab Pattern Analyst',
    description:
        'Reads a LuxLab response pattern (where the incident response keeps losing time across many incidents) and proposes one fix for a LuxLab manager to accept.',
    agentRole: 'You are a senior IT service management process owner who improves how incidents are routed, worked and detected, without blaming people.',
    agentDescriptor: 'created_by_build_agent',
    recordType: 'custom',
    channel: 'nap',
    processingMessage: 'Analysing the response pattern...',
    postProcessingMessage: 'Fix proposed.',
    securityAcl: { $id: Now.ID['pattern_analyst_agent_acl'], type: 'Any authenticated user' },
    dataAccess: { roleMap: ['itil'] },
    versionDetails: [
        {
            name: 'V1',
            number: 1,
            state: 'published',
            instructions: `Step 1: Read the pattern.
- Extract the pattern id (32 hexadecimal characters) from the request and use the Get response pattern tool with it.
- If the result contains an error, explain the error in one sentence and stop. DO NOT PROCEED.
- The result has the pattern (type, groups, time lost, median time to resolve against the other P1/P2 incidents, top services and categories) and the evidence: the incidents that lost the most time, with their category, service, CI, group path and resolution.

Step 2: Find what the incidents share and choose ONE fix_type:
- "routing" for misrouting: name the assignment rule, category or service mapping that would send these incidents straight to the resolving group, based on the categories, services, CIs or wording the incidents share.
- "knowledge" when first-line or the wrong group lacked the know-how to recognise or fix the issue.
- "monitoring" for late detection: alerts existed before the incident, so propose auto-creating or auto-routing the incident from those alerts.
- "process" for silent gaps or waiting: update cadence, handover or escalation rules, vendor or change wait limits.
- "problem" when the evidence shows the same underlying cause recurring.

Step 3: Write the proposal in markdown with exactly these level-3 headings: ### What is happening, ### Evidence, ### Recommended fix, ### How to check it worked.
- What is happening: 2 sentences with the time lost and the comparison with other incidents.
- Evidence: 3 to 5 bullets citing incident numbers and what they share.
- Recommended fix: concrete steps a ServiceNow administrator or process owner can carry out.
- How to check it worked: the metric from this pattern to watch and the target, e.g. fewer incidents in the pattern or a lower median time to resolve.
- Use only "- " bullets and **bold**, no tables. Use only facts from the tool result. Name teams, never individuals.
- Use the Save pattern proposal tool with the pattern id, the fix_type and the proposal. If it returns an error, fix the input and try once more.

Step 4: Reply in plain English with one sentence saying which fix was proposed. Do not repeat the proposal.`,
        },
    ],
    tools: [
        {
            name: 'Get response pattern',
            description:
                'Returns a LuxLab response pattern by id (pattern_id): its statistics and the incidents that lost the most time, without people names.',
            type: 'script',
            recordType: 'custom',
            executionMode: 'autopilot',
            outputTransformationStrategy: 'none',
            preMessage: 'Reading the response pattern...',
            postMessage: 'Pattern read.',
            inputs: [{ name: 'pattern_id', description: 'Response pattern sys_id', mandatory: true }],
            script: getPatternScript,
        },
        {
            // Writes only the proposal fields of LuxLab's own pattern record; a manager accepts it
            name: 'Save pattern proposal',
            description: 'Saves the proposed fix (proposal, markdown) and its type (fix_type) on the response pattern (pattern_id). Returns status and message.',
            type: 'script',
            recordType: 'custom',
            executionMode: 'autopilot',
            preMessage: 'Saving the proposal...',
            postMessage: 'Proposal saved.',
            inputs: [
                { name: 'pattern_id', description: 'Response pattern sys_id', mandatory: true },
                { name: 'fix_type', description: 'One of routing, knowledge, monitoring, process, problem', mandatory: true },
                { name: 'proposal', description: 'The proposal in markdown', mandatory: true },
            ],
            script: saveProposalScript,
        },
    ],
})
