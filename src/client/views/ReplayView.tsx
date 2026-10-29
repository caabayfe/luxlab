import React from 'react'
import { ReplayService } from '../services/ReplayService'
import ReplayList from '../components/replay/ReplayList'
import ReplayDetail from '../components/replay/ReplayDetail'

interface ReplayViewProps {
    service: ReplayService
    incidentId: string | null
    onOpen: (incidentId: string, number: string) => void
    onBack: () => void
}

// ?tab=replay lists candidates; ?tab=replay&incident=<sys_id> shows one replay
export default function ReplayView({ service, incidentId, onOpen, onBack }: ReplayViewProps) {
    if (incidentId) return <ReplayDetail key={incidentId} service={service} incidentId={incidentId} onBack={onBack} />
    return <ReplayList service={service} onOpen={onOpen} />
}
