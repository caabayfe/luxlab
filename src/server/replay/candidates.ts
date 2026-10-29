import { GlideRecord, GlideRecordSecure } from '@servicenow/glide'

const MAX_CANDIDATES = 50

export interface Candidate {
    sysId: string
    number: string
    shortDescription: string
    priority: string
    majorState: string
    group: string
    openedAt: string
    resolvedAt: string
    active: boolean
    replayStatus: string
    replayBuiltOn: string
}

function replayIndex(incidentIds: string[]): { [incidentId: string]: { status: string; builtOn: string } } {
    const index: { [incidentId: string]: { status: string; builtOn: string } } = {}
    if (!incidentIds.length) return index
    const replay = new GlideRecord('x_everi_luxlab_replay')
    replay.addQuery('incident', 'IN', incidentIds.join(','))
    replay.query()
    while (replay.next()) {
        index[replay.getValue('incident')] = { status: replay.getValue('status'), builtOn: replay.getDisplayValue('built_on') }
    }
    return index
}

// Major incidents and P1/P2s are worth replaying; newest first
export function listCandidates(search: string): Candidate[] {
    const candidates: Candidate[] = []
    const incident = new GlideRecordSecure('incident')
    incident.addEncodedQuery('major_incident_state=accepted^ORpriorityIN1,2')
    if (search) incident.addEncodedQuery(`numberLIKE${search}^ORshort_descriptionLIKE${search}`)
    incident.orderByDesc('opened_at')
    incident.setLimit(MAX_CANDIDATES)
    incident.query()
    while (incident.next()) {
        candidates.push({
            sysId: incident.getUniqueValue(),
            number: incident.getValue('number'),
            shortDescription: incident.getValue('short_description') || '',
            priority: incident.getValue('priority') || '5',
            majorState: incident.getDisplayValue('major_incident_state'),
            group: incident.getDisplayValue('assignment_group'),
            openedAt: incident.getDisplayValue('opened_at'),
            resolvedAt: incident.getDisplayValue('resolved_at'),
            active: incident.getValue('active') === '1',
            replayStatus: '',
            replayBuiltOn: '',
        })
    }
    const replays = replayIndex(candidates.map((candidate) => candidate.sysId))
    for (const candidate of candidates) {
        const replay = replays[candidate.sysId]
        if (replay) {
            candidate.replayStatus = replay.status
            candidate.replayBuiltOn = replay.builtOn
        }
    }
    return candidates
}
