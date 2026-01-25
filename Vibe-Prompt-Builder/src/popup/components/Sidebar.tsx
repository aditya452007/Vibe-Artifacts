import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { storage, PromptGroup } from '../../utils/storage';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import '../styles/components.scss';

interface SidebarProps {
    isOpen: boolean;
    onToggle: () => void;
    selectedFilter: string;
    onSelectFilter: (filter: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle, selectedFilter, onSelectFilter }) => {
    const [groups, setGroups] = useState<PromptGroup[]>([]);
    const [isAdding, setIsAdding] = useState(false);
    const [newGroupName, setNewGroupName] = useState('');

    const systemGroups = ['All Prompts', 'Favorites'];

    useEffect(() => {
        loadGroups();
    }, []);

    const loadGroups = async () => {
        const storedGroups = await storage.getGroups();
        if (storedGroups.length === 0) {
            // Seed default groups if empty
            await storage.saveGroup({ id: 'coding', name: 'Coding', color: '#667EEA' });
            await storage.saveGroup({ id: 'writing', name: 'Writing', color: '#764BA2' });
            return loadGroups(); // Reload
        }
        setGroups(storedGroups);
    };

    const handleAddGroup = async () => {
        if (!newGroupName.trim()) {
            setIsAdding(false);
            return;
        }

        const newGroup: PromptGroup = {
            id: crypto.randomUUID(),
            name: newGroupName.trim(),
            color: '#888888' // Default color
        };

        await storage.saveGroup(newGroup);
        await loadGroups();
        setNewGroupName('');
        setIsAdding(false);
    };

    const handleDeleteGroup = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (confirm('Delete this group? Prompts will remain but lose this group association.')) {
            await storage.deleteGroup(id);
            if (selectedFilter === id) onSelectFilter('All Prompts');
            await loadGroups();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleAddGroup();
        if (e.key === 'Escape') {
            setIsAdding(false);
            setNewGroupName('');
        }
    };

    return (
        <aside className={clsx('sidebar', { 'sidebar--open': isOpen })}>
            <div className="sidebar-header">
                <h3>Groups</h3>
                <button onClick={onToggle} className="sidebar-toggle" title="Close Sidebar">
                    «
                </button>
            </div>
            <div className="sidebar-content">
                {systemGroups.map(group => (
                    <div
                        key={group}
                        className={clsx('group-item', { active: selectedFilter === group })}
                        onClick={() => onSelectFilter(group)}
                    >
                        {group}
                    </div>
                ))}

                <div className="sidebar-divider" style={{ margin: '0.5rem 0', borderTop: '1px solid rgba(0,0,0,0.05)' }}></div>

                {groups.map(group => (
                    <div
                        key={group.id}
                        className={clsx('group-item', 'group-item--custom', { active: selectedFilter === group.id })}
                        onClick={() => onSelectFilter(group.id)}
                    >
                        <span className="group-name">{group.name}</span>
                        <button
                            className="group-delete-btn"
                            onClick={(e) => handleDeleteGroup(e, group.id)}
                            title="Delete Group"
                        >
                            ×
                        </button>
                    </div>
                ))}

                {isAdding ? (
                    <div className="group-input-wrapper" style={{ padding: '0.25rem' }}>
                        <Input
                            value={newGroupName}
                            onChange={(e) => setNewGroupName(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Group Name"
                            autoFocus
                            className="group-input-field"
                        />
                    </div>
                ) : (
                    <div
                        className="group-item add-group"
                        onClick={() => setIsAdding(true)}
                    >
                        + New Group
                    </div>
                )}
            </div>
        </aside>
    );
};
