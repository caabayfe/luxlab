// Hand-written types for LuxLab's own classic script includes that modules call
declare module '@servicenow/glide/x_everi_luxlab' {
    // Request and result of sn_aia.AiAgentRuntimeUtil.startAiAgentConversation
    export interface AiAgentRuntimeRequest {
        agentId: string
        objective: string
        targetTable?: string
        targetRecordId?: string
        conversationLabel?: string
        canInteractWithUser?: boolean
    }

    export interface AiAgentRuntimeResult {
        status: 'success' | 'error'
        data?: { conversationId?: string; executionPlanId?: string }
        error?: { code?: string; message?: string }
    }

    export class LuxLabAgentRuntime {
        constructor()
        // Undefined when the instance has no AI Agents licence
        start(request: AiAgentRuntimeRequest): AiAgentRuntimeResult | undefined
    }
}
