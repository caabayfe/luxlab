import '@servicenow/sdk/global'
import { RestApi } from '@servicenow/sdk/core'
import { cockpitApiAcl } from './cockpit-api.now'
import { decide, patterns, propose, refresh } from '../../server/rest/pattern-routes'

// URIs: /api/x_everi_luxlab/v1/patterns, /api/x_everi_luxlab/v1/patterns/refresh
export const patternApi = RestApi({
    $id: Now.ID['pattern-api'],
    name: 'LuxLab Response Patterns',
    serviceId: 'patterns',
    shortDescription: 'Where the incident response keeps losing time, mined from incident replays',
    consumes: 'application/json',
    produces: 'application/json',
    enforceAcl: [cockpitApiAcl],
    versions: [{ $id: Now.ID['pattern-api-v1'], version: 1, isDefault: true }],
    routes: [
        {
            $id: Now.ID['pattern-api-list'],
            name: 'list patterns',
            method: 'GET',
            path: '/',
            script: patterns,
            version: 1,
            shortDescription: 'Replay coverage of the last 90 days and the mined patterns',
        },
        {
            $id: Now.ID['pattern-api-refresh'],
            name: 'refresh patterns',
            method: 'POST',
            path: '/refresh',
            script: refresh,
            version: 1,
            shortDescription: 'Replay the next batch of missing incidents; mine the patterns once none are left',
        },
        {
            $id: Now.ID['pattern-api-propose'],
            name: 'propose fix',
            method: 'POST',
            path: '/{pattern}/agent',
            script: propose,
            version: 1,
            shortDescription: 'Start the LuxLab Pattern Analyst agent to propose a fix for the pattern',
        },
        {
            $id: Now.ID['pattern-api-decide'],
            name: 'decide pattern',
            method: 'POST',
            path: '/{pattern}/decision',
            script: decide,
            version: 1,
            shortDescription: 'Accept or dismiss the proposed fix (LuxLab managers only)',
        },
    ],
})
