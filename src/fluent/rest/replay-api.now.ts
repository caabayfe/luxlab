import '@servicenow/sdk/global'
import { RestApi } from '@servicenow/sdk/core'
import { cockpitApiAcl } from './cockpit-api.now'
import { candidates, decide, followUpReplay, getReplay, rebuildReplay, reviewReplay } from '../../server/rest/replay-routes'

// URIs: /api/x_everi_luxlab/v1/replay/candidates, /api/x_everi_luxlab/v1/replay/{incident}
export const replayApi = RestApi({
    $id: Now.ID['replay-api'],
    name: 'LuxLab Incident Replay',
    serviceId: 'replay',
    shortDescription: 'Build and read incident replays',
    consumes: 'application/json',
    produces: 'application/json',
    enforceAcl: [cockpitApiAcl],
    versions: [{ $id: Now.ID['replay-api-v1'], version: 1, isDefault: true }],
    routes: [
        {
            $id: Now.ID['replay-api-candidates'],
            name: 'candidates',
            method: 'GET',
            path: '/candidates',
            script: candidates,
            version: 1,
            shortDescription: 'Major incidents and P1/P2 incidents that can be replayed',
            parameters: [{ $id: Now.ID['replay-api-candidates-search'], name: 'search', exampleValue: 'INC0010001' }],
        },
        {
            $id: Now.ID['replay-api-get'],
            name: 'get replay',
            method: 'GET',
            path: '/{incident}',
            script: getReplay,
            version: 1,
            shortDescription: 'Stored replay for an incident, or null when not built yet',
        },
        {
            $id: Now.ID['replay-api-build'],
            name: 'build replay',
            method: 'POST',
            path: '/{incident}/build',
            script: rebuildReplay,
            version: 1,
            shortDescription: 'Rebuild the replay from the incident history',
        },
        {
            $id: Now.ID['replay-api-review'],
            name: 'write review',
            method: 'POST',
            path: '/{incident}/review',
            script: reviewReplay,
            version: 1,
            shortDescription: 'Write the blameless incident review with the LuxLab Incident Review Writer skill',
        },
        {
            $id: Now.ID['replay-api-follow-ups'],
            name: 'suggest follow-ups',
            method: 'POST',
            path: '/{incident}/follow-ups',
            script: followUpReplay,
            version: 1,
            shortDescription: 'Propose problems, knowledge and actions with the LuxLab Follow-up Advisor skill',
        },
        {
            $id: Now.ID['replay-api-decide'],
            name: 'decide follow-up',
            method: 'POST',
            path: '/{incident}/follow-ups/{action}',
            script: decide,
            version: 1,
            shortDescription: 'Approve or dismiss a proposed follow-up (LuxLab managers only)',
        },
    ],
})
