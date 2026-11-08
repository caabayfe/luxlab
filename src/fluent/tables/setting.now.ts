import '@servicenow/sdk/global'
import { StringColumn, Table } from '@servicenow/sdk/core'

// Values set from the LuxLab pages (e.g. assist rates). Rows are app data, so installs and upgrades never reset them,
// unlike system properties shipped with the app
export const x_everi_luxlab_setting = Table({
    name: 'x_everi_luxlab_setting',
    label: 'LuxLab Setting',
    display: 'name',
    schema: {
        name: StringColumn({ label: 'Name', maxLength: 100, mandatory: true }),
        value: StringColumn({ label: 'Value', maxLength: 1000 }),
    },
    index: [{ name: 'setting_name', unique: true, element: 'name' }],
})
