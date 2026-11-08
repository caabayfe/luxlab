import { RESTAPIRequest, RESTAPIResponse } from '@servicenow/glide/sn_ws_int'
import { usage } from '../usage/usage.ts'

const PERIODS = [7, 30, 90]

export function getUsage(request: RESTAPIRequest, response: RESTAPIResponse) {
    const raw = request.queryParams.days
    const days = parseInt(String((Array.isArray(raw) ? raw[0] : raw) || '30'), 10)
    response.setBody({ usage: usage(PERIODS.indexOf(days) >= 0 ? days : 30) } as any)
}
