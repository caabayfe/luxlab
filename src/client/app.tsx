import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { CockpitService } from './services/CockpitService'
import { pushTab, tabFromUrl } from './utils/navigation'
import { TabId } from './types'
import Header from './components/Header'
import OverviewView from './views/OverviewView'
import ReplayView from './views/ReplayView'
import BriefingView from './views/BriefingView'
import './app.css'

export default function App() {
    const [tab, setTab] = useState<TabId>(tabFromUrl)
    const service = useMemo(() => new CockpitService(), [])

    // Browser back/forward
    useEffect(() => {
        const onPopState = () => setTab(tabFromUrl())
        window.addEventListener('popstate', onPopState)
        return () => window.removeEventListener('popstate', onPopState)
    }, [])

    const selectTab = useCallback((next: TabId) => {
        pushTab(next)
        setTab(next)
    }, [])

    return (
        <div className="luxlab">
            <Header tab={tab} onSelectTab={selectTab} />
            <main className="luxlab__main">
                {tab === 'overview' && <OverviewView service={service} onOpenBriefing={() => selectTab('briefing')} />}
                {tab === 'replay' && <ReplayView />}
                {tab === 'briefing' && <BriefingView />}
            </main>
        </div>
    )
}
