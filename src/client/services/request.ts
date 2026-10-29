// Shared fetch wrapper for the LuxLab scripted REST APIs
export async function request<T>(url: string, method: 'GET' | 'POST' = 'GET', body?: object): Promise<T> {
    const response = await fetch(url, {
        method,
        body: body ? JSON.stringify(body) : undefined,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-UserToken': window.g_ck,
        },
    })

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        // Platform errors use { error }, while errors set by our routes arrive wrapped in { result }
        throw new Error(errorData.error?.message || errorData.result?.error?.message || `HTTP error ${response.status}`)
    }

    const { result } = await response.json()
    return result as T
}
