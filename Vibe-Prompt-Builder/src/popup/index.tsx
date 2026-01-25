import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { PromptList } from './components/PromptList';
import { PromptEditor } from './components/PromptEditor';
import { SettingsPanel } from './components/SettingsPanel';
import { Prompt } from '../utils/storage';
import '../styles/main.scss';

const App = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
    const [filter, setFilter] = useState('All Prompts');

    const handleCreatePrompt = () => {
        setEditingPrompt(null);
        setIsEditorOpen(true);
    };

    const handleEditPrompt = (prompt: Prompt) => {
        setEditingPrompt(prompt);
        setIsEditorOpen(true);
    };

    const handleSave = () => {
        setIsEditorOpen(false);
        // PromptList listens to storage changes content, so we just close the editor.
        setIsEditorOpen(false);
    };

    return (
        <div className="app-container">
            <Navbar
                onAdd={handleCreatePrompt}
                onSettingsClick={() => setIsSettingsOpen(true)}
                onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            />

            <div className="main-content" style={{ display: 'flex', height: 'calc(100vh - 110px)', marginTop: '10px' }}>
                <Sidebar
                    isOpen={isSidebarOpen}
                    onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
                    selectedFilter={filter}
                    onSelectFilter={(f) => setFilter(f)}
                />

                <main style={{ flex: 1, padding: '1rem', overflowY: 'auto', position: 'relative' }}>
                    {!isSidebarOpen && (
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            style={{
                                position: 'absolute',
                                left: 0,
                                top: '50%',
                                zIndex: 95,
                                padding: '10px 4px',
                                background: 'var(--glass-bg)',
                                border: 'var(--glass-border)',
                                borderRadius: '0 8px 8px 0',
                                cursor: 'pointer'
                            }}
                        >
                            »
                        </button>
                    )}

                    <div className="content-area">
                        <PromptList
                            onCreate={handleCreatePrompt}
                            onEdit={handleEditPrompt}
                            filter={filter}
                        />
                    </div>
                </main>
            </div>

            {isEditorOpen && (
                <PromptEditor
                    prompt={editingPrompt}
                    onSave={handleSave}
                    onCancel={() => setIsEditorOpen(false)}
                />
            )}

            {isSettingsOpen && (
                <SettingsPanel onClose={() => setIsSettingsOpen(false)} />
            )}
        </div>
    );
};

const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(<App />);
}
