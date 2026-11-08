import '@servicenow/sdk/global'
import {
    BooleanColumn,
    ChoiceColumn,
    DateTimeColumn,
    IntegerColumn,
    ReferenceColumn,
    StringColumn,
    Table,
} from '@servicenow/sdk/core'

// Phase names are shared with src/server/replay/types.ts
export const x_everi_luxlab_replay_event = Table({
    name: 'x_everi_luxlab_replay_event',
    label: 'Incident Replay Event',
    display: 'summary',
    allowWebServiceAccess: true,
    schema: {
        replay: ReferenceColumn({ label: 'Replay', referenceTable: 'x_everi_luxlab_replay', mandatory: true, cascadeRule: 'delete' }),
        sequence: IntegerColumn({ label: 'Sequence' }),
        // Derived from the source row (e.g. audit:<sys_id>), so it survives rebuilds and matches PIR timeline events
        event_key: StringColumn({ label: 'Event key', maxLength: 120 }),
        occurred_at: DateTimeColumn({ label: 'Occurred at' }),
        source: ChoiceColumn({
            label: 'Source',
            dropdown: 'dropdown_without_none',
            choices: {
                record: { label: 'Incident record' },
                audit: { label: 'Field change' },
                journal: { label: 'Journal' },
                sla: { label: 'SLA' },
                task: { label: 'Incident task' },
                child: { label: 'Child incident' },
                alert: { label: 'Alert' },
                comms: { label: 'Communication' },
                analysis: { label: 'Analysis' },
                pir: { label: 'Post incident review' },
            },
        }),
        kind: StringColumn({ label: 'Kind', maxLength: 40 }),
        phase: ChoiceColumn({
            label: 'Phase',
            dropdown: 'dropdown_with_none',
            choices: {
                detection: { label: 'Detection' },
                triage: { label: 'Triage' },
                misrouted: { label: 'Misrouted' },
                waiting: { label: 'Waiting' },
                fixing: { label: 'Fixing' },
                recovery: { label: 'Recovery' },
            },
        }),
        actor: StringColumn({ label: 'Actor', maxLength: 100 }),
        summary: StringColumn({ label: 'Summary', maxLength: 500 }),
        from_value: StringColumn({ label: 'From', maxLength: 255 }),
        to_value: StringColumn({ label: 'To', maxLength: 255 }),
        detail: StringColumn({ label: 'Detail', maxLength: 4000 }),
        key_moment: BooleanColumn({ label: 'Key moment', default: false }),
        hidden: BooleanColumn({ label: 'Hidden in PIR', default: false }),
        pir_flagged: BooleanColumn({ label: 'Flagged in PIR', default: false }),
    },
    index: [{ name: 'replay_event_replay', unique: false, element: 'replay' }],
})
