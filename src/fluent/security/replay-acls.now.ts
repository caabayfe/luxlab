import '@servicenow/sdk/global'
import { Acl } from '@servicenow/sdk/core'
import { luxlabUser } from './roles.now'

// Replays are written only by the server engine; users get read access to inspect them in classic UI
Acl({
    $id: Now.ID['replay-read-acl'],
    type: 'record',
    table: 'x_everi_luxlab_replay',
    operation: 'read',
    roles: [luxlabUser],
    description: 'LuxLab users can read incident replays.',
})

Acl({
    $id: Now.ID['replay-event-read-acl'],
    type: 'record',
    table: 'x_everi_luxlab_replay_event',
    operation: 'read',
    roles: [luxlabUser],
    description: 'LuxLab users can read incident replay events.',
})

Acl({
    $id: Now.ID['replay-action-read-acl'],
    type: 'record',
    table: 'x_everi_luxlab_replay_action',
    operation: 'read',
    roles: [luxlabUser],
    description: 'LuxLab users can read the follow-ups proposed for incident replays.',
})
