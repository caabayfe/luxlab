import React, { ReactNode, useCallback, useState } from 'react'
import { Alert } from '@servicenow/react-components/Alert'
import { Button } from '@servicenow/react-components/Button'
import { ReplayService } from '../../services/ReplayService'
import { FollowUpType, Replay, ReplayFollowUp } from '../../types'
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

// Renders **bold** spans; the review only uses headings, bullets and bold
function inline(text: string): ReactNode[] {
    return text.split(/\*\*(.+?)\*\*/g).map((part, index) => (index % 2 ? <strong key={index}>{part}</strong> : part))
}

function Markdown({ text }: { text: string }) {
    const blocks: ReactNode[] = []
    let bullets: string[] = []
    const flush = () => {
        if (!bullets.length) return
        blocks.push(
            <ul key={blocks.length}>
                {bullets.map((item, index) => (
                    <li key={index}>{inline(item)}</li>
                ))}
            </ul>
        )
        bullets = []
    }
    text.split('\n').forEach((raw) => {
        const line = raw.trim()
        if (/^[-*] /.test(line)) return void bullets.push(line.substring(2))
        flush()
        if (!line) return
        const heading = line.match(/^#{1,6}\s+(.*)$/)
        blocks.push(heading ? <h4 key={blocks.length}>{inline(heading[1])}</h4> : <p key={blocks.length}>{inline(line)}</p>)
    })
    flush()
    return <div className="lux-ai__review">{blocks}</div>
}

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
                </p>
            ) : (
                canDecide && (
                    <div className="lux-ai__actions">
                        <Button
                            label={followUp.type === 'problem' ? 'Approve and raise problem' : 'Approve'}
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
    const [busy, setBusy] = useState<'review' | 'followUps' | 'decision' | null>(null)
    const [error, setError] = useState<string | null>(null)
    const incidentId = replay.incident.sysId

    const run = useCallback(
        async (kind: 'review' | 'followUps' | 'decision', action: () => Promise<Replay>) => {
            try {
                setBusy(kind)
                setError(null)
                onChange(await action())
            } catch (err) {
                setError(err.message || 'Unknown error')
            } finally {
                setBusy(null)
            }
        },
        [onChange]
    )

    const decide = (followUp: ReplayFollowUp, decision: 'approve' | 'dismiss') =>
        run('decision', () => service.decide(incidentId, followUp.sysId, decision))
    const proposed = replay.followUps.filter((followUp) => followUp.state === 'proposed').length

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
                        label={busy === 'review' ? 'Writing…' : replay.review ? 'Rewrite review' : 'Write review'}
                        variant={replay.review ? 'secondary' : 'primary'}
                        disabled={!!busy}
                        onClicked={() => run('review', () => service.review(incidentId))}
                    />
                </div>
                {replay.review && <Markdown text={replay.review} />}
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
                        label={busy === 'followUps' ? 'Thinking…' : replay.followUpsOn ? 'Suggest again' : 'Suggest follow-ups'}
                        variant={replay.followUpsOn ? 'secondary' : 'primary'}
                        disabled={!!busy}
                        onClicked={() => run('followUps', () => service.suggestFollowUps(incidentId))}
                    />
                </div>
                {replay.followUps.length > 0 && (
                    <ul className="lux-ai__follow-ups">
                        {replay.followUps.map((followUp) => (
                            <FollowUpItem key={followUp.sysId} followUp={followUp} canDecide={replay.canDecide} busy={!!busy} onDecide={decide} />
                        ))}
                    </ul>
                )}
            </section>
        </div>
    )
}
