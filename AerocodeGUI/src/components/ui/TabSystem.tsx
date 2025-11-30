import React, { useState } from 'react';
import './TabSystem.css';

interface Tab {
    id: string;
    label: string;
    content: React.ReactNode;
}

interface Props {
    tabs: Tab[];
    initialTabId?: string;
}

export function TabSystem({ tabs, initialTabId }: Props) {
    const [activeTab, setActiveTab] = useState(initialTabId || tabs[0]?.id);

    const currentTab = tabs.find(tab => tab.id === activeTab);

    return (
        <div className="tab-system-container">
   
            <div className="tabs-header">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        className={`tab-button ${tab.id === activeTab ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            
            <div className="tabs-content">
                {currentTab ? currentTab.content : null}
            </div>
        </div>
    );
}