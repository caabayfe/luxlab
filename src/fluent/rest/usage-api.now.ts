import '@servicenow/sdk/global'
import { RestApi } from '@servicenow/sdk/core'
import { cockpitApiAcl } from './cockpit-api.now'
import { getUsage } from '../../server/rest/usage-routes'

// URI: /api/x_everi_luxlab/v1/usage?days=30
export const usageApi = RestApi({
    $id: Now.ID['usage-api'],
    name: 'LuxLab AI Usage',
    serviceId: 'usage',
    shortDescription: 'Assists the platform metered for the LuxLab AI features',
    consumes: 'application/json',
    produces: 'application/json',
    enforceAcl: [cockpitApiAcl],
    versions: [{ $id: Now.ID['usage-api-v1'], version: 1, isDefault: true }],
    routes: [
        {
            $id: Now.ID['usage-api-get'],
            name: 'usage',
            method: 'GET',
            path: '/',
            script: getUsage,
            version: 1,
            shortDescription: 'Runs, tool actions and metered assists per feature over the last 7, 30 or 90 days',
            parameters: [{ $id: Now.ID['usage-api-get-days'], name: 'days', exampleValue: '30' }],
        },
    ],
})
