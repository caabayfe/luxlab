import { RESTAPIRequest, RESTAPIResponse } from '@servicenow/glide/sn_ws_int'
import { minePatterns, patternsDto, replayBatch } from '../replay/patterns.ts'
import { decidePattern, startProposal } from '../replay/pattern-ai.ts'
import { canDecide } from '../replay/follow-ups.ts'

function failed(response: RESTAPIResponse, status: number, e: any) {
    response.setStatus(status)
    response.setBody({ error: { message: (e && e.message) || String(e) } } as any)
}

export function patterns(_request: RESTAPIRequest, response: RESTAPIResponse) {
    response.setBody(patternsDto() as any)
}

// One batch of missing replays per call; once none are left the patterns are mined and returned
export function refresh(_request: RESTAPIRequest, response: RESTAPIResponse) {
    try {
        const coverage = replayBatch()
        if (coverage.pending > 0) return response.setBody({ coverage } as any)
        minePatterns()
        response.setBody(patternsDto() as any)
    } catch (e) {
        failed(response, 500, e)
    }
}

// Starts the Pattern Analyst agent; the client follows its steps through the briefing runs endpoint
export function propose(request: RESTAPIRequest, response: RESTAPIResponse) {
    try {
        response.setBody({ run: startProposal(request.pathParams.pattern) } as any)
    } catch (e) {
        failed(response, 400, e)
    }
}

export function decide(request: RESTAPIRequest, response: RESTAPIResponse) {
    if (!canDecide()) return failed(response, 403, 'Only LuxLab managers can decide on response patterns')
    const decision = String((request.body.data as any)?.decision || '')
    if (decision !== 'accept' && decision !== 'dismiss') return failed(response, 400, 'decision must be accept or dismiss')
    try {
        response.setBody({ pattern: decidePattern(request.pathParams.pattern, decision === 'accept') } as any)
    } catch (e) {
        failed(response, 400, e)
    }
}
