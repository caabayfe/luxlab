import '@servicenow/sdk/global'
import { ScriptInclude } from '@servicenow/sdk/core'

export const LuxLabAgentRuntime = ScriptInclude({
    $id: Now.ID['luxlab-agent-runtime-si'],
    name: 'LuxLabAgentRuntime',
    apiName: 'x_everi_luxlab.LuxLabAgentRuntime',
    accessibleFrom: 'package_private',
    script: Now.include('../../server/script-includes/LuxLabAgentRuntime.js'),
    description: 'Starts the AI agents behind the LuxLab Daily Briefing tools.',
})
