import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { CockpitService } from './services/CockpitService'
import { ReplayService } from './services/ReplayService'
import { pushRoute, routeFromUrl } from './utils/navigation'
import { Route, TabId } from './types'
import Header from './components/Header'
import OverviewView from './views/OverviewView'
import ReplayView from './views/ReplayView'
import BriefingView from './views/BriefingView'
import './app.css'

export default function App() {
    const [route, setRoute] = useState<Route>(routeFromUrl)
    const cockpit = useMemo(() => new CockpitService(), [])
    const replays = useMemo(() => new ReplayService(), [])

    // Browser back/forward
    useEffect(() => {
        const onPopState = () => setRoute(routeFromUrl())
        window.addEventListener('popstate', onPopState)
        return () => window.removeEventListener('popstate', onPopState)
    }, [])

    const navigate = useCallback((next: Route, label?: string) => {
        pushRoute(next, label)
        setRoute(next)
    }, [])

    const selectTab = useCallback((tab: TabId) => navigate({ tab, incident: null }), [navigate])

    return (
        <div className="luxlab">
            <Header tab={route.tab} onSelectTab={selectTab} />
            <main className="luxlab__main">
                {route.tab === 'overview' && <OverviewView service={cockpit} onOpenBriefing={() => selectTab('briefing')} />}
                {route.tab === 'replay' && (
                    <ReplayView
                        service={replays}
                        incidentId={route.incident}
                        onOpen={(incident, number) => navigate({ tab: 'replay', incident }, `Replay ${number}`)}
                        onBack={() => selectTab('replay')}
                    />
                )}
                {route.tab === 'briefing' && <BriefingView />}
            </main>
        </div>
    )
}
