import '@servicenow/sdk/global'
import { NowAssistSkillConfig } from '@servicenow/sdk/core'

// Azure OpenAI (ServiceNow OEM) Chat Completions; the BYOK OpenAI provider has no API key on this instance
const AZURE_OPENAI_CHAT_COMPLETIONS = 'a55c1c6f530221106b38ddeeff7b12b1'

// The live coach rebuilds the replay before running the skill, so the context includes the latest work notes
const replayContextScript = `(function(context) {
    try {
        return new x_everi_luxlab.LuxLabReplayAI().getContext(context.getValue('incident_number'));
    } catch (e) {
        gs.error('LuxLab replay context failed: ' + e.message);
        return { error: 'The incident replay could not be read' };
    }
})(context)`

// Run only from the live coach's Draft update button; the draft is shown for editing and never posted by itself
export const commsDrafter = NowAssistSkillConfig(
    {
        $id: Now.ID['comms_drafter_skill'],
        state: 'published',
        name: 'LuxLab Comms Drafter',
        shortDescription: 'Drafts a customer update for a live incident from its Incident Replay',
        description:
            'Reads the LuxLab Incident Replay of a live incident and drafts a short customer-facing update: what is affected, what the team has done, what happens next and when the next update will come.',
        inputs: [
            {
                $id: Now.ID['comms_drafter_incident_number_input'],
                name: 'incident number',
                description: 'Number of the live incident, e.g. INC0026095',
                mandatory: true,
                dataType: 'string',
                testValues: 'INC0026095',
            },
        ],
        tools: (t) => {
            const getReplay = t.InlineScript('GetReplay', {
                $id: Now.ID['comms_drafter_get_replay_tool'],
                script: replayContextScript,
            })
            return { GetReplay: getReplay }
        },
        securityControls: {
            userAccess: { $id: Now.ID['comms_drafter_user_access'], type: 'authenticated' },
            roleMap: ['itil'],
        },
    },
    {
        providers: [
            {
                provider: 'Azure OpenAI',
                providerAPI: { type: 'sys_hub_flow', id: AZURE_OPENAI_CHAT_COMPLETIONS },
                prompts: [
                    {
                        name: 'Draft customer update',
                        versions: [
                            {
                                $id: Now.ID['comms_drafter_prompt_v1'],
                                model: 'gpt-5.4-mini',
                                temperature: 0.3,
                                maxTokens: 800,
                                // Replaced by v2, which names the language: from the short description alone it answered in English
                                promptState: 'archived',
                                prompt: (p) => `## Role
You are the communications lead of a live major incident. Your task is to write the next customer update.

## Context
Incident number: ${p.input['incident number']}
Replay of the incident so far (incident fields, metrics and the timeline): ${p.tool.GetReplay.output}

Timeline lines read "T+<time since impact start> (<phase>) [KEY] <event> — <detail>". Work notes are internal; customer updates are what customers already saw.

## Instructions
1. If the replay contains an "error" field, reply with one sentence saying the update could not be drafted, then stop.
2. Write for the affected users, not for engineers: plain language, no internal group names, no people's names, no ticket jargon.
3. Use only facts from the replay. Never promise a fix time unless the timeline states one; say the investigation continues instead.
4. Do not repeat what the previous customer update already said, unless nothing changed; then say so honestly.
5. End with when the next update will come: in 30 minutes for priority 1, in 1 hour otherwise.

## Output
Plain text only, 50 to 110 words, in the language of the incident's short description. No headings, no bullet points, no greeting, no signature.`,
                            },
                            {
                                $id: Now.ID['comms_drafter_prompt_v2'],
                                version: 2,
                                model: 'gpt-5.4-mini',
                                temperature: 0.3,
                                maxTokens: 800,
                                // Published versions can't be edited: change the prompt by adding a new version
                                promptState: 'published',
                                prompt: (p) => `## Role
You are the communications lead of a live major incident. Your task is to write the next customer update.

## Context
Incident number: ${p.input['incident number']}
Replay of the incident so far (incident fields, the customers' language, metrics and the timeline): ${p.tool.GetReplay.output}

Timeline lines read "T+<time since impact start> (<phase>) [KEY] <event> — <detail>". Work notes are internal; customer updates are what customers already saw.

## Instructions
1. Write the whole update in the language given in the replay's "language" field, even when the timeline is in another language. If the field is missing, use the language of the incident's short description.
2. If the replay contains an "error" field, reply with one sentence saying the update could not be drafted, then stop.
3. Write for the affected users, not for engineers: plain language, no internal group names, no people's names, no ticket jargon.
4. Use only facts from the replay. Never promise a fix time unless the timeline states one; say the investigation continues instead.
5. Do not repeat what the previous customer update already said, unless nothing changed; then say so honestly.
6. End with when the next update will come: in 30 minutes for priority 1, in 1 hour otherwise.

## Output
Plain text only, 50 to 110 words, in that language. No headings, no bullet points, no greeting, no signature.`,
                            },
                        ],
                    },
                ],
            },
        ],
    }
)
