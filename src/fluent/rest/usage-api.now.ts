import '@servicenow/sdk/global'
import { RestApi } from '@servicenow/sdk/core'
import { cockpitApiAcl } from './cockpit-api.now'
import { getUsage, postRates } from '../../server/rest/usage-routes'

// URIs: /api/x_everi_luxlab/v1/usage?days=30, /api/x_everi_luxlab/v1/usage/rates
export const usageApi = RestApi({
    $id: Now.ID['usage-api'],
    name: 'LuxLab AI Usage',
    serviceId: 'usage',
    shortDescription: 'LLM calls, tokens and estimated assists of the LuxLab AI features',
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
            shortDescription: 'Runs, LLM calls, tokens and estimated assists per feature over the last 7, 30 or 90 days',
            parameters: [{ $id: Now.ID['usage-api-get-days'], name: 'days', exampleValue: '30' }],
        },
        {
            $id: Now.ID['usage-api-rates'],
            name: 'set rates',
            method: 'POST',
            path: '/rates',
            script: postRates,
            version: 1,
            shortDescription: 'Set the assists per agent run and per skill run from the Now Assist contract (LuxLab managers only)',
        },
    ],
})
