import '@servicenow/sdk/global'
import { RestApi } from '@servicenow/sdk/core'
import { cockpitApiAcl } from './cockpit-api.now'
import { candidates, getReplay, rebuildReplay } from '../../server/rest/replay-routes'

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
    ],
})
