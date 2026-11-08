import '@servicenow/sdk/global'
import { Property } from '@servicenow/sdk/core'

// Approved knowledge follow-ups become draft articles here (defaults to the IT knowledge base)
Property({
    $id: Now.ID['knowledge-base-property'],
    name: 'x_everi_luxlab.knowledge_base',
    type: 'string',
    value: 'a7e8a78bff0221009b20ffffffffff17',
    description: 'sys_id of the knowledge base where approved Replay AI knowledge follow-ups are created as draft articles.',
})

