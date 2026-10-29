import { TabId } from '../types'

export const TABS: { id: TabId; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'replay', label: 'Incident Replay' },
    { id: 'briefing', label: 'Daily Briefing' },
]

const TAB_IDS = TABS.map((tab) => tab.id)

export function tabFromUrl(): TabId {
    const tab = new URLSearchParams(window.location.search).get('tab') as TabId
    return TAB_IDS.includes(tab) ? tab : 'overview'
}

function titleFor(tab: TabId): string {
    const label = TABS.find((item) => item.id === tab)?.label || 'Overview'
    return `LuxLab - ${label}`
}

export function pushTab(tab: TabId) {
    const params = new URLSearchParams(window.location.search)
    params.set('tab', tab)
    const relativePath = `${window.location.pathname}?${params}`
    const title = titleFor(tab)

    // Inside the Next Experience shell the page runs in an iframe; keep the outer URL in sync
    if (window.self !== window.top) {
        window.CustomEvent.fireTop?.('magellanNavigator.permalink.set', { relativePath, title })
    }
    window.history.pushState({ tab }, '', relativePath)
    document.title = title
}

export function recordUrl(table: string, sysId: string): string {
    return `/${table}.do?sys_id=${sysId}`
}
