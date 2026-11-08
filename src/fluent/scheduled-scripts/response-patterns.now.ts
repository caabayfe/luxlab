import '@servicenow/sdk/global'
import { ScheduledScript } from '@servicenow/sdk/core'

// Replays the P1/P2 and major incidents resolved since the last run, then mines the response patterns
export const responsePatternsJob = ScheduledScript({
    $id: Now.ID['response-patterns-job'],
    name: 'LuxLab response patterns',
    frequency: 'daily',
    executionTime: { hours: 2, minutes: 0, seconds: 0 },
    script: Now.include('../../server/jobs/response-patterns.js'),
})
