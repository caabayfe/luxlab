import { AttentionPage, Overview } from '../types'

const BASE_URL = '/api/x_everi_luxlab/v1/cockpit'

async function request<T>(path: string, params?: URLSearchParams): Promise<T> {
    const url = params ? `${BASE_URL}${path}?${params}` : `${BASE_URL}${path}`
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'X-UserToken': window.g_ck,
        },
    })

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error?.message || `HTTP error ${response.status}`)
    }

    const { result } = await response.json()
    return result as T
}

export class CockpitService {
    overview() {
        return request<Overview>('/overview')
    }

    attention(page: number, pageSize: number) {
        return request<AttentionPage>('/attention', new URLSearchParams({ page: String(page), pageSize: String(pageSize) }))
    }
}
