import '@servicenow/sdk/global'
import { RestApi } from '@servicenow/sdk/core'
import { cockpitApiAcl } from './cockpit-api.now'
import { act, dismiss, draft, incident, live, post } from '../../server/rest/coach-routes'

// URIs: /api/x_everi_luxlab/v1/coach/live, /api/x_everi_luxlab/v1/coach/incidents/{incident}/...
export const coachApi = RestApi({
    $id: Now.ID['coach-api'],
    name: 'LuxLab Live Coach',
    serviceId: 'coach',
    shortDescription: 'Live nudges for open P1/P2 and major incidents: silence, comms cadence, SLA, routing and known patterns',
    consumes: 'application/json',
    produces: 'application/json',
    enforceAcl: [cockpitApiAcl],
    versions: [{ $id: Now.ID['coach-api-v1'], version: 1, isDefault: true }],
    routes: [
        {
            $id: Now.ID['coach-api-live'],
            name: 'live incidents',
            method: 'GET',
            path: '/live',
            script: live,
            version: 1,
            shortDescription: 'Live incidents with their clocks and nudges, most urgent first',
        },
        {
            $id: Now.ID['coach-api-incident'],
            name: 'incident coach',
            method: 'GET',
            path: '/incidents/{incident}',
            script: incident,
            version: 1,
            shortDescription: 'Clocks and nudges of one open incident',
        },
        {
            $id: Now.ID['coach-api-act'],
            name: 'act on nudge',
            method: 'POST',
            path: '/incidents/{incident}/act',
            script: act,
            version: 1,
            shortDescription: 'Apply a nudge: reassign to the suggested group or link the known problem (needs write access to the incident)',
        },
        {
            $id: Now.ID['coach-api-dismiss'],
            name: 'dismiss nudge',
            method: 'POST',
            path: '/incidents/{incident}/dismiss',
            script: dismiss,
            version: 1,
            shortDescription: 'Stop showing a nudge for this incident',
        },
        {
            $id: Now.ID['coach-api-draft'],
            name: 'draft update',
            method: 'POST',
            path: '/incidents/{incident}/draft',
            script: draft,
            version: 1,
            shortDescription: 'Draft a customer update with the LuxLab Comms Drafter skill; nothing is posted',
        },
        {
            $id: Now.ID['coach-api-post'],
            name: 'post update',
            method: 'POST',
            path: '/incidents/{incident}/update',
            script: post,
            version: 1,
            shortDescription: 'Post the edited customer update as an additional comment',
        },
    ],
})
