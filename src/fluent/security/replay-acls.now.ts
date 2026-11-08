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

Acl({
    $id: Now.ID['pattern-read-acl'],
    type: 'record',
    table: 'x_everi_luxlab_pattern',
    operation: 'read',
    roles: [luxlabUser],
    description: 'LuxLab users can read the response patterns mined from incident replays.',
})

// Runs are written by the briefing API; the API itself only returns a user's own runs
Acl({
    $id: Now.ID['briefing-run-read-acl'],
    type: 'record',
    table: 'x_everi_luxlab_briefing_run',
    operation: 'read',
    roles: [luxlabUser],
    script: `answer = current.user == gs.getUserID() || gs.hasRole('x_everi_luxlab.manager');`,
    description: 'LuxLab users can read their own Daily Briefing runs; managers can read all of them.',
})
