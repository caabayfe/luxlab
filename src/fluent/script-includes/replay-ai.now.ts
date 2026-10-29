import '@servicenow/sdk/global'
import { ScriptInclude } from '@servicenow/sdk/core'

export const LuxLabReplayAI = ScriptInclude({
    $id: Now.ID['luxlab-replay-ai-si'],
    name: 'LuxLabReplayAI',
    apiName: 'x_everi_luxlab.LuxLabReplayAI',
    accessibleFrom: 'public',
    callerAccess: 'tracking',
    script: Now.include('../../server/script-includes/LuxLabReplayAI.js'),
    description: 'Builds the name-free replay context read by the LuxLab Replay AI skills.',
})
