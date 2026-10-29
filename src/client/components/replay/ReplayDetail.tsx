import React, { useCallback, useEffect, useState } from 'react'
import { Alert } from '@servicenow/react-components/Alert'
import { Button } from '@servicenow/react-components/Button'
import { Loader } from '@servicenow/react-components/Loader'
import { ReplayService } from '../../services/ReplayService'
import { Replay } from '../../types'
import { formatMinutes, formatTime } from '../../utils/format'
import { recordUrl } from '../../utils/navigation'
import PhaseBar from './PhaseBar'
import Timeline from './Timeline'
import './Replay.css'

interface ReplayDetailProps {
    service: ReplayService
    incidentId: string
    onBack: () => void
}

function Stat({ label, value }: { label: string; value: string | number }) {
    return (
        <div className="lux-replay__stat">
            <span className="lux-replay__stat-value">{value}</span>
            <span className="lux-replay__stat-label">{label}</span>
        </div>
    )
}

export default function ReplayDetail({ service, incidentId, onBack }: ReplayDetailProps) {
    const [replay, setReplay] = useState<Replay | null>(null)
    const [busy, setBusy] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const run = useCallback(async (action: () => Promise<Replay | null>) => {
        try {
            setBusy(true)
            setError(null)
            setReplay(await action())
        } catch (err) {
            setError('Could not load the replay: ' + (err.message || 'Unknown error'))
        } finally {
            setBusy(false)
        }
    }, [])

    const rebuild = useCallback(() => run(() => service.build(incidentId)), [run, service, incidentId])

    // Open the stored replay, or build it the first time
    useEffect(() => {
        void run(async () => (await service.get(incidentId)) || service.build(incidentId))
    }, [run, service, incidentId])

    if (busy && !replay) return <Loader label="Rebuilding the incident timeline" />

    return (
        <div className="lux-replay">
            <div className="lux-replay__toolbar">
                <Button label="All incidents" variant="tertiary" icon="arrow-left-outline" onClicked={onBack} />
                <Button label={busy ? 'Rebuilding…' : 'Rebuild replay'} variant="secondary" disabled={busy} onClicked={rebuild} />
            </div>
            {error && <Alert status="critical" content={error} />}
            {replay?.status === 'failed' && <Alert status="critical" header="Replay failed" content={replay.error} />}
            {replay && (
                <>
                    <section className="lux-panel lux-replay__header">
                        <div className="lux-replay__title">
                            <span className={`lux-priority lux-priority--${replay.incident.priority}`}>P{replay.incident.priority}</span>
                            <a href={recordUrl('incident', replay.incident.sysId)} target="_top">{replay.incident.number}</a>
                            <span>{replay.incident.shortDescription}</span>
                        </div>
                        <p className="lux-panel__subtitle">
                            {replay.incident.majorState && `Major incident (${replay.incident.majorState}) · `}
                            Impact from {formatTime(replay.impactStart)} · built {formatTime(replay.builtOn)}
                        </p>
                        <div className="lux-replay__stats">
                            <Stat label={replay.ongoing ? 'Open for' : 'Time to resolve'} value={formatMinutes(replay.minutesToResolve)} />
                            <Stat label="Group reassignments" value={replay.reassignments} />
                            <Stat label="Engineer handoffs" value={replay.handoffs} />
                            <Stat label="Silent gaps" value={replay.silentGaps} />
                            <Stat label="Events" value={replay.events.length} />
                        </div>
                        <PhaseBar replay={replay} />
                    </section>
                    <Timeline events={replay.events} origin={replay.impactStart} />
                </>
            )}
        </div>
    )
}
