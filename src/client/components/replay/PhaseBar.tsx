import React from 'react'
import { Replay } from '../../types'
import { formatMinutes, PHASE_INFO } from '../../utils/format'

// Where the time went between first impact and resolution
export default function PhaseBar({ replay }: { replay: Replay }) {
    const phases = PHASE_INFO.map((info) => ({ ...info, minutes: replay.phases[info.id] || 0 }))
    const total = phases.reduce((sum, phase) => sum + phase.minutes, 0)
    const recovery = replay.phases.recovery || 0

    if (!total) return <p className="lux-panel__subtitle">Not enough history to split this incident into phases.</p>

    return (
        <div className="lux-phases">
            <div className="lux-phases__bar" role="img" aria-label="Time spent per phase">
                {phases.map((phase) =>
                    phase.minutes ? (
                        <span
                            key={phase.id}
                            className={`lux-phases__segment lux-phase--${phase.id}`}
                            style={{ width: `${(phase.minutes / total) * 100}%` }}
                            title={`${phase.label}: ${formatMinutes(phase.minutes)}`}
                        />
                    ) : null
                )}
            </div>
            <ul className="lux-phases__legend">
                {phases.map((phase) => (
                    <li key={phase.id} title={phase.hint}>
                        <span className={`lux-phases__dot lux-phase--${phase.id}`} />
                        {phase.label}
                        <strong>{formatMinutes(phase.minutes)}</strong>
                        <span className="lux-phases__share">{Math.round((phase.minutes / total) * 100)}%</span>
                    </li>
                ))}
                {recovery > 0 && (
                    <li title="Resolved until closed; not counted in time to resolve">
                        <span className="lux-phases__dot lux-phase--recovery" />
                        Recovery <strong>{formatMinutes(recovery)}</strong>
                    </li>
                )}
            </ul>
        </div>
    )
}
