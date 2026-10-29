import { RESTAPIRequest, RESTAPIResponse } from '@servicenow/glide/sn_ws_int'
import { listTools, runTool, traceOf } from '../briefing/agents.ts'

function failed(response: RESTAPIResponse, status: number, e: any) {
    response.setStatus(status)
    response.setBody({ error: { message: (e && e.message) || String(e) } } as any)
}

export function tools(_request: RESTAPIRequest, response: RESTAPIResponse) {
    response.setBody({ tools: listTools() } as any)
}

export function run(request: RESTAPIRequest, response: RESTAPIResponse) {
    try {
        response.setBody({ run: runTool(request.pathParams.tool) } as any)
    } catch (e) {
        failed(response, 400, e)
    }
}

export function trace(request: RESTAPIRequest, response: RESTAPIResponse) {
    const found = traceOf(request.pathParams.run)
    if (!found) return failed(response, 404, 'Briefing run not found')
    response.setBody({ run: found } as any)
}
