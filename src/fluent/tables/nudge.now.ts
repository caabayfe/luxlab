import '@servicenow/sdk/global'
import { BooleanColumn, ChoiceColumn, DateTimeColumn, ReferenceColumn, StringColumn, Table } from '@servicenow/sdk/core'

// What the live coach did about a nudge: posted it as a work note, or a user acted on or dismissed it.
// Nudges themselves are computed live; a row exists once something happened to one, keyed per incident and episode
export const x_everi_luxlab_nudge = Table({
    name: 'x_everi_luxlab_nudge',
    label: 'Coach Nudge',
    display: 'message',
    allowWebServiceAccess: true,
    schema: {
        incident: ReferenceColumn({ label: 'Incident', referenceTable: 'incident', mandatory: true }),
        // e.g. silence:<last activity>, routing:<from group>><to group>; a new episode gets a new key
        key: StringColumn({ label: 'Key', maxLength: 255, mandatory: true }),
        kind: ChoiceColumn({
            label: 'Kind',
            dropdown: 'dropdown_without_none',
            choices: {
                silence: { label: 'Silence' },
                comms: { label: 'Comms cadence' },
                routing: { label: 'Routing' },
                pattern: { label: 'Known pattern' },
                sla: { label: 'SLA' },
            },
        }),
        level: ChoiceColumn({
            label: 'Level',
            dropdown: 'dropdown_without_none',
            choices: { warn: { label: 'Warning' }, breach: { label: 'Breached' } },
        }),
        message: StringColumn({ label: 'Message', maxLength: 255 }),
        state: ChoiceColumn({
            label: 'State',
            dropdown: 'dropdown_without_none',
            default: 'open',
            choices: {
                open: { label: 'Open' },
                acted: { label: 'Acted on' },
                dismissed: { label: 'Dismissed' },
            },
        }),
        acted_by: ReferenceColumn({ label: 'Acted by', referenceTable: 'sys_user' }),
        acted_on: DateTimeColumn({ label: 'Acted on' }),
        work_note_posted: BooleanColumn({ label: 'Work note posted', default: false }),
    },
    index: [{ name: 'nudge_incident_key', unique: true, element: ['incident', 'key'] }],
})
