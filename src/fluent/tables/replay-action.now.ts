import '@servicenow/sdk/global'
import { ChoiceColumn, DateTimeColumn, ReferenceColumn, StringColumn, Table } from '@servicenow/sdk/core'

// Follow-ups proposed by the LuxLab Follow-up Advisor skill; a LuxLab manager approves or dismisses each one
export const x_everi_luxlab_replay_action = Table({
    name: 'x_everi_luxlab_replay_action',
    label: 'Incident Replay Follow-up',
    display: 'title',
    allowWebServiceAccess: true,
    schema: {
        replay: ReferenceColumn({ label: 'Replay', referenceTable: 'x_everi_luxlab_replay', mandatory: true, cascadeRule: 'delete' }),
        incident: ReferenceColumn({ label: 'Incident', referenceTable: 'incident' }),
        type: ChoiceColumn({
            label: 'Type',
            dropdown: 'dropdown_without_none',
            default: 'action',
            choices: {
                problem: { label: 'Problem record' },
                knowledge: { label: 'Knowledge article' },
                action: { label: 'Improvement action' },
            },
        }),
        title: StringColumn({ label: 'Title', maxLength: 160 }),
        description: StringColumn({ label: 'Description', maxLength: 4000 }),
        rationale: StringColumn({ label: 'Why', maxLength: 1000 }),
        state: ChoiceColumn({
            label: 'State',
            dropdown: 'dropdown_without_none',
            default: 'proposed',
            choices: {
                proposed: { label: 'Proposed' },
                approved: { label: 'Approved' },
                dismissed: { label: 'Dismissed' },
            },
        }),
        decided_by: ReferenceColumn({ label: 'Decided by', referenceTable: 'sys_user' }),
        decided_on: DateTimeColumn({ label: 'Decided on' }),
        problem: ReferenceColumn({ label: 'Problem', referenceTable: 'problem' }),
    },
})
