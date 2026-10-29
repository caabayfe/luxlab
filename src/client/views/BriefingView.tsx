import React from 'react'
import { BRIEFING_TOOLS } from '../components/BriefingTools'
import '../components/BriefingTools.css'

// Placeholder until the briefing skills (Phase 4) land
export default function BriefingView() {
    return (
        <section className="lux-panel" aria-label="Daily briefing">
            <h2 className="lux-panel__title">Daily briefing</h2>
            <p className="lux-panel__subtitle">Each tool will run a governed Now Assist skill and keep today's result, so re-opening it costs no new AI call.</p>
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
