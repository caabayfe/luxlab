import { Route, TabId } from '../types'

export const TABS: { id: TabId; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'replay', label: 'Incident Replay' },
    { id: 'briefing', label: 'Daily Briefing' },
]

const TAB_IDS = TABS.map((tab) => tab.id)

export function routeFromUrl(): Route {
    const params = new URLSearchParams(window.location.search)
    const tab = params.get('tab') as TabId
    return {
        tab: TAB_IDS.includes(tab) ? tab : 'overview',
        incident: params.get('incident') || null,
    }
}

function titleFor(route: Route, label?: string): string {
    const tabLabel = TABS.find((item) => item.id === route.tab)?.label || 'Overview'
    return label ? `LuxLab - ${label}` : `LuxLab - ${tabLabel}`
}

export function pushRoute(route: Route, label?: string) {
    const params = new URLSearchParams({ tab: route.tab })
    if (route.incident) params.set('incident', route.incident)
    const relativePath = `${window.location.pathname}?${params}`
    const title = titleFor(route, label)

    // Inside the Next Experience shell the page runs in an iframe; keep the outer URL in sync
    if (window.self !== window.top) {
        window.CustomEvent.fireTop?.('magellanNavigator.permalink.set', { relativePath, title })
    }
    window.history.pushState(route, '', relativePath)
    document.title = title
}

export function recordUrl(table: string, sysId: string): string {
    return `/${table}.do?sys_id=${sysId}`
}
