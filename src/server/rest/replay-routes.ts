import { RESTAPIRequest, RESTAPIResponse } from '@servicenow/glide/sn_ws_int'
import { listCandidates } from '../replay/candidates.ts'
import { buildReplay, loadReplay, readableIncident } from '../replay/store.ts'
import { decideFollowUp, suggestFollowUps, writeReview } from '../replay/ai.ts'
import { canDecide } from '../replay/follow-ups.ts'
import { AnalysisKind, startAnalysis } from '../replay/analyst.ts'

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

function failed(response: RESTAPIResponse, status: number, e: any) {
    response.setStatus(status)
    response.setBody({ error: { message: (e && e.message) || String(e) } } as any)
}

// Skills can fail for reasons the user can act on (not published, quota), so the message is passed through
function withIncident(request: RESTAPIRequest, response: RESTAPIResponse, action: (incident: any) => void) {
    const incident = readableIncident(request.pathParams.incident)
    if (!incident) return notFound(response)
    try {
        action(incident)
    } catch (e) {
        return failed(response, 500, e)
    }
    response.setBody({ replay: loadReplay(incident) } as any)
}

export function reviewReplay(request: RESTAPIRequest, response: RESTAPIResponse) {
    withIncident(request, response, writeReview)
}

export function followUpReplay(request: RESTAPIRequest, response: RESTAPIResponse) {
    withIncident(request, response, suggestFollowUps)
}

export function decide(request: RESTAPIRequest, response: RESTAPIResponse) {
    if (!canDecide()) return failed(response, 403, 'Only LuxLab managers can decide on follow-ups')
    const decision = String((request.body.data as any)?.decision || '')
    if (decision !== 'approve' && decision !== 'dismiss') return failed(response, 400, 'decision must be approve or dismiss')
    const incident = readableIncident(request.pathParams.incident)
    if (!incident) return notFound(response)
    try {
        decideFollowUp(request.pathParams.action, decision === 'approve')
    } catch (e) {
        return failed(response, 400, e)
    }
    response.setBody({ replay: loadReplay(incident) } as any)
}

// Starts the Replay Analyst agent; the client follows its steps through the briefing runs endpoint
export function analyse(request: RESTAPIRequest, response: RESTAPIResponse) {
    const kind = request.pathParams.kind as AnalysisKind
    if (kind !== 'review' && kind !== 'follow-ups') return failed(response, 400, 'kind must be review or follow-ups')
    const incident = readableIncident(request.pathParams.incident)
    if (!incident) return notFound(response)
    try {
        response.setBody({ run: startAnalysis(incident, kind) } as any)
    } catch (e) {
        failed(response, 500, e)
    }
}
