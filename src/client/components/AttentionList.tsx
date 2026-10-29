import React from 'react'
import { Button } from '@servicenow/react-components/Button'
import { AttentionPage } from '../types'
import { recordUrl } from '../utils/navigation'
import './AttentionList.css'

interface AttentionListProps {
    data: AttentionPage
    onPage: (page: number) => void
}

const STALE_AFTER_DAYS = 7

// Ranked DTOs come from the cockpit API, not raw table rows, so a plain list is used here
export default function AttentionList({ data, onPage }: AttentionListProps) {
    const lastPage = Math.max(1, Math.ceil(data.total / data.pageSize))
    const first = data.total ? (data.page - 1) * data.pageSize + 1 : 0
    const last = Math.min(data.page * data.pageSize, data.total)

    return (
        <section className="lux-panel lux-attention" aria-label="Requires attention">
            <h2 className="lux-panel__title">Requires attention</h2>
            <p className="lux-panel__subtitle">My active tickets, most urgent first: breached SLA, SLA at risk, priority, then staleness.</p>

            {!data.items.length && <p className="lux-attention__empty">Nothing needs attention right now.</p>}

            <ol className="lux-attention__list">
                {data.items.map((item) => (
                    <li key={item.sysId} className="lux-attention__item">
                        <div className="lux-attention__row">
                            <span className={`lux-priority lux-priority--${item.priority}`}>P{item.priority}</span>
                            <a className="lux-attention__number" href={recordUrl(item.table, item.sysId)} target="_top">
                                {item.number}
                            </a>
                            <span className="lux-attention__group">{item.assignmentGroup}</span>
                            <span className="lux-attention__flags">
                                {item.slaBreached && <span className="lux-flag lux-flag--critical">SLA breached</span>}
                                {item.slaAtRisk && <span className="lux-flag lux-flag--warning">SLA at risk</span>}
                                {item.staleDays >= STALE_AFTER_DAYS && <span className="lux-flag">Not updated for {item.staleDays}d</span>}
                            </span>
                        </div>
                        <p className="lux-attention__description">{item.shortDescription}</p>
                    </li>
                ))}
            </ol>

            <footer className="lux-attention__footer">
                <span>
                    {first}-{last} of {data.total}
                </span>
                <span className="lux-attention__pager">
                    <Button label="Prev" size="sm" variant="tertiary" disabled={data.page <= 1} onClicked={() => onPage(data.page - 1)} />
                    <Button label="Next" size="sm" variant="tertiary" disabled={data.page >= lastPage} onClicked={() => onPage(data.page + 1)} />
                </span>
            </footer>
        </section>
    )
}
