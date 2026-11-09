import { GlideDateTime } from '@servicenow/glide'
import { RESTAPIRequest, RESTAPIResponse } from '@servicenow/glide/sn_ws_int'
import { actOnNudge, dismissNudge, draftUpdate, incidentCoach, liveIncidents, postUpdate } from '../coach/coach.ts'

function failed(response: RESTAPIResponse, status: number, e: any) {
    response.setStatus(status)
    response.setBody({ error: { message: (e && e.message) || String(e) } } as any)
}

function bodyOf(request: RESTAPIRequest): { [field: string]: any } {
    return (request.body && (request.body.data as any)) || {}
}

export function live(_request: RESTAPIRequest, response: RESTAPIResponse) {
    response.setBody(liveIncidents() as any)
}

// Null once the incident is resolved, so the Replay page hides the coach; now lets the page tick its clocks
export function incident(request: RESTAPIRequest, response: RESTAPIResponse) {
    response.setBody({ coach: incidentCoach(request.pathParams.incident), now: new GlideDateTime().getNumericValue() } as any)
}

// One handler per verb keeps each route's ACL and description explicit in the API definition
function nudgeAction(request: RESTAPIRequest, response: RESTAPIResponse, apply: (incidentId: string, key: string) => void) {
    const key = String(bodyOf(request).key || '')
    if (!key) return failed(response, 400, 'key is required')
    try {
        apply(request.pathParams.incident, key)
        response.setBody({ coach: incidentCoach(request.pathParams.incident) } as any)
    } catch (e) {
        failed(response, 400, e)
    }
}

export function act(request: RESTAPIRequest, response: RESTAPIResponse) {
    nudgeAction(request, response, actOnNudge)
}

export function dismiss(request: RESTAPIRequest, response: RESTAPIResponse) {
    nudgeAction(request, response, dismissNudge)
}

export function draft(request: RESTAPIRequest, response: RESTAPIResponse) {
    try {
        response.setBody({ draft: draftUpdate(request.pathParams.incident) } as any)
    } catch (e) {
        failed(response, 400, e)
    }
}

export function post(request: RESTAPIRequest, response: RESTAPIResponse) {
    const body = bodyOf(request)
    try {
        postUpdate(request.pathParams.incident, String(body.text || ''), String(body.key || ''))
        response.setBody({ coach: incidentCoach(request.pathParams.incident) } as any)
    } catch (e) {
        failed(response, 400, e)
    }
}
