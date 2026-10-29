import { gs, GlideRecord } from '@servicenow/glide'

// Task classes that count as "my work" in the cockpit
export const WORK_TABLES = ['incident', 'incident_task', 'sc_req_item', 'sc_task', 'problem', 'change_request']

export const WORK_CLASS_QUERY = `sys_class_nameIN${WORK_TABLES.join(',')}`

export const PRIORITIES = ['1', '2', '3', '4', '5']

export function currentUserId(): string {
    return gs.getUserID()
}

// Group membership is read directly so the result is a plain array in scoped context
export function myGroupIds(): string[] {
    const ids: string[] = []
    const member = new GlideRecord('sys_user_grmember')
    member.addQuery('user', gs.getUserID())
    member.query()
    while (member.next()) {
        ids.push(member.getValue('group'))
    }
    return ids
}

export function inGroupsQuery(field: string, groupIds: string[]): string {
    // An empty IN list would match everything, so fall back to an impossible match
    return groupIds.length ? `${field}IN${groupIds.join(',')}` : `${field}=-1`
}
