import { RESTAPIRequest, RESTAPIResponse } from '@servicenow/glide/sn_ws_int'
import { setRates, usage } from '../usage/usage.ts'
import { canDecide } from '../replay/follow-ups.ts'

const PERIODS = [7, 30, 90]

function failed(response: RESTAPIResponse, status: number, e: any) {
    response.setStatus(status)
    response.setBody({ error: { message: (e && e.message) || String(e) } } as any)
}

export function getUsage(request: RESTAPIRequest, response: RESTAPIResponse) {
    const raw = request.queryParams.days
    const days = parseInt(String((Array.isArray(raw) ? raw[0] : raw) || '30'), 10)
    response.setBody({ usage: usage(PERIODS.indexOf(days) >= 0 ? days : 30) } as any)
}

export function postRates(request: RESTAPIRequest, response: RESTAPIResponse) {
    if (!canDecide()) return failed(response, 403, 'Only LuxLab managers can set the assist rates')
    const body = (request.body.data as any) || {}
    try {
        setRates(Number(body.agent), Number(body.skill))
    } catch (e) {
        return failed(response, 400, e)
    }
    response.setBody({ usage: usage(30) } as any)
}
