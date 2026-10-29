import React, { useCallback, useEffect, useState } from 'react'
import { Alert } from '@servicenow/react-components/Alert'
import { Button } from '@servicenow/react-components/Button'
import { Input, InputEnterKeydown } from '@servicenow/react-components/Input'
import { Loader } from '@servicenow/react-components/Loader'
import { ReplayService } from '../../services/ReplayService'
import { ReplayCandidate } from '../../types'
import './Replay.css'

interface ReplayListProps {
    service: ReplayService
    onOpen: (incidentId: string, number: string) => void
}

export default function ReplayList({ service, onOpen }: ReplayListProps) {
    const [search, setSearch] = useState('')
    const [candidates, setCandidates] = useState<ReplayCandidate[] | null>(null)
    const [error, setError] = useState<string | null>(null)

    const load = useCallback(
        async (term: string) => {
            try {
                setError(null)
                setCandidates(null)
                setCandidates(await service.candidates(term))
            } catch (err) {
                setError('Could not load incidents: ' + (err.message || 'Unknown error'))
            }
        },
        [service]
    )

    useEffect(() => {
        void load('')
    }, [load])

    const handleSearch = useCallback<InputEnterKeydown>(
        (event) => {
            setSearch(event.detail.payload.fieldValue)
            void load(event.detail.payload.fieldValue)
        },
        [load]
    )

    return (
        <section className="lux-panel lux-replay-list" aria-label="Incidents to replay">
            <div className="lux-replay-list__head">
                <div>
                    <h2 className="lux-panel__title">Incident Replay</h2>
                    <p className="lux-panel__subtitle">Major incidents and P1/P2 incidents. Pick one to rebuild its timeline and see where the time went.</p>
                </div>
                <Input label="Search" placeholder="Number or description, then Enter" value={search} onEnterKeydown={handleSearch} />
            </div>

            {error && <Alert status="critical" content={error} />}
            {!candidates && !error && <Loader label="Loading incidents" />}
            {candidates && !candidates.length && <p className="lux-panel__subtitle">No matching incidents.</p>}

            {/* Candidates are DTOs from the replay API, joined with replay status */}
            <ul className="lux-replay-list__items">
                {candidates?.map((item) => (
                    <li key={item.sysId} className="lux-replay-list__item">
                        <span className={`lux-priority lux-priority--${item.priority}`}>P{item.priority}</span>
                        <div className="lux-replay-list__text">
                            <strong>{item.number}</strong> {item.shortDescription}
                            <div className="lux-replay-list__meta">
                                {item.majorState && <span className="lux-flag lux-flag--critical">Major: {item.majorState}</span>}
                                <span>{item.group || 'No group'}</span>
                                <span>Opened {item.openedAt}</span>
                                <span>{item.active ? 'Still open' : `Resolved ${item.resolvedAt || '-'}`}</span>
                                {item.replayStatus && <span>Replay built {item.replayBuiltOn}</span>}
                            </div>
                        </div>
                        <Button
                            label={item.replayStatus ? 'Open replay' : 'Replay'}
                            variant={item.replayStatus ? 'secondary' : 'primary'}
                            size="sm"
                            onClicked={() => onOpen(item.sysId, item.number)}
                        />
                    </li>
                ))}
            </ul>
        </section>
    )
}
