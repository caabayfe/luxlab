import '@servicenow/sdk/global'
import { Form, default_view } from '@servicenow/sdk/core'

Form({
    table: 'x_everi_luxlab_replay',
    view: default_view,
    sections: [
        {
            caption: 'Replay',
            content: [
                {
                    layout: 'two-column',
                    leftElements: [
                        { field: 'incident', type: 'table_field' },
                        { field: 'status', type: 'table_field' },
                        { field: 'built_on', type: 'table_field' },
                        { field: 'ongoing', type: 'table_field' },
                    ],
                    rightElements: [
                        { field: 'impact_start', type: 'table_field' },
                        { field: 'opened_at', type: 'table_field' },
                        { field: 'resolved_at', type: 'table_field' },
                        { field: 'minutes_to_resolve', type: 'table_field' },
                    ],
                },
            ],
        },
        {
            caption: 'Analysis',
            content: [
                {
                    layout: 'two-column',
                    leftElements: [
                        { field: 'reassignments', type: 'table_field' },
                        { field: 'handoffs', type: 'table_field' },
                        { field: 'silent_gaps', type: 'table_field' },
                    ],
                    rightElements: [{ field: 'event_count', type: 'table_field' }],
                },
                {
                    layout: 'one-column',
                    elements: [
                        { field: 'phases', type: 'table_field' },
                        { field: 'error', type: 'table_field' },
                    ],
                },
            ],
        },
        {
            caption: 'Replay AI',
            content: [
                {
                    layout: 'two-column',
                    leftElements: [{ field: 'reviewed_on', type: 'table_field' }],
                    rightElements: [{ field: 'follow_ups_on', type: 'table_field' }],
                },
                { layout: 'one-column', elements: [{ field: 'review', type: 'table_field' }] },
            ],
        },
        {
            caption: 'Post incident review',
            content: [
                {
                    layout: 'two-column',
                    leftElements: [
                        { field: 'pir_id', type: 'table_field' },
                        { field: 'pir_pushed_on', type: 'table_field' },
                    ],
                    rightElements: [{ field: 'pir_pushed_count', type: 'table_field' }],
                },
            ],
        },
    ],
})

Form({
    table: 'x_everi_luxlab_replay_event',
    view: default_view,
    sections: [
        {
            caption: 'Event',
            content: [
                {
                    layout: 'two-column',
                    leftElements: [
                        { field: 'replay', type: 'table_field' },
                        { field: 'occurred_at', type: 'table_field' },
                        { field: 'sequence', type: 'table_field' },
                        { field: 'key_moment', type: 'table_field' },
                        { field: 'event_key', type: 'table_field' },
                    ],
                    rightElements: [
                        { field: 'source', type: 'table_field' },
                        { field: 'kind', type: 'table_field' },
                        { field: 'phase', type: 'table_field' },
                        { field: 'actor', type: 'table_field' },
                        { field: 'hidden', type: 'table_field' },
                        { field: 'pir_flagged', type: 'table_field' },
                    ],
                },
                {
                    layout: 'one-column',
                    elements: [
                        { field: 'summary', type: 'table_field' },
                        { field: 'from_value', type: 'table_field' },
                        { field: 'to_value', type: 'table_field' },
                        { field: 'detail', type: 'table_field' },
                    ],
                },
            ],
        },
    ],
})

Form({
    table: 'x_everi_luxlab_replay_action',
    view: default_view,
    sections: [
        {
            caption: 'Follow-up',
            content: [
                {
                    layout: 'two-column',
                    leftElements: [
                        { field: 'replay', type: 'table_field' },
                        { field: 'incident', type: 'table_field' },
                        { field: 'type', type: 'table_field' },
                        { field: 'state', type: 'table_field' },
                    ],
                    rightElements: [
                        { field: 'decided_by', type: 'table_field' },
                        { field: 'decided_on', type: 'table_field' },
                        { field: 'problem', type: 'table_field' },
                        { field: 'knowledge', type: 'table_field' },
                    ],
                },
                {
                    layout: 'one-column',
                    elements: [
                        { field: 'title', type: 'table_field' },
                        { field: 'description', type: 'table_field' },
                        { field: 'rationale', type: 'table_field' },
                        { field: 'article', type: 'table_field' },
                    ],
                },
            ],
        },
    ],
})
