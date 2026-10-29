import { AttentionPage, Overview } from '../types'
import { request } from './request'

const BASE_URL = '/api/x_everi_luxlab/v1/cockpit'

export class CockpitService {
    overview() {
        return request<Overview>(`${BASE_URL}/overview`)
    }

    attention(page: number, pageSize: number) {
        const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) })
        return request<AttentionPage>(`${BASE_URL}/attention?${params}`)
    }
}
