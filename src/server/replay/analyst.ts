import { GlideRecord, GlideRecordSecure } from '@servicenow/glide'
import { BriefingRunDto, startRun } from '../briefing/agents.ts'

export const ANALYST = 'LuxLab Replay Analyst'

export type AnalysisKind = 'review' | 'follow-ups'

const OBJECTIVES: { [kind in AnalysisKind]: (number: string) => string } = {
    review: (number) => `Write the blameless review for incident ${number} from its replay and save it.`,
    'follow-ups': (number) => `Propose the follow-ups for incident ${number} from its replay and save them for approval.`,
}

function analystId(): string {
    const agent = new GlideRecord('sn_aia_agent')
    return agent.get('name', ANALYST) ? agent.getUniqueValue() : ''
}

// The agent saves its result on the replay through its tools; the run only tracks progress and steps
export function startAnalysis(incident: GlideRecordSecure<'incident'>, kind: AnalysisKind): BriefingRunDto {
    const agentId = analystId()
    if (!agentId) throw new Error(`The ${ANALYST} agent is not installed`)
    const number = incident.getValue('number')
    return startRun({
        tool: `replay-${kind}`,
        agentId,
        agentName: ANALYST,
        objective: OBJECTIVES[kind](number),
        label: `replay ${kind} ${number}`,
        incident: incident.getUniqueValue(),
    })
}
