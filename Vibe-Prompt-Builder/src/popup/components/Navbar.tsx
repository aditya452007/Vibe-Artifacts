import React, { useState } from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import '../styles/components.scss';

interface NavbarProps {
    onAdd: () => void;
    onSettingsClick: () => void;
    onToggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onAdd, onSettingsClick, onToggleSidebar }) => {
    const [searchValue, setSearchValue] = useState('');

    return (
        <nav className="navbar glass-panel">
            <div className="navbar-top">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Button variant="ghost" size="sm" onClick={onToggleSidebar} title="Toggle Sidebar">
                        ☰
                    </Button>
                    <h2 className="navbar-logo">Prompt Builder</h2>
                </div>
                <div className="navbar-actions">
                    <Button variant="primary" size="sm" onClick={onAdd}>+ New</Button>
                    <Button variant="ghost" size="sm" title="Import/Export">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                    </Button>
                    <Button variant="ghost" size="sm" title="Settings" onClick={onSettingsClick}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
                    </Button>
                </div>
            </div>
            <div className="navbar-search">
                <Input
                    placeholder="Search prompts..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>}
                />
            </div>
        </nav>
    );
};
