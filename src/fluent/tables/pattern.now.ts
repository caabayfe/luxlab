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

// Where the response keeps losing time across replayed incidents; mined from replays, upserted by key
export const x_everi_luxlab_pattern = Table({
    name: 'x_everi_luxlab_pattern',
    label: 'Response Pattern',
    display: 'title',
    allowWebServiceAccess: true,
    schema: {
        key: StringColumn({ label: 'Key', maxLength: 255, mandatory: true }),
        type: ChoiceColumn({
            label: 'Type',
            dropdown: 'dropdown_without_none',
            choices: {
                misroute: { label: 'Misrouting' },
                gaps: { label: 'Silent gaps' },
                detection: { label: 'Late detection' },
                waiting: { label: 'Waiting' },
            },
        }),
        title: StringColumn({ label: 'Title', maxLength: 255 }),
        group: StringColumn({ label: 'Group', maxLength: 100 }),
        target: StringColumn({ label: 'Resolving group', maxLength: 100 }),
        dimension: StringColumn({ label: 'Service or category', maxLength: 255 }),
        incident_count: IntegerColumn({ label: 'Incidents' }),
        minutes_lost: IntegerColumn({ label: 'Minutes lost' }),
        median_minutes: IntegerColumn({ label: 'Median minutes per incident' }),
        median_ttr: IntegerColumn({ label: 'Median minutes to resolve' }),
        baseline_ttr: IntegerColumn({ label: 'Median minutes to resolve, other incidents' }),
        // Every incident of the pattern, so a replay can show the patterns it belongs to
        incidents: JsonColumn({ label: 'Evidence', maxLength: 65000 }),
        facets: JsonColumn({ label: 'Facets', maxLength: 4000 }),
        // False when the latest mining no longer finds the pattern
        active: BooleanColumn({ label: 'Active', default: true }),
        first_seen: DateTimeColumn({ label: 'First seen' }),
        mined_on: DateTimeColumn({ label: 'Mined on' }),
        state: ChoiceColumn({
            label: 'State',
            dropdown: 'dropdown_without_none',
            default: 'new',
            choices: {
                new: { label: 'New' },
                proposed: { label: 'Fix proposed' },
                accepted: { label: 'Fix accepted' },
                dismissed: { label: 'Dismissed' },
            },
        }),
        proposal: StringColumn({ label: 'Proposed fix', maxLength: 16000 }),
        fix_type: ChoiceColumn({
            label: 'Fix type',
            dropdown: 'dropdown_with_none',
            choices: {
                routing: { label: 'Routing' },
                knowledge: { label: 'Knowledge' },
                monitoring: { label: 'Monitoring' },
                process: { label: 'Process' },
                problem: { label: 'Problem' },
            },
        }),
        proposed_on: DateTimeColumn({ label: 'Fix proposed on' }),
        decided_by: ReferenceColumn({ label: 'Decided by', referenceTable: 'sys_user' }),
        decided_on: DateTimeColumn({ label: 'Decided on' }),
        problem: ReferenceColumn({ label: 'Problem', referenceTable: 'problem' }),
    },
    index: [{ name: 'pattern_key', unique: true, element: 'key' }],
})
