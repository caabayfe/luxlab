import React, { useCallback, useMemo, useState } from 'react'
import { Alert } from '@servicenow/react-components/Alert'
import { Button } from '@servicenow/react-components/Button'
import Markdown from '../Markdown'
import AgentRun from '../briefing/AgentRun'
import { BriefingService } from '../../services/BriefingService'
import { ReplayService } from '../../services/ReplayService'
import { BriefingRun, FollowUpType, Replay, ReplayFollowUp } from '../../types'
import { formatTime } from '../../utils/format'
import { recordUrl } from '../../utils/navigation'

interface ReplayAIProps {
    service: ReplayService
    replay: Replay
    onChange: (replay: Replay) => void
}

const FOLLOW_UP_LABELS: { [type in FollowUpType]: string } = {
    problem: 'Problem',
    knowledge: 'Knowledge',
    action: 'Action',
}

const APPROVE_LABELS: { [type in FollowUpType]: string } = {
    problem: 'Approve and raise problem',
    knowledge: 'Approve and draft article',
    action: 'Approve',
}

type AnalysisKind = 'review' | 'follow-ups'

function FollowUpItem({ followUp, canDecide, busy, onDecide }: {
    followUp: ReplayFollowUp
    canDecide: boolean
    busy: boolean
    onDecide: (followUp: ReplayFollowUp, decision: 'approve' | 'dismiss') => void
}) {
    const approved = followUp.state === 'approved'
    return (
        <li className={`lux-ai__follow-up${approved ? ' lux-ai__follow-up--approved' : ''}`}>
            <div className="lux-ai__follow-up-head">
                <span className={`lux-ai__type lux-ai__type--${followUp.type}`}>{FOLLOW_UP_LABELS[followUp.type]}</span>
                <strong>{followUp.title}</strong>
            </div>
            {followUp.description && <p>{followUp.description}</p>}
            {followUp.rationale && <p className="lux-ai__rationale">Why: {followUp.rationale}</p>}
            {followUp.article && !followUp.knowledge && (
                <details className="lux-ai__article">
                    <summary>Draft article{approved ? '' : ', created in draft when approved'}</summary>
                    <Markdown text={followUp.article} />
                </details>
            )}
            {approved ? (
                <p className="lux-ai__decision">
                    Approved by {followUp.decidedBy} · {formatTime(followUp.decidedOn)}
                    {followUp.problem && (
                        <>
                            {' · '}
                            <a href={recordUrl('problem', followUp.problem.sysId)} target="_top">
                                {followUp.problem.number}
                            </a>
                        </>
                    )}
                    {followUp.knowledge && (
                        <>
                            {' · draft article '}
                            <a href={recordUrl('kb_knowledge', followUp.knowledge.sysId)} target="_top">
                                {followUp.knowledge.number}
                            </a>
                        </>
                    )}
                </p>
            ) : (
                canDecide && (
                    <div className="lux-ai__actions">
                        <Button
                            label={APPROVE_LABELS[followUp.type]}
                            variant="primary"
                            size="sm"
                            disabled={busy}
                            onClicked={() => onDecide(followUp, 'approve')}
                        />
                        <Button label="Dismiss" variant="tertiary" size="sm" disabled={busy} onClicked={() => onDecide(followUp, 'dismiss')} />
                    </div>
                )
            )}
        </li>
    )
}

export default function ReplayAI({ service, replay, onChange }: ReplayAIProps) {
    const briefing = useMemo(() => new BriefingService(), [])
    const [deciding, setDeciding] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [runs, setRuns] = useState<{ [kind in AnalysisKind]?: BriefingRun }>({})
    const incidentId = replay.incident.sysId
    const running = Object.values(runs).some((run) => run?.state === 'running')
    const busy = deciding || running

    // The Replay Analyst agent works asynchronously; its steps stream in through AgentRun
    const analyse = async (kind: AnalysisKind) => {
        try {
            setError(null)
            setRuns((current) => ({ ...current, [kind]: undefined }))
            const run = await service.startAgent(incidentId, kind)
            setRuns((current) => ({ ...current, [kind]: run }))
        } catch (err) {
            setError(err.message || 'Unknown error')
        }
    }

    // When the agent finishes, its tools have saved the result on the replay
    const updateRun = useCallback(
        (kind: AnalysisKind) => async (run: BriefingRun) => {
            setRuns((current) => ({ ...current, [kind]: run }))
            if (run.state === 'running') return
            try {
                const updated = await service.get(incidentId)
                if (updated) onChange(updated)
            } catch (err) {
                setError(err.message || 'Unknown error')
            }
        },
        [service, incidentId, onChange]
    )
    const onReviewRun = useMemo(() => updateRun('review'), [updateRun])
    const onFollowUpsRun = useMemo(() => updateRun('follow-ups'), [updateRun])

    const decide = async (followUp: ReplayFollowUp, decision: 'approve' | 'dismiss') => {
        try {
            setDeciding(true)
            setError(null)
            onChange(await service.decide(incidentId, followUp.sysId, decision))
        } catch (err) {
            setError(err.message || 'Unknown error')
        } finally {
            setDeciding(false)
        }
    }
    const proposed = replay.followUps.filter((followUp) => followUp.state === 'proposed').length
    const reviewRun = runs.review
    const followUpsRun = runs['follow-ups']

    return (
        <div className="lux-ai">
            {error && <Alert status="critical" content={error} />}
            <section className="lux-panel">
                <div className="lux-ai__head">
                    <div>
                        <h3 className="lux-panel__title">Blameless review</h3>
                        <p className="lux-panel__subtitle">
                            {replay.reviewedOn ? `Written ${formatTime(replay.reviewedOn)} by Replay AI` : 'Written by Replay AI from this timeline, without naming people'}
                        </p>
                    </div>
                    <Button
                        label={reviewRun?.state === 'running' ? 'Writing…' : replay.review ? 'Rewrite review' : 'Write review'}
                        variant={replay.review ? 'secondary' : 'primary'}
                        disabled={busy}
                        onClicked={() => analyse('review')}
                    />
                </div>
                {reviewRun && (
                    <AgentRun service={briefing} title="Blameless review" agentName="LuxLab Replay Analyst" run={reviewRun} onUpdate={onReviewRun} embedded />
                )}
                {replay.review && reviewRun?.state !== 'running' && <Markdown text={replay.review} className="lux-ai__review" />}
            </section>
            <section className="lux-panel">
                <div className="lux-ai__head">
                    <div>
                        <h3 className="lux-panel__title">Follow-ups</h3>
                        <p className="lux-panel__subtitle">
                            {replay.followUpsOn
                                ? `${proposed} awaiting a manager · suggested ${formatTime(replay.followUpsOn)}`
                                : 'Problems, knowledge and actions proposed by Replay AI, approved by a LuxLab manager'}
                        </p>
                    </div>
                    <Button
                        label={followUpsRun?.state === 'running' ? 'Thinking…' : replay.followUpsOn ? 'Suggest again' : 'Suggest follow-ups'}
                        variant={replay.followUpsOn ? 'secondary' : 'primary'}
                        disabled={busy}
                        onClicked={() => analyse('follow-ups')}
                    />
                </div>
                {followUpsRun && (
                    <AgentRun service={briefing} title="Follow-ups" agentName="LuxLab Replay Analyst" run={followUpsRun} onUpdate={onFollowUpsRun} embedded />
                )}
                {replay.followUps.length > 0 && (
                    <ul className="lux-ai__follow-ups">
                        {replay.followUps.map((followUp) => (
                            <FollowUpItem key={followUp.sysId} followUp={followUp} canDecide={replay.canDecide} busy={busy} onDecide={decide} />
                        ))}
                    </ul>
                )}
            </section>
        </div>
    )
}
