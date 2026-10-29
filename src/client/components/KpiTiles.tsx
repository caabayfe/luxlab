import React from 'react'
import { Overview, PriorityCount } from '../types'
import './KpiTiles.css'

interface TileProps {
    label: string
    value: number
    caption: string
    tone?: 'neutral' | 'warning' | 'critical' | 'positive'
    priorities?: PriorityCount[]
}

function PriorityBar({ priorities }: { priorities: PriorityCount[] }) {
    // P5 is rare in ops queues; fold it out of the bar to keep it readable
    const shown = priorities.filter((item) => item.priority !== '5')
    const total = shown.reduce((sum, item) => sum + item.count, 0)
    return (
        <div className="lux-kpi__priorities">
            <div className="lux-kpi__bar" aria-hidden="true">
                {shown.map((item) =>
                    item.count ? (
                        <span
                            key={item.priority}
                            className={`lux-kpi__segment lux-priority--${item.priority}`}
                            style={{ width: `${(item.count / total) * 100}%` }}
                        />
                    ) : null
                )}
            </div>
            <div className="lux-kpi__legend">
                {shown.map((item) => (
                    <span key={item.priority} className={item.count ? 'lux-kpi__legend-item--active' : ''}>
                        P{item.priority} ({item.count})
                    </span>
                ))}
            </div>
        </div>
    )
}

function Tile({ label, value, caption, tone = 'neutral', priorities }: TileProps) {
    return (
        <section className={`lux-kpi lux-panel lux-kpi--${tone}`} aria-label={label}>
            <h2 className="lux-panel__title">{label}</h2>
            <p className="lux-kpi__value">{value}</p>
            <p className="lux-kpi__caption">{caption}</p>
            {priorities && <PriorityBar priorities={priorities} />}
        </section>
    )
}

export default function KpiTiles({ overview }: { overview: Overview }) {
    return (
        <div className="lux-kpis">
            <Tile label="My tickets" value={overview.myTickets.total} caption="Active and assigned to me" priorities={overview.myTickets.byPriority} />
            <Tile label="SLAs at risk" value={overview.slaAtRisk} caption="75% or more elapsed" tone={overview.slaAtRisk ? 'warning' : 'neutral'} />
            <Tile label="SLAs breached" value={overview.slaBreached} caption="On my active tickets" tone={overview.slaBreached ? 'critical' : 'positive'} />
            <Tile label="Changes" value={overview.changesPendingApproval} caption="My groups, pending approval" />
            <Tile label="Changes (24h)" value={overview.changesNext24h} caption="Windows starting in the next 24h" />
            <Tile label="Unassigned" value={overview.unassigned.total} caption="In my groups' queues" tone={overview.unassigned.total ? 'warning' : 'neutral'} priorities={overview.unassigned.byPriority} />
        </div>
    )
}
