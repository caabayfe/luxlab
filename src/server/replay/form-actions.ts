import { readableIncident } from './store.ts'
import { suggestFollowUps, writeReview } from './ai.ts'

const FOLLOW_UP_LABELS: { [type: string]: string } = { problem: 'Problem', knowledge: 'Knowledge', action: 'Action' }

function escape(text: string): string {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

// Info messages render HTML: headings become bold lines, bullets keep their marker, **bold** becomes <b>
function markdownToHtml(markdown: string): string {
    return markdown
        .split('\n')
        .map((line) => {
            const html = escape(line.trim()).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
            const heading = html.match(/^#{1,6}\s+(.*)$/)
            if (heading) return `<br/><b>${heading[1]}</b>`
            return /^[-*] /.test(html) ? `• ${html.substring(2)}` : html
        })
        .filter((line, index) => line || index > 0)
        .join('<br/>')
}

function replayLink(incidentId: string): string {
    return `<br/><br/><a href="x_everi_luxlab_cockpit.do?tab=replay&amp;incident=${incidentId}">Open the Incident Replay in LuxLab</a>`
}

function incidentFor(incidentId: string) {
    const incident = readableIncident(incidentId)
    if (!incident) throw new Error('Incident not found or not readable')
    return incident
}

export function reviewMessage(incidentId: string): string {
    const review = writeReview(incidentFor(incidentId))
    return `<b>Blameless review</b> (saved on the replay)<br/>${markdownToHtml(review)}${replayLink(incidentId)}`
}

export function followUpsMessage(incidentId: string): string {
    const followUps = suggestFollowUps(incidentFor(incidentId))
    const items = followUps.map((followUp) => `• <b>${FOLLOW_UP_LABELS[followUp.type]}: ${escape(followUp.title)}</b> — ${escape(followUp.description)}`)
    const body = items.length ? items.join('<br/>') : 'No follow-ups proposed for this incident.'
    return `<b>Proposed follow-ups</b> (a LuxLab manager approves them in the replay)<br/>${body}${replayLink(incidentId)}`
}
