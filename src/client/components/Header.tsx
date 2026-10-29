import React, { useCallback } from 'react'
import { Tabs, TabsSelectedItemSet } from '@servicenow/react-components/Tabs'
import { TABS } from '../utils/navigation'
import { TabId } from '../types'
import WorldClocks from './WorldClocks'
import './Header.css'

interface HeaderProps {
    tab: TabId
    onSelectTab: (tab: TabId) => void
}

export default function Header({ tab, onSelectTab }: HeaderProps) {
    const handleTab = useCallback<TabsSelectedItemSet>(
        (event) => onSelectTab(event.detail.payload.value as TabId),
        [onSelectTab]
    )

    return (
        <header className="lux-header">
            <div className="lux-header__top">
                <div className="lux-header__brand">
                    <span className="lux-header__name">LuxLab</span>
                    <span className="lux-header__tagline">Operations cockpit</span>
                </div>
                <WorldClocks />
            </div>
            <Tabs items={TABS} selectedItem={tab} onSelectedItemSet={handleTab} />
        </header>
    )
}
