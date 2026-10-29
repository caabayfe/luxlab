import '@servicenow/sdk/global'
import { Role } from '@servicenow/sdk/core'

export const luxlabUser = Role({
    name: 'x_everi_luxlab.user',
    description: 'Uses the LuxLab cockpit and Incident Replay. Assign to fulfillers who already work tickets (itil).',
})

export const luxlabManager = Role({
    name: 'x_everi_luxlab.manager',
    description: 'LuxLab user who can also approve Incident Replay follow-ups (problems, knowledge drafts).',
    containsRoles: [luxlabUser],
})
