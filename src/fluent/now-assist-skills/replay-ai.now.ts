import '@servicenow/sdk/global'
import { NowAssistSkillConfig } from '@servicenow/sdk/core'

// Azure OpenAI (ServiceNow OEM) Chat Completions; the BYOK OpenAI provider has no API key on this instance
const AZURE_OPENAI_CHAT_COMPLETIONS = 'a55c1c6f530221106b38ddeeff7b12b1'

// Shared by both skills: builds the replay when missing and returns it without people's names
const replayContextScript = `(function(context) {
    try {
        return new x_everi_luxlab.LuxLabReplayAI().getContext(context.getValue('incident_number'));
    } catch (e) {
        gs.error('LuxLab replay context failed: ' + e.message);
        return { error: 'The incident replay could not be read' };
    }
})(context)`

// Form buttons go through LuxLab so results are saved on the replay and shown formatted, not as raw JSON
const reviewButtonScript = `(function () {
    try {
        gs.addInfoMessage(new x_everi_luxlab.LuxLabReplayAI().reviewMessage(current.getUniqueValue()));
    } catch (e) {
        gs.error('LuxLab Replay AI form button failed: ' + e);
        gs.addErrorMessage('Replay AI could not write the review: ' + (e.message || e));
    }
    action.setRedirectURL(current);
})();`

const followUpsButtonScript = `(function () {
    try {
        gs.addInfoMessage(new x_everi_luxlab.LuxLabReplayAI().followUpsMessage(current.getUniqueValue()));
    } catch (e) {
        gs.error('LuxLab Replay AI form button failed: ' + e);
        gs.addErrorMessage('Replay AI could not suggest follow-ups: ' + (e.message || e));
    }
    action.setRedirectURL(current);
})();`

export const incidentReviewWriter = NowAssistSkillConfig(
    {
        $id: Now.ID['incident_review_writer_skill'],
        // Published in Skill Builder on 2026-10-29; declared here so installs keep it published
        state: 'published',
        name: 'LuxLab Incident Review Writer',
        shortDescription: 'Writes a blameless incident review from an Incident Replay',
        description:
            'Reads the LuxLab Incident Replay of an incident (timeline, phases, reassignments, silent gaps) and writes a blameless post-incident review: summary, impact, key moments, what helped, what slowed the response and lessons learned.',
        inputs: [
            {
                $id: Now.ID['incident_review_writer_incident_number_input'],
                name: 'incident number',
                description: 'Number of the incident to review, e.g. INC0026058',
                mandatory: true,
                dataType: 'string',
                testValues: 'INC0026058',
            },
        ],
        tools: (t) => {
            const getReplay = t.InlineScript('GetReplay', {
                $id: Now.ID['incident_review_writer_get_replay_tool'],
                script: replayContextScript,
            })
            return { GetReplay: getReplay }
        },
        securityControls: {
            userAccess: { $id: Now.ID['incident_review_writer_user_access'], type: 'authenticated' },
            roleMap: ['itil'],
        },
        deploymentSettings: {
            uiAction: {
                $id: Now.ID['incident_review_writer_uiaction'],
                table: 'incident',
                script: reviewButtonScript,
            },
            nowAssistPanel: { enabled: true },
            flowAction: true,
        },
    },
    {
        providers: [
            {
                provider: 'Azure OpenAI',
                providerAPI: { type: 'sys_hub_flow', id: AZURE_OPENAI_CHAT_COMPLETIONS },
                prompts: [
                    {
                        name: 'Write blameless review',
                        versions: [
                            {
                                $id: Now.ID['incident_review_writer_prompt_v1'],
                                model: 'gpt-5.5',
                                temperature: 0.2,
                                maxTokens: 4000,
                                // Published prompts are frozen: change them by adding a new draft version
                                promptState: 'published',
                                prompt: (p) => `## Role
You are a senior major incident manager who writes blameless post-incident reviews. Your task is to turn a reconstructed incident timeline into a review that helps the organisation learn.

## Context
Incident number: ${p.input['incident number']}
Replay of the incident (incident fields, metrics, minutes per phase and the timeline): ${p.tool.GetReplay.output}

Timeline lines read "T+<time since impact start> (<phase>) [KEY] <event> — <detail>". Phases: detection (impact before the ticket existed), triage (finding the right team), misrouted (with a team that was not the resolver), waiting (on hold or resolved awaiting confirmation), fixing (the resolver team working it), recovery (resolved until closed). [KEY] marks a key moment.

## Instructions
1. If the replay contains an "error" field, reply with one sentence explaining that the review could not be written and why, then stop.
2. Use only facts present in the replay. Never invent causes, systems, times or numbers; when something is unknown, say it is unknown.
3. Stay blameless: describe teams and roles ("the service desk", "the network team", "the assigned engineer"), never individuals, and frame problems as gaps in process, tooling or information.
4. Quantify with the metrics and phase minutes: where time went, how many reassignments, handoffs and silent gaps.
5. Pick the 5 to 8 moments that changed the course of the incident for the key moments section, quoting their T+ offsets.
6. Keep lessons concrete and actionable; do not repeat the same point in several sections.

## Output
Markdown only, in English, using exactly these level-3 headings in this order: ### Summary, ### Impact, ### Key moments, ### What helped, ### What slowed the response, ### Lessons learned.
Summary is 2 to 3 sentences. Key moments is a bulleted list "- **T+<offset>**: <what happened and why it mattered>". The other sections are short bulleted lists. Use only headings, "- " bullets and **bold**; no tables, no other headings, no closing remarks.`,
                            },
                        ],
                    },
                ],
            },
        ],
    }
)

export const followUpAdvisor = NowAssistSkillConfig(
    {
        $id: Now.ID['follow_up_advisor_skill'],
        // Published in Skill Builder on 2026-10-29; declared here so installs keep it published
        state: 'published',
        name: 'LuxLab Followup Advisor',
        shortDescription: 'Proposes problems, knowledge articles and actions from an Incident Replay',
        description:
            'Reads the LuxLab Incident Replay of an incident and proposes follow-ups: problem records for unresolved causes, knowledge articles for fixes or workarounds worth reusing, and improvement actions for routing, monitoring or communication gaps. A LuxLab manager approves or dismisses each one.',
        inputs: [
            {
                $id: Now.ID['follow_up_advisor_incident_number_input'],
                name: 'incident number',
                description: 'Number of the incident to analyse, e.g. INC0026058',
                mandatory: true,
                dataType: 'string',
                testValues: 'INC0026058',
            },
        ],
        tools: (t) => {
            const getReplay = t.InlineScript('GetReplay', {
                $id: Now.ID['follow_up_advisor_get_replay_tool'],
                script: replayContextScript,
            })
            return { GetReplay: getReplay }
        },
        securityControls: {
            userAccess: { $id: Now.ID['follow_up_advisor_user_access'], type: 'authenticated' },
            roleMap: ['itil'],
        },
        deploymentSettings: {
            uiAction: {
                $id: Now.ID['follow_up_advisor_uiaction'],
                table: 'incident',
                script: followUpsButtonScript,
            },
            nowAssistPanel: { enabled: true },
            flowAction: true,
        },
    },
    {
        providers: [
            {
                provider: 'Azure OpenAI',
                providerAPI: { type: 'sys_hub_flow', id: AZURE_OPENAI_CHAT_COMPLETIONS },
                prompts: [
                    {
                        name: 'Propose followups',
                        versions: [
                            {
                                $id: Now.ID['follow_up_advisor_prompt_v1'],
                                model: 'gpt-5.4-mini',
                                temperature: 0.2,
                                maxTokens: 2000,
                                // Published prompts are frozen: change them by adding a new draft version
                                promptState: 'published',
                                prompt: (p) => `## Role
You are a problem manager reviewing a resolved incident. Your task is to propose the follow-up work that would stop it from recurring or make the next response faster.

## Context
Incident number: ${p.input['incident number']}
Replay of the incident (incident fields, metrics, minutes per phase and the timeline): ${p.tool.GetReplay.output}

Phases: detection, triage, misrouted (with a non-resolver team), waiting (on hold), fixing, recovery. [KEY] marks a key moment.

## Instructions
1. If the replay contains an "error" field, return {"followUps": []}.
2. Propose 2 to 6 follow-ups, each grounded in specific evidence from the replay. Never invent facts.
3. Use type "problem" when the root cause is unknown, only worked around, or likely to recur.
4. Use type "knowledge" when the resolution or workaround is worth documenting for the service desk or resolver teams.
5. Use type "action" for process gaps the timeline shows: misrouting and reassignments, long triage, silent gaps, slow detection, missing alerting or late communications.
6. Stay blameless: name teams or roles, never individuals.

## Output
Return only a JSON object, with no markdown fence and no other text, in this shape:
{"followUps": [{"type": "problem|knowledge|action", "title": "<imperative title, max 100 characters>", "description": "<what to do, 1 to 3 sentences>", "rationale": "<the evidence from the replay, citing T+ offsets or metrics>"}]}`,
                            },
                        ],
                    },
                ],
            },
        ],
    }
)
