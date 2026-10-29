import React, { useEffect, useState } from 'react'

interface Clock {
    city: string
    timeZone: string
}

// Follow-the-sun hubs; the first entry is shown as the local hub
const CLOCKS: Clock[] = [
    { city: 'Madrid', timeZone: 'Europe/Madrid' },
    { city: 'London', timeZone: 'Europe/London' },
    { city: 'Bangalore', timeZone: 'Asia/Kolkata' },
    { city: 'New York', timeZone: 'America/New_York' },
]

function timeIn(timeZone: string, now: Date): string {
    return new Intl.DateTimeFormat('en-GB', { timeZone, hour: '2-digit', minute: '2-digit' }).format(now)
}

function offsetOf(timeZone: string, now: Date): string {
    const part = new Intl.DateTimeFormat('en-GB', { timeZone, timeZoneName: 'shortOffset' })
        .formatToParts(now)
        .find((item) => item.type === 'timeZoneName')
    return part ? part.value.replace('GMT', 'UTC') : ''
}

export default function WorldClocks() {
    const [now, setNow] = useState(() => new Date())

    useEffect(() => {
        const timer = window.setInterval(() => setNow(new Date()), 30 * 1000)
        return () => window.clearInterval(timer)
    }, [])

    return (
        <ul className="lux-clocks" aria-label="World clocks">
            {CLOCKS.map((clock, index) => (
                <li key={clock.timeZone} className={index === 0 ? 'lux-clock lux-clock--local' : 'lux-clock'}>
                    <span className="lux-clock__city">{clock.city}</span>
                    <span className="lux-clock__time">{timeIn(clock.timeZone, now)}</span>
                    <span className="lux-clock__offset">{offsetOf(clock.timeZone, now)}</span>
                </li>
            ))}
        </ul>
    )
}
