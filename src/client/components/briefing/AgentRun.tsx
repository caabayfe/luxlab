import React, { useEffect, useState } from 'react'
import { Alert } from '@servicenow/react-components/Alert'
import Markdown from '../Markdown'
import { BriefingService } from '../../services/BriefingService'
import { BriefingRun, BriefingStep, BriefingTool } from '../../types'
import { formatTime } from '../../utils/format'

// Step statuses that are not failures: done, or still being worked
const OK_STATUSES = ['success', 'ongoing', 'in_progress', 'pending', 'queued']
const POLL_MS = 2000
// Agents normally answer within a minute or two; stop polling a run that looks stuck
const MAX_POLLS = 150

const STEP_LABELS: { [type: string]: string } = {
    access_verification: 'Access check',
    gen_ai: 'Reasoning',
    agent: 'Agent',
    tool: 'Tool',
}

function seconds(ms: number): string {
    return ms ? `${(ms / 1000).toFixed(1)}s` : ''
}

function Step({ step }: { step: BriefingStep }) {
    const failed = !!step.status && !OK_STATUSES.includes(step.status)
    return (
        <li className={`lux-trace__step lux-trace__step--${step.type}${failed ? ' lux-trace__step--failed' : ''}`}>
            <div className="lux-trace__head">
                <span className="lux-trace__type">{STEP_LABELS[step.type] || step.type}</span>
                <span className="lux-trace__name">{step.type === 'gen_ai' ? step.actions.join(', ') || 'Final answer' : step.name}</span>
                <span className="lux-trace__meta">
                    {failed ? `${step.status} · ` : ''}
                    {seconds(step.ms)}
                </span>
            </div>
            {step.thought && <p className="lux-trace__thought">{step.thought}</p>}
        </li>
    )
}

interface AgentRunProps {
    service: BriefingService
    tool: BriefingTool
    run: BriefingRun
    onUpdate: (run: BriefingRun) => void
}

// Follows a run's execution plan until the agent answers, showing each step as it is written
export default function AgentRun({ service, tool, run, onUpdate }: AgentRunProps) {
    const [polls, setPolls] = useState(0)
    const [error, setError] = useState<string | null>(null)
    const running = run.state === 'running'
    const stuck = running && polls >= MAX_POLLS

    useEffect(() => setPolls(0), [run.id])

    useEffect(() => {
        if (!running || stuck) return
        const timer = window.setTimeout(async () => {
            try {
                onUpdate(await service.trace(run.id))
                setError(null)
            } catch (err) {
                setError(err.message || 'Unknown error')
            }
            setPolls((count) => count + 1)
        }, polls ? POLL_MS : 0)
        return () => window.clearTimeout(timer)
    }, [service, run, running, stuck, polls, onUpdate])

    const status = running
        ? stuck
            ? 'Still running. Reopen the tool later to see the answer.'
            : `Running ${tool.agentName}…`
        : `${run.state === 'completed' ? 'Answered' : 'Stopped'} ${formatTime(run.finishedOn)}${run.ms ? ` · ${seconds(run.ms)}` : ''}`

    return (
        <section className="lux-panel lux-run" aria-label={`${tool.name} run`}>
            <div className="lux-run__head">
                <div>
                    <h3 className="lux-panel__title">{tool.name}</h3>
                    <p className="lux-panel__subtitle">
                        {tool.agentName} · {status}
                    </p>
                </div>
            </div>
            {error && <Alert status="warning" content={`Could not refresh the run: ${error}`} />}
            {run.error && <Alert status="critical" content={run.error} />}
            <div className="lux-run__body">
                <div className="lux-run__trace">
                    <h4 className="lux-run__label">Steps</h4>
                    {run.steps.length ? (
                        <ol className="lux-trace">
                            {run.steps.map((step, index) => (
                                <Step key={`${step.order}-${index}`} step={step} />
                            ))}
                            {running && !stuck && <li className="lux-trace__step lux-trace__step--pending">Working…</li>}
                        </ol>
                    ) : (
                        <p className="lux-panel__subtitle">{running ? 'Waiting for the agent to start…' : 'No steps were recorded.'}</p>
                    )}
                </div>
                <div className="lux-run__output">
                    <h4 className="lux-run__label">Answer</h4>
                    {run.output ? (
                        <Markdown text={run.output} />
                    ) : (
                        <p className="lux-panel__subtitle">{running ? 'The answer appears here when the agent finishes.' : 'The agent gave no answer.'}</p>
                    )}
                </div>
            </div>
        </section>
    )
}
