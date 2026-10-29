// Verifies ServiceNow Otto for App Engine (primeSKU) is available before creating skills
import { Connector } from '@servicenow/sdk-api'

export default async ({ credential }) => {
    const connector = new Connector(credential)
    const response = await connector.fetch(
        '/api/sn_build_agent/build_agent_api/isProductAvailable',
        { method: 'GET' },
        new URLSearchParams({ productId: 'primeSKU', scopeName: '' })
    )
    const body = await response.json()
    const available = body.result?.isAvailable === true
    console.log(JSON.stringify({ available }))
    if (!available) {
        console.error('ServiceNow Otto for App Engine is not available on this instance.')
    }
}
