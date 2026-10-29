import { BriefingRun, BriefingTool } from '../types'
import { request } from './request'

const BASE_URL = '/api/x_everi_luxlab/v1/briefing'

export class BriefingService {
    async tools() {
        const { tools } = await request<{ tools: BriefingTool[] }>(`${BASE_URL}/tools`)
        return tools
    }

    async run(toolId: string) {
        const { run } = await request<{ run: BriefingRun }>(`${BASE_URL}/tools/${toolId}/run`, 'POST')
        return run
    }

    async trace(runId: string) {
        const { run } = await request<{ run: BriefingRun }>(`${BASE_URL}/runs/${runId}`)
        return run
    }
}
