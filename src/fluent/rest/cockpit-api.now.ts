import '@servicenow/sdk/global'
import { Acl, RestApi } from '@servicenow/sdk/core'
import { luxlabUser } from '../security/roles.now'
import { attention, overview } from '../../server/rest/cockpit-routes'

export const cockpitApiAcl = Acl({
    $id: Now.ID['cockpit-api-acl'],
    type: 'rest_endpoint',
    name: 'LuxLab Cockpit API',
    operation: 'execute',
    roles: [luxlabUser],
    description: 'Only LuxLab users can call the cockpit endpoints.',
})

// URIs: /api/x_everi_luxlab/v1/cockpit/overview and /api/x_everi_luxlab/v1/cockpit/attention
export const cockpitApi = RestApi({
    $id: Now.ID['cockpit-api'],
    name: 'LuxLab Cockpit',
    serviceId: 'cockpit',
    shortDescription: 'Data for the LuxLab operations cockpit',
    consumes: 'application/json',
    produces: 'application/json',
    enforceAcl: [cockpitApiAcl],
    versions: [{ $id: Now.ID['cockpit-api-v1'], version: 1, isDefault: true }],
    routes: [
        {
            $id: Now.ID['cockpit-api-overview'],
            name: 'overview',
            method: 'GET',
            path: '/overview',
            script: overview,
            version: 1,
            shortDescription: 'KPI tiles for the current user',
        },
        {
            $id: Now.ID['cockpit-api-attention'],
            name: 'attention',
            method: 'GET',
            path: '/attention',
            script: attention,
            version: 1,
            shortDescription: 'Current user tasks ranked by urgency',
            parameters: [
                { $id: Now.ID['cockpit-api-attention-page'], name: 'page', exampleValue: '1' },
                { $id: Now.ID['cockpit-api-attention-size'], name: 'pageSize', exampleValue: '5' },
            ],
        },
    ],
})
