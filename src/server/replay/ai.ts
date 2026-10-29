import { gs, GlideDateTime, GlideRecord, GlideRecordSecure } from '@servicenow/glide'
import { OneExtendUtil } from '@servicenow/glide/sn_one_extend'
import { ACTION } from './follow-ups.ts'
import { buildReplay } from './store.ts'

export const REVIEW_SKILL = 'LuxLab Incident Review Writer'
export const FOLLOW_UP_SKILL = 'LuxLab Followup Advisor'

const SCOPE_ID = 'fb5abdbad5284c47ba44798f6f5ad965'
const FOLLOW_UP_TYPES = ['problem', 'knowledge', 'action']
const MAX_FOLLOW_UPS = 8


function capabilityId(skillName: string): string {
    const capability = new GlideRecord('sys_one_extend_capability')
    capability.addQuery('name', skillName)
    capability.addQuery('sys_scope', SCOPE_ID)
    capability.query()
    return capability.next() ? capability.getUniqueValue() : ''
}

function skillConfigId(capability: string): string {
    const config = new GlideRecord('sn_nowassist_skill_config')
    return config.get('skill_id', capability) ? config.getUniqueValue() : ''
}

// Skill responses arrive either as an object or as a JSON string carrying model_output
function modelOutput(response: any): string {
    if (response && typeof response === 'object') {
        return 'model_output' in response ? String(response.model_output || '') : JSON.stringify(response)
    }
    if (typeof response !== 'string') return ''
    try {
        // Only unwrap an envelope: a skill that answers in JSON (the follow-up advisor) parses too
        const parsed = JSON.parse(response)
        return parsed && typeof parsed === 'object' && 'model_output' in parsed ? String(parsed.model_output || '') : response
    } catch (e) {
        return response
    }
}

function runSkill(skillName: string, incidentNumber: string): string {
    const id = capabilityId(skillName)
    if (!id) throw new Error(`Skill "${skillName}" is not installed`)
    // executeSecure applies the skill's user access and role mapping, as the platform's generated UI actions do
    const result: any = (OneExtendUtil as any).executeSecure({
        executionRequests: [{ payload: { incident_number: incidentNumber }, capabilityId: id, meta: { skillConfigId: skillConfigId(id) } }],
        mode: 'sync',
    })
    // Refusals before execution (e.g. the caller lacks the skill's execution role) come back at the top level
    const capability = ((result && result.capabilities) || {})[id]
    if (!capability && result && result.status === 'error') {
        gs.error(`LuxLab skill "${skillName}" was refused: ${JSON.stringify(result)}`)
        throw new Error(
            `"${skillName}" could not run: ${result.message || 'refused by the platform'}. ` +
                'Check that the skill is activated in Now Assist Admin and that you have the itil role.'
        )
    }
    if (!capability) throw new Error(`"${skillName}" returned no result`)
    if (capability.status === 'error') {
        gs.error(`LuxLab skill "${skillName}" failed: ${JSON.stringify(capability)}`)
        // 100004: the generative AI preprocessor found no active prompt, which means the skill is still a draft
        if (String(capability.errorCode) === '100004') throw new Error(`"${skillName}" is not published yet. Publish it in Skill Builder and try again.`)
        throw new Error(`"${skillName}" failed (error ${capability.errorCode}${capability.error ? `: ${capability.error}` : ''})`)
    }
    const output = modelOutput(capability.response)
    if (!output) {
        gs.error(`LuxLab skill "${skillName}" returned no output: ${JSON.stringify(result)}`)
        throw new Error(`"${skillName}" returned an empty answer`)
    }
    return output
}

// The form buttons can run before anyone opened the replay, so it is built on demand
function replayOf(incident: GlideRecordSecure<'incident'>): GlideRecord {
    const replay = new GlideRecord('x_everi_luxlab_replay')
    if (replay.get('incident', incident.getUniqueValue())) return replay
    buildReplay(incident)
    if (!replay.get('incident', incident.getUniqueValue())) throw new Error('The replay could not be built')
    return replay
}

export function writeReview(incident: GlideRecordSecure<'incident'>): string {
    const replay = replayOf(incident)
    const review = runSkill(REVIEW_SKILL, incident.getValue('number'))
    replay.setValue('review', review)
    replay.setValue('reviewed_on', new GlideDateTime())
    replay.update()
    return review
}

interface FollowUp {
    type: string
    title: string
    description: string
    rationale: string
}

// The advisor answers in JSON, sometimes wrapped in a markdown fence
function parseFollowUps(output: string): FollowUp[] {
    const json = output.replace(/^[\s\S]*?(\{[\s\S]*\})[\s\S]*$/, '$1')
    const parsed = JSON.parse(json)
    const items: any[] = Array.isArray(parsed.followUps) ? parsed.followUps : []
    return items
        .filter((item) => item && FOLLOW_UP_TYPES.indexOf(item.type) >= 0 && item.title)
        .slice(0, MAX_FOLLOW_UPS)
        .map((item) => ({
            type: item.type,
            title: String(item.title).substring(0, 160),
            description: String(item.description || '').substring(0, 4000),
            rationale: String(item.rationale || '').substring(0, 1000),
        }))
}

// Decided follow-ups are history; only undecided proposals are replaced
export function suggestFollowUps(incident: GlideRecordSecure<'incident'>): FollowUp[] {
    const replay = replayOf(incident)
    const followUps = parseFollowUps(runSkill(FOLLOW_UP_SKILL, incident.getValue('number')))
    const stale = new GlideRecord(ACTION)
    stale.addQuery('replay', replay.getUniqueValue())
    stale.addQuery('state', 'proposed')
    stale.deleteMultiple()
    followUps.forEach((followUp) => {
        const action = new GlideRecord(ACTION)
        action.initialize()
        action.setValue('replay', replay.getUniqueValue())
        action.setValue('incident', incident.getUniqueValue())
        action.setValue('type', followUp.type)
        action.setValue('title', followUp.title)
        action.setValue('description', followUp.description)
        action.setValue('rationale', followUp.rationale)
        action.setValue('state', 'proposed')
        action.insert()
    })
    replay.setValue('follow_ups_on', new GlideDateTime())
    replay.update()
    return followUps
}

function createProblem(action: GlideRecord): string {
    const problem = new GlideRecordSecure('problem')
    problem.initialize()
    problem.setValue('short_description', action.getValue('title'))
    problem.setValue('description', `${action.getValue('description')}\n\nWhy: ${action.getValue('rationale')}`)
    problem.setValue('first_reported_by_task', action.getValue('incident'))
    const id = problem.insert()
    if (!id) throw new Error('You are not allowed to create problem records')
    return id
}

// Approving a problem follow-up raises the problem record; other types are tracked as approved
export function decideFollowUp(actionId: string, approve: boolean): GlideRecord {
    const action = new GlideRecord(ACTION)
    if (!action.get(actionId)) throw new Error('Follow-up not found')
    if (action.getValue('state') !== 'proposed') throw new Error('This follow-up was already decided')
    if (approve && action.getValue('type') === 'problem') action.setValue('problem', createProblem(action))
    action.setValue('state', approve ? 'approved' : 'dismissed')
    action.setValue('decided_by', gs.getUserID())
    action.setValue('decided_on', new GlideDateTime())
    action.update()
    return action
}

