import { RESTAPIRequest, RESTAPIResponse } from '@servicenow/glide/sn_ws_int'
import { getOverview } from '../cockpit/overview.ts'
import { getAttention } from '../cockpit/attention.ts'

function intParam(request: RESTAPIRequest, name: string, fallback: number, max: number): number {
    const raw = request.queryParams[name]
    // Query params arrive as arrays of strings
    const value = parseInt(Array.isArray(raw) ? raw[0] : raw, 10)
    return value > 0 ? Math.min(value, max) : fallback
}

export function overview(request: RESTAPIRequest, response: RESTAPIResponse) {
    response.setBody(getOverview() as any)
}

export function attention(request: RESTAPIRequest, response: RESTAPIResponse) {
    const page = intParam(request, 'page', 1, 1000)
    const pageSize = intParam(request, 'pageSize', 5, 50)
    response.setBody(getAttention(page, pageSize) as any)
}
