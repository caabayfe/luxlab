import { RESTAPIRequest, RESTAPIResponse } from '@servicenow/glide/sn_ws_int'
import { listCandidates } from '../replay/candidates.ts'
import { buildReplay, loadReplay, readableIncident } from '../replay/store.ts'

function firstParam(request: RESTAPIRequest, name: string): string {
    const raw = request.queryParams[name]
    // Query params arrive as arrays of strings
    return String((Array.isArray(raw) ? raw[0] : raw) || '').trim()
}

function notFound(response: RESTAPIResponse) {
    response.setStatus(404)
    response.setBody({ error: { message: 'Incident not found or not readable' } } as any)
}

export function candidates(request: RESTAPIRequest, response: RESTAPIResponse) {
    response.setBody({ candidates: listCandidates(firstParam(request, 'search')) } as any)
}

export function getReplay(request: RESTAPIRequest, response: RESTAPIResponse) {
    const incident = readableIncident(request.pathParams.incident)
    if (!incident) return notFound(response)
    response.setBody({ replay: loadReplay(incident) } as any)
}

export function rebuildReplay(request: RESTAPIRequest, response: RESTAPIResponse) {
    const incident = readableIncident(request.pathParams.incident)
    if (!incident) return notFound(response)
    buildReplay(incident)
    response.setBody({ replay: loadReplay(incident) } as any)
}
