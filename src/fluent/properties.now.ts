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


// The live coach's scheduled job posts breached clocks and routing or pattern hints as work notes on live P1/P2 incidents
Property({
    $id: Now.ID['coach-work-notes-property'],
    name: 'x_everi_luxlab.coach.work_notes',
    type: 'boolean',
    value: 'true',
    description: 'When true, the LuxLab live coach posts its nudges as work notes on live P1/P2 incidents (one per nudge).',
})
