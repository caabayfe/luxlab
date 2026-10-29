import React, { useCallback, useEffect, useState } from 'react'
import { Alert } from '@servicenow/react-components/Alert'
import { Button } from '@servicenow/react-components/Button'
import { Loader } from '@servicenow/react-components/Loader'
import { CockpitService } from '../services/CockpitService'
import { AttentionPage, Overview } from '../types'
import KpiTiles from '../components/KpiTiles'
import AttentionList from '../components/AttentionList'
import BriefingTools from '../components/BriefingTools'
import './OverviewView.css'

const PAGE_SIZE = 5

interface OverviewViewProps {
    service: CockpitService
    onOpenBriefing: () => void
}

export default function OverviewView({ service, onOpenBriefing }: OverviewViewProps) {
    const [overview, setOverview] = useState<Overview | null>(null)
    const [attention, setAttention] = useState<AttentionPage | null>(null)
    const [error, setError] = useState<string | null>(null)

    const load = useCallback(
        async (page = 1) => {
            try {
                setError(null)
                const [kpis, ranked] = await Promise.all([service.overview(), service.attention(page, PAGE_SIZE)])
                setOverview(kpis)
                setAttention(ranked)
            } catch (err) {
                setError('Could not load the cockpit: ' + (err.message || 'Unknown error'))
            }
        },
        [service]
    )

    const changePage = useCallback(
        async (page: number) => {
            try {
                setAttention(await service.attention(page, PAGE_SIZE))
            } catch (err) {
                setError('Could not load tickets: ' + (err.message || 'Unknown error'))
            }
        },
        [service]
    )

    useEffect(() => {
        void load()
    }, [load])

    if (error) return <Alert status="critical" header="Something went wrong" content={error} />
    if (!overview || !attention) return <Loader label="Loading your cockpit" />

    return (
        <div className="lux-overview">
            <div className="lux-overview__meta">
                <span>Real-time overview of your service desk activity</span>
                <span className="lux-overview__updated">
                    Updated {overview.generatedAt}
                    <Button label="Refresh" size="sm" variant="tertiary" icon="sync-outline" onClicked={() => load(attention.page)} />
                </span>
            </div>
            <KpiTiles overview={overview} />
            <div className="lux-overview__columns">
                <AttentionList data={attention} onPage={changePage} />
                <BriefingTools onOpen={onOpenBriefing} />
            </div>
        </div>
    )
}
