import React, { useEffect, useState } from 'react';
import { storage, Prompt } from '../../utils/storage';
import { PromptCard } from './PromptCard';
import { Button } from './ui/Button';

interface PromptListProps {
    onCreate?: () => void;
    onEdit?: (prompt: Prompt) => void;
    filter: string;
}

export const PromptList: React.FC<PromptListProps> = ({ onCreate, onEdit, filter }) => {
    const [prompts, setPrompts] = useState<Prompt[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPrompts();
    }, [filter]); // Reload when filter changes (or just filter client-side if small data)

    // Listen for storage changes to update list real-time
    useEffect(() => {
        const handleStorageChange = () => loadPrompts();
        chrome.storage.onChanged.addListener(handleStorageChange);
        return () => chrome.storage.onChanged.removeListener(handleStorageChange);
    }, []);

    const loadPrompts = async () => {
        setLoading(true);
        const data = await storage.getPrompts();
        setPrompts(data);
        setLoading(false);
    };

    const handleCopy = (content: string) => {
        navigator.clipboard.writeText(content);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this prompt?')) {
            await storage.deletePrompt(id);
            // loadPrompts will be triggered by storage listener
        }
    };

    const handleEdit = (prompt: Prompt) => {
        if (onEdit) onEdit(prompt);
    };

    const handleToggleFavorite = async (id: string) => {
        const prompt = prompts.find(p => p.id === id);
        if (prompt) {
            await storage.savePrompt({ ...prompt, isFavorite: !prompt.isFavorite });
        }
    };

    const filteredPrompts = prompts.filter(p => {
        if (filter === 'All Prompts') return true;
        if (filter === 'Favorites') return p.isFavorite;
        // Check tags or groups for other filters
        return p.tags.some(tag => tag.toLowerCase() === filter.toLowerCase()) || p.groupId === filter;
    });

    if (loading) {
        return <div className="loading-state">Loading prompts...</div>;
    }

    if (filteredPrompts.length === 0) {
        return (
            <div className="empty-state">
                <div className="empty-state-icon">📝</div>
                <h3>No Prompts in "{filter}"</h3>
                <p>Create a new prompt to populate this list.</p>
                <Button onClick={onCreate}>Create Prompt</Button>
            </div>
        );
    }

    return (
        <div className="prompt-grid">
            {filteredPrompts.map(prompt => (
                <PromptCard
                    key={prompt.id}
                    prompt={prompt}
                    onCopy={handleCopy}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                    onToggleFavorite={handleToggleFavorite}
                />
            ))}
        </div>
    );
};
