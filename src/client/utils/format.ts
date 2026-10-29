import { Phase } from '../types'

export const PHASE_INFO: { id: Phase; label: string; hint: string }[] = [
    { id: 'detection', label: 'Detection', hint: 'First alert until the incident was opened' },
    { id: 'triage', label: 'Triage', hint: 'Open but nobody assigned' },
    { id: 'misrouted', label: 'Misrouted', hint: 'Assigned to a group that did not resolve it' },
    { id: 'waiting', label: 'Waiting', hint: 'On hold: caller, vendor, change or problem' },
    { id: 'fixing', label: 'Fixing', hint: 'Worked by the resolving group' },
]

export function phaseLabel(phase: string): string {
    if (phase === 'recovery') return 'Recovery'
    return PHASE_INFO.find((info) => info.id === phase)?.label || ''
}

export function formatMinutes(minutes: number): string {
    if (minutes < 1) return '<1m'
    const days = Math.floor(minutes / 1440)
    const hours = Math.floor((minutes % 1440) / 60)
    const rest = Math.round(minutes % 60)
    if (days) return `${days}d ${hours}h`
    return hours ? `${hours}h ${rest}m` : `${rest}m`
}

// Server timestamps are UTC "yyyy-MM-dd HH:mm:ss"; show them in the browser's timezone
export function parseUtc(value: string): Date | null {
    return value ? new Date(value.replace(' ', 'T') + 'Z') : null
}

export function formatTime(value: string): string {
    const date = parseUtc(value)
    return date ? date.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''
}

export function offsetLabel(value: string, origin: string): string {
    const at = parseUtc(value)
    const start = parseUtc(origin)
    if (!at || !start) return ''
    const minutes = Math.round((at.getTime() - start.getTime()) / 60000)
    return minutes < 0 ? `T-${formatMinutes(-minutes)}` : `T+${formatMinutes(minutes)}`
}
