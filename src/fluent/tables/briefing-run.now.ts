import '@servicenow/sdk/global'
import { ChoiceColumn, DateTimeColumn, Form, IntegerColumn, ReferenceColumn, StringColumn, Table, default_view } from '@servicenow/sdk/core'

// One row per AI agent run started from LuxLab (Daily Briefing tools and the Replay Analyst):
// links the user's run to the agent execution plan that answers it
export const x_everi_luxlab_briefing_run = Table({
    name: 'x_everi_luxlab_briefing_run',
    label: 'LuxLab Agent Run',
    display: 'tool',
    allowWebServiceAccess: true,
    schema: {
        tool: StringColumn({ label: 'Tool', maxLength: 40, mandatory: true }),
        user: ReferenceColumn({ label: 'User', referenceTable: 'sys_user', mandatory: true }),
        agent: StringColumn({ label: 'AI agent', maxLength: 32 }),
        incident: ReferenceColumn({ label: 'Incident', referenceTable: 'incident' }),
        state: ChoiceColumn({
            label: 'State',
            dropdown: 'dropdown_without_none',
            default: 'running',
            choices: {
                running: { label: 'Running' },
                completed: { label: 'Completed' },
                failed: { label: 'Failed' },
            },
        }),
        execution_plan: StringColumn({ label: 'Execution plan', maxLength: 32 }),
        conversation: StringColumn({ label: 'Conversation', maxLength: 32 }),
        plan_state: StringColumn({ label: 'Plan state', maxLength: 40 }),
        execution_ms: IntegerColumn({ label: 'Execution time (ms)' }),
        finished_on: DateTimeColumn({ label: 'Finished on' }),
        output: StringColumn({ label: 'Output', maxLength: 16000 }),
        error: StringColumn({ label: 'Error', maxLength: 1000 }),
    },
})

Form({
    table: 'x_everi_luxlab_briefing_run',
    view: default_view,
    sections: [
        {
            caption: 'Run',
            content: [
                {
                    layout: 'two-column',
                    leftElements: [
                        { field: 'tool', type: 'table_field' },
                        { field: 'user', type: 'table_field' },
                        { field: 'incident', type: 'table_field' },
                        { field: 'state', type: 'table_field' },
                        { field: 'finished_on', type: 'table_field' },
                    ],
                    rightElements: [
                        { field: 'agent', type: 'table_field' },
                        { field: 'execution_plan', type: 'table_field' },
                        { field: 'plan_state', type: 'table_field' },
                        { field: 'execution_ms', type: 'table_field' },
                    ],
                },
                {
                    layout: 'one-column',
                    elements: [
                        { field: 'output', type: 'table_field' },
                        { field: 'error', type: 'table_field' },
                        { field: 'conversation', type: 'table_field' },
                    ],
                },
            ],
        },
    ],
})
