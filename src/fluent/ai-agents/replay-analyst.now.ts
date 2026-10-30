import '@servicenow/sdk/global'
import { AiAgent } from '@servicenow/sdk/core'

// Tools go through the LuxLabReplayAI bridge so the agent and the skills share one replay context and save path
const getReplayScript = `(function(inputs) {
    try {
        return new x_everi_luxlab.LuxLabReplayAI().getContext(inputs.incident_number);
    } catch (e) {
        gs.error('LuxLab Replay Analyst could not read the replay: ' + e.message);
        return { error: 'The incident replay could not be read' };
    }
})(inputs);`

const saveReviewScript = `(function(inputs) {
    try {
        return { status: 'success', message: new x_everi_luxlab.LuxLabReplayAI().saveReview(inputs.incident_number, inputs.review) };
    } catch (e) {
        return { status: 'error', message: e.message };
    }
})(inputs);`

const saveFollowUpsScript = `(function(inputs) {
    try {
        return { status: 'success', message: new x_everi_luxlab.LuxLabReplayAI().saveFollowUps(inputs.incident_number, inputs.follow_ups) };
    } catch (e) {
        return { status: 'error', message: e.message };
    }
})(inputs);`

export const replayAnalyst = AiAgent({
    $id: Now.ID['replay_analyst_agent'],
    name: 'LuxLab Replay Analyst',
    description:
        'Reads the LuxLab Incident Replay of an incident and either writes a blameless post-incident review or proposes follow-ups (problems, knowledge articles with a draft body, improvement actions) for a LuxLab manager to approve.',
    agentRole: 'You are a senior major incident and problem manager who learns from incidents without blaming people.',
    agentDescriptor: 'created_by_build_agent',
    recordType: 'custom',
    channel: 'nap',
    processingMessage: 'Analysing the incident replay...',
    postProcessingMessage: 'Incident replay analysis saved.',
    securityAcl: { $id: Now.ID['replay_analyst_agent_acl'], type: 'Any authenticated user' },
    // Runs as the invoking user, limited to itil, like the Replay AI skills
    dataAccess: { roleMap: ['itil'] },
    versionDetails: [
        {
            name: 'V1',
            number: 1,
            state: 'published',
            instructions: `Step 1: Read the replay.
- Extract the incident number from the request and use the Get incident replay tool with it.
- If the result contains an error, explain the error in one sentence and stop. DO NOT PROCEED.
- Timeline lines read "T+<time since impact start> (<phase>) [KEY] <event> - <detail>". Phases: detection, triage, misrouted (with a team that was not the resolver), waiting (on hold), fixing, recovery. [KEY] marks a key moment.

Step 2a: If the request asks for a blameless review, write it in markdown with exactly these level-3 headings: ### Summary, ### Impact, ### Key moments, ### What helped, ### What slowed the response, ### Lessons learned.
- Summary is 2 to 3 sentences. Key moments is a list "- **T+<offset>**: <what happened and why it mattered>" with the 5 to 8 moments that changed the course of the incident. Other sections are short bullet lists.
- Quantify with the metrics and phase minutes. Use only "- " bullets and **bold**, no tables.
- Use the Save blameless review tool with the incident number and the full markdown review.

Step 2b: If the request asks for follow-ups, propose 2 to 6, each grounded in evidence from the replay:
- "problem" when the root cause is unknown, only worked around, or likely to recur.
- "knowledge" when the resolution or workaround is worth documenting. Add an "article" with a draft knowledge article in markdown: ### Symptoms, ### Cause, ### Resolution, ### Workaround (if any). Use only facts from the replay.
- "action" for process gaps: misrouting, long triage, silent gaps, slow detection, late communication.
- Use the Save follow-ups tool with the incident number and follow_ups as JSON: {"followUps": [{"type": "problem|knowledge|action", "title": "<imperative, max 100 characters>", "description": "<1 to 3 sentences>", "rationale": "<evidence citing T+ offsets or metrics>", "article": "<knowledge only>"}]}

Rules for both:
- Use only facts present in the replay. Never invent causes, systems, times or numbers; say when something is unknown.
- Stay blameless: name teams and roles, never individuals.
- If a save tool returns an error, fix the input and try once more.

Step 3: Present the result.
- Reply in plain English with one or two sentences saying what was saved (for follow-ups, list their titles). Do not repeat the full review.`,
        },
    ],
    tools: [
        {
            name: 'Get incident replay',
            description:
                'Returns the LuxLab Incident Replay of an incident by number (incident_number): incident fields, metrics, minutes per phase and the timeline, without people names.',
            type: 'script',
            recordType: 'custom',
            executionMode: 'autopilot',
            outputTransformationStrategy: 'none',
            preMessage: 'Reading the incident replay...',
            postMessage: 'Replay read.',
            inputs: [{ name: 'incident_number', description: 'Incident number, e.g. INC0026058', mandatory: true }],
            script: getReplayScript,
        },
        {
            // Writes only the review field of LuxLab's own replay record; autopilot because briefing runs are unattended
            name: 'Save blameless review',
            description: 'Saves the markdown blameless review (review) on the LuxLab replay of the incident (incident_number). Returns status and message.',
            type: 'script',
            recordType: 'custom',
            executionMode: 'autopilot',
            preMessage: 'Saving the review...',
            postMessage: 'Review saved.',
            inputs: [
                { name: 'incident_number', description: 'Incident number, e.g. INC0026058', mandatory: true },
                { name: 'review', description: 'The full blameless review in markdown', mandatory: true },
            ],
            script: saveReviewScript,
        },
        {
            // Saves proposals only: problems and articles are created when a LuxLab manager approves them
            name: 'Save follow-ups',
            description:
                'Saves proposed follow-ups (follow_ups, a JSON object with a followUps array) on the LuxLab replay of the incident (incident_number), replacing undecided proposals. Returns status and message.',
            type: 'script',
            recordType: 'custom',
            executionMode: 'autopilot',
            preMessage: 'Saving the follow-ups...',
            postMessage: 'Follow-ups saved for approval.',
            inputs: [
                { name: 'incident_number', description: 'Incident number, e.g. INC0026058', mandatory: true },
                { name: 'follow_ups', description: 'JSON object {"followUps": [...]} with the proposed follow-ups', mandatory: true },
            ],
            script: saveFollowUpsScript,
        },
    ],
})
