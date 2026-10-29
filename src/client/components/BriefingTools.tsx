import React from 'react'
import { Button } from '@servicenow/react-components/Button'
import './BriefingTools.css'

export interface BriefingTool {
    id: string
    title: string
    description: string
}

// Overview teaser; the Daily Briefing tab runs each tool on its AI agent
export const BRIEFING_TOOLS: BriefingTool[] = [
    { id: 'analyze-queue', title: 'Analyze My Queue', description: 'Queue health readout: workload mix, risks, patterns and next actions.' },
    { id: 'next-best-order', title: 'Next Best Work Order', description: 'Suggested order to work your tickets based on SLA, priority and impact.' },
    { id: 'stalled-work', title: 'Stalled Work Detector', description: 'Assigned work that is aging, on hold, or missing a recent update.' },
    { id: 'customer-impact', title: 'Customer Impact Brief', description: 'Active work grouped by customer, turned into impact and escalation notes.' },
    { id: 'update-draft', title: 'Update Draft Assistant', description: 'Customer-facing updates for tickets that have gone quiet.' },
    { id: 'weekly-summary', title: 'Weekly Summary', description: 'This week against last week: opened incidents and what changed.' },
]

export default function BriefingTools({ onOpen }: { onOpen: () => void }) {
    return (
        <section className="lux-panel lux-briefing" aria-label="Daily briefing tools">
            <div className="lux-briefing__head">
                <div>
                    <h2 className="lux-panel__title">Daily briefing tools</h2>
                    <p className="lux-panel__subtitle">Each tool runs a ServiceNow AI agent on your work.</p>
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
