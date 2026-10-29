import React, { useCallback, useEffect, useState } from 'react'
import { Alert } from '@servicenow/react-components/Alert'
import { Button } from '@servicenow/react-components/Button'
import AgentRun from '../components/briefing/AgentRun'
import { BriefingService } from '../services/BriefingService'
import { BriefingRun, BriefingTool } from '../types'
import { formatTime } from '../utils/format'
import '../components/BriefingTools.css'

function runLabel(run: BriefingRun | null): string {
    if (!run) return 'Not run today'
    if (run.state === 'running') return 'Running…'
    return `${run.state === 'completed' ? 'Answered' : 'Failed'} ${formatTime(run.finishedOn || run.startedOn)}`
}

// Each tool runs an AI agent; today's latest run is kept, so reopening a tool costs no new agent run
export default function BriefingView({ service }: { service: BriefingService }) {
    const [tools, setTools] = useState<BriefingTool[] | null>(null)
    const [selected, setSelected] = useState<string | null>(null)
    const [starting, setStarting] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        service
            .tools()
            .then(setTools)
            .catch((err) => setError(err.message || 'Unknown error'))
    }, [service])

    const updateRun = useCallback((run: BriefingRun) => {
        setTools((current) => current && current.map((tool) => (tool.id === run.tool ? { ...tool, lastRun: run } : tool)))
    }, [])

    const start = async (tool: BriefingTool) => {
        try {
            setStarting(tool.id)
            setError(null)
            updateRun(await service.run(tool.id))
            setSelected(tool.id)
        } catch (err) {
            setError(err.message || 'Unknown error')
        } finally {
            setStarting(null)
        }
    }

    // Runs listed with the tools carry no steps; load the full trace when one is opened
    const open = async (tool: BriefingTool) => {
        setSelected(tool.id)
        if (!tool.lastRun || tool.lastRun.steps.length || tool.lastRun.state === 'running') return
        try {
            updateRun(await service.trace(tool.lastRun.id))
        } catch (err) {
            setError(err.message || 'Unknown error')
        }
    }

    const current = tools?.find((tool) => tool.id === selected)

    return (
        <div className="lux-briefing-view">
            <section className="lux-panel" aria-label="Daily briefing">
                <h2 className="lux-panel__title">Daily briefing</h2>
                <p className="lux-panel__subtitle">
                    Each tool runs a ServiceNow AI agent on your work. You see its steps live, and today's answer is kept until you run it again.
                </p>
                {error && <Alert status="critical" content={error} />}
                {!tools && !error && <p className="lux-panel__subtitle">Loading tools…</p>}
                {tools && (
                    <ul className="lux-briefing__grid">
                        {tools.map((tool) => {
                            const run = tool.lastRun
                            const busy = starting === tool.id || run?.state === 'running'
                            return (
                                <li
                                    key={tool.id}
                                    className={`lux-briefing__tool lux-briefing__tool--action${tool.id === selected ? ' lux-briefing__tool--selected' : ''}`}
                                >
                                    <button type="button" className="lux-briefing__open" disabled={!run} onClick={() => open(tool)}>
                                        <h3 className="lux-briefing__title">{tool.name}</h3>
                                        <p className="lux-briefing__description">{tool.description}</p>
                                        <p className={`lux-briefing__status lux-briefing__status--${run ? run.state : 'idle'}`}>{runLabel(run)}</p>
                                    </button>
                                    <div className="lux-briefing__footer">
                                        <span className="lux-briefing__agent">{tool.agentName}</span>
                                        <Button
                                            label={starting === tool.id ? 'Starting…' : run ? 'Run again' : 'Run'}
                                            size="sm"
                                            variant={run ? 'secondary' : 'primary'}
                                            disabled={busy}
                                            onClicked={() => start(tool)}
                                        />
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                )}
            </section>
            {current?.lastRun && <AgentRun service={service} tool={current} run={current.lastRun} onUpdate={updateRun} />}
        </div>
    )
}
