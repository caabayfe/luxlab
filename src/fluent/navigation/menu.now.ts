import '@servicenow/sdk/global'
import { ApplicationMenu, Record } from '@servicenow/sdk/core'
import { luxlabUser } from '../security/roles.now'

export const luxlabMenu = ApplicationMenu({
    $id: Now.ID['luxlab-menu'],
    title: 'LuxLab',
    hint: 'Operations cockpit and Incident Replay',
    roles: [luxlabUser],
    active: true,
})

Record({
    $id: Now.ID['luxlab-module-cockpit'],
    table: 'sys_app_module',
    data: {
        title: 'Cockpit',
        application: luxlabMenu,
        link_type: 'DIRECT',
        query: 'x_everi_luxlab_cockpit.do?tab=overview',
        hint: 'Daily operations overview',
        roles: ['x_everi_luxlab.user'],
        active: true,
        order: 100,
    },
})

Record({
    $id: Now.ID['luxlab-module-replay'],
    table: 'sys_app_module',
    data: {
        title: 'Incident Replay',
        application: luxlabMenu,
        link_type: 'DIRECT',
        query: 'x_everi_luxlab_cockpit.do?tab=replay',
        hint: 'Rebuild and analyse major incident timelines',
        roles: ['x_everi_luxlab.user'],
        active: true,
        order: 200,
    },
})
