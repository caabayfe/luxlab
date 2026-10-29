import { Replay, ReplayCandidate } from '../types'
import { request } from './request'

const BASE_URL = '/api/x_everi_luxlab/v1/replay'

export class ReplayService {
    async candidates(search: string) {
        const params = new URLSearchParams({ search })
        const { candidates } = await request<{ candidates: ReplayCandidate[] }>(`${BASE_URL}/candidates?${params}`)
        return candidates
    }

    async get(incidentId: string) {
        const { replay } = await request<{ replay: Replay | null }>(`${BASE_URL}/${incidentId}`)
        return replay
    }

    async build(incidentId: string) {
        const { replay } = await request<{ replay: Replay }>(`${BASE_URL}/${incidentId}/build`, 'POST')
        return replay
    }

    async review(incidentId: string) {
        const { replay } = await request<{ replay: Replay }>(`${BASE_URL}/${incidentId}/review`, 'POST')
        return replay
    }

    async suggestFollowUps(incidentId: string) {
        const { replay } = await request<{ replay: Replay }>(`${BASE_URL}/${incidentId}/follow-ups`, 'POST')
        return replay
    }

    async decide(incidentId: string, actionId: string, decision: 'approve' | 'dismiss') {
        const { replay } = await request<{ replay: Replay }>(`${BASE_URL}/${incidentId}/follow-ups/${actionId}`, 'POST', { decision })
        return replay
    }
}
