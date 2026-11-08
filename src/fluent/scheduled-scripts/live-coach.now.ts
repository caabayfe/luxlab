import '@servicenow/sdk/global'
import { ScheduledScript } from '@servicenow/sdk/core'

// Posts the live coach's nudges as work notes on live P1/P2 incidents; the war room itself computes them live
export const liveCoachJob = ScheduledScript({
    $id: Now.ID['live-coach-job'],
    name: 'LuxLab live coach',
    frequency: 'periodically',
    executionInterval: { minutes: 5 },
    script: Now.include('../../server/jobs/live-coach.js'),
})
