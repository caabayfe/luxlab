// Shared fetch wrapper for the LuxLab scripted REST APIs
export async function request<T>(url: string, method: 'GET' | 'POST' = 'GET'): Promise<T> {
    const response = await fetch(url, {
        method,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
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
