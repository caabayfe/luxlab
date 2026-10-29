import React, { useState } from 'react'
import { Button } from '@servicenow/react-components/Button'
import { Toggle } from '@servicenow/react-components/Toggle'
import { ReplayEvent } from '../../types'
import { formatTime, offsetLabel, phaseLabel } from '../../utils/format'

interface TimelineProps {
    events: ReplayEvent[]
    origin: string
}

export default function Timeline({ events, origin }: TimelineProps) {
    const [keyOnly, setKeyOnly] = useState(false)
    const [open, setOpen] = useState<number | null>(null)
    const shown = keyOnly ? events.filter((event) => event.keyMoment || event.kind === 'silent_gap') : events

    return (
        <section className="lux-panel" aria-label="Timeline">
            <div className="lux-timeline__head">
                <h2 className="lux-panel__title">Timeline ({shown.length})</h2>
                <Toggle label="Key moments only" size="sm" checked={keyOnly} onCheckedSet={(event) => setKeyOnly(event.detail.payload.value)} />
            </div>
            {/* Events are stored replay rows already ordered by the engine */}
            <ol className="lux-timeline">
                {shown.map((event) => {
                    const classes = ['lux-timeline__event', `lux-timeline__event--${event.source}`]
                    if (event.keyMoment) classes.push('lux-timeline__event--key')
                    if (event.kind === 'silent_gap') classes.push('lux-timeline__event--gap')
                    return (
                        <li key={event.sequence} className={classes.join(' ')}>
                            <div className="lux-timeline__when">
                                <span className="lux-timeline__offset">{offsetLabel(event.occurredAt, origin)}</span>
                                <span className="lux-timeline__time">{formatTime(event.occurredAt)}</span>
                            </div>
                            <div className="lux-timeline__body">
                                <div className="lux-timeline__summary">
                                    {event.phase && <span className={`lux-timeline__phase lux-phase--${event.phase}`}>{phaseLabel(event.phase)}</span>}
                                    <span>{event.summary}</span>
                                </div>
                                {event.actor && <div className="lux-timeline__actor">{event.actor}</div>}
                                {event.detail && open === event.sequence && <p className="lux-timeline__detail">{event.detail}</p>}
                                {event.detail && (
                                    <Button
                                        label={open === event.sequence ? 'Hide details' : 'Show details'}
                                        size="sm"
                                        variant="tertiary"
                                        onClicked={() => setOpen(open === event.sequence ? null : event.sequence)}
                                    />
                                )}
                            </div>
                        </li>
                    )
                })}
            </ol>
        </section>
    )
}
