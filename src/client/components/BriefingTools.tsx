import React from 'react'
import { Button } from '@servicenow/react-components/Button'
import './BriefingTools.css'

export interface BriefingTool {
    id: string
    title: string
    description: string
}

// Each tool becomes a Now Assist skill in Phase 4; until then the cards are informational
export const BRIEFING_TOOLS: BriefingTool[] = [
    { id: 'analyze-queue', title: 'Analyze My Queue', description: 'Queue health readout: workload mix, risks, patterns and next actions.' },
    { id: 'next-best-order', title: 'Next Best Work Order', description: 'Suggested order to work your tickets based on SLA, priority and impact.' },
    { id: 'stalled-work', title: 'Stalled Work Detector', description: 'Assigned work that is aging, on hold, or missing a recent update.' },
    { id: 'customer-impact', title: 'Customer Impact Brief', description: 'Active work grouped by customer, turned into impact and escalation notes.' },
    { id: 'update-draft', title: 'Update Draft Assistant', description: 'Customer-facing updates and next-step notes for tickets that need communication.' },
    { id: 'weekly-summary', title: 'Weekly Summary', description: 'Your operations week: resolved, opened and trends.' },
]

export default function BriefingTools({ onOpen }: { onOpen: () => void }) {
    return (
        <section className="lux-panel lux-briefing" aria-label="Daily briefing tools">
            <div className="lux-briefing__head">
                <div>
                    <h2 className="lux-panel__title">Daily briefing tools</h2>
                    <p className="lux-panel__subtitle">AI tools powered by Now Assist skills. Coming in a later phase.</p>
                </div>
                <Button label="Open" size="sm" variant="secondary" onClicked={onOpen} />
            </div>
            <ul className="lux-briefing__grid">
                {BRIEFING_TOOLS.map((tool) => (
                    <li key={tool.id} className="lux-briefing__tool">
                        <h3 className="lux-briefing__title">{tool.title}</h3>
                        <p className="lux-briefing__description">{tool.description}</p>
                    </li>
                ))}
            </ul>
        </section>
    )
}
