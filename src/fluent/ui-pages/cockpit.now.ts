import '@servicenow/sdk/global'
import { UiPage } from '@servicenow/sdk/core'
import cockpitPage from '../../client/index.html'

export const cockpitUiPage = UiPage({
    $id: Now.ID['cockpit-page'],
    endpoint: 'x_everi_luxlab_cockpit.do',
    description: 'LuxLab operations cockpit and Incident Replay',
    category: 'general',
    html: cockpitPage,
    direct: true,
})
