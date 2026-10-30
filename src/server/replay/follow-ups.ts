import { gs, GlideRecord } from '@servicenow/glide'

export const ACTION = 'x_everi_luxlab_replay_action'

export interface ReplayActionDto {
    sysId: string
    type: string
    title: string
    description: string
    rationale: string
    state: string
    decidedBy: string
    decidedOn: string
    problem: { sysId: string; number: string } | null
    knowledge: { sysId: string; number: string } | null
    article: string
}

export function canDecide(): boolean {
    return gs.hasRole('x_everi_luxlab.manager')
}

export function followUpsOf(replayId: string): ReplayActionDto[] {
    const actions: ReplayActionDto[] = []
    const action = new GlideRecord(ACTION)
    action.addQuery('replay', replayId)
    action.addQuery('state', '!=', 'dismissed')
    action.orderBy('sys_created_on')
    action.query()
    while (action.next()) {
        const problem = action.getValue('problem')
        const knowledge = action.getValue('knowledge')
        actions.push({
            sysId: action.getUniqueValue(),
            type: action.getValue('type'),
            title: action.getValue('title') || '',
            description: action.getValue('description') || '',
            rationale: action.getValue('rationale') || '',
            state: action.getValue('state'),
            decidedBy: action.getDisplayValue('decided_by'),
            decidedOn: action.getValue('decided_on') || '',
            problem: problem ? { sysId: problem, number: action.getDisplayValue('problem') } : null,
            knowledge: knowledge ? { sysId: knowledge, number: action.getDisplayValue('knowledge') } : null,
            article: action.getValue('article') || '',
        })
    }
    return actions
}
