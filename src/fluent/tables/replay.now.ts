import '@servicenow/sdk/global'
import {
    BooleanColumn,
    ChoiceColumn,
    DateTimeColumn,
    IntegerColumn,
    JsonColumn,
    ReferenceColumn,
    StringColumn,
    Table,
} from '@servicenow/sdk/core'

// One row per replayed incident; rebuilt in place when the user refreshes the replay
export const x_everi_luxlab_replay = Table({
    name: 'x_everi_luxlab_replay',
    label: 'Incident Replay',
    display: 'incident',
    allowWebServiceAccess: true,
    schema: {
        incident: ReferenceColumn({ label: 'Incident', referenceTable: 'incident', mandatory: true, cascadeRule: 'delete' }),
        status: ChoiceColumn({
            label: 'Status',
            dropdown: 'dropdown_without_none',
            default: 'ready',
            choices: {
                ready: { label: 'Ready' },
                failed: { label: 'Failed' },
            },
        }),
        built_on: DateTimeColumn({ label: 'Built on' }),
        impact_start: DateTimeColumn({ label: 'Impact start' }),
        opened_at: DateTimeColumn({ label: 'Opened' }),
        resolved_at: DateTimeColumn({ label: 'Resolved' }),
        ongoing: BooleanColumn({ label: 'Still open', default: false }),
        minutes_to_resolve: IntegerColumn({ label: 'Minutes to resolve' }),
        reassignments: IntegerColumn({ label: 'Reassignments' }),
        silent_gaps: IntegerColumn({ label: 'Silent gaps' }),
        event_count: IntegerColumn({ label: 'Events' }),
        phases: JsonColumn({ label: 'Phase minutes' }),
        error: StringColumn({ label: 'Error', maxLength: 1000 }),
    },
    index: [{ name: 'replay_incident', unique: true, element: 'incident' }],
})
