import '@servicenow/sdk/global'
import { RestApi } from '@servicenow/sdk/core'
import { cockpitApiAcl } from './cockpit-api.now'
import { run, tools, trace } from '../../server/rest/briefing-routes'

// URIs: /api/x_everi_luxlab/v1/briefing/tools, /api/x_everi_luxlab/v1/briefing/runs/{run}
export const briefingApi = RestApi({
    $id: Now.ID['briefing-api'],
    name: 'LuxLab Daily Briefing',
    serviceId: 'briefing',
    shortDescription: 'Run Daily Briefing tools on AI agents and follow their steps',
    consumes: 'application/json',
    produces: 'application/json',
    enforceAcl: [cockpitApiAcl],
    versions: [{ $id: Now.ID['briefing-api-v1'], version: 1, isDefault: true }],
    routes: [
        {
            $id: Now.ID['briefing-api-tools'],
            name: 'tools',
            method: 'GET',
            path: '/tools',
            script: tools,
            version: 1,
            shortDescription: 'Briefing tools with the current user’s latest run of today',
        },
        {
            $id: Now.ID['briefing-api-run'],
            name: 'run tool',
            method: 'POST',
            path: '/tools/{tool}/run',
            script: run,
            version: 1,
            shortDescription: 'Start the AI agent behind a briefing tool',
        },
        {
            $id: Now.ID['briefing-api-trace'],
            name: 'run trace',
            method: 'GET',
            path: '/runs/{run}',
            script: trace,
            version: 1,
            shortDescription: 'Progress, steps and answer of a briefing run',
        },
    ],
})
