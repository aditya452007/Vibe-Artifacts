import React from 'react';
import { Prompt } from '../../utils/storage';
import { Button } from './ui/Button';
import '../styles/components.scss';

interface PromptCardProps {
    prompt: Prompt;
    onEdit: (prompt: Prompt) => void;
    onDelete: (id: string) => void;
    onCopy: (content: string) => void;
    onToggleFavorite: (id: string) => void;
}

export const PromptCard: React.FC<PromptCardProps> = ({ prompt, onEdit, onDelete, onCopy, onToggleFavorite }) => {
    return (
        <div className="prompt-card glass-panel">
            <div className="prompt-card-header">
                <h3 className="prompt-title" title={prompt.title}>{prompt.title}</h3>
                <div className="prompt-tags">
                    {prompt.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="tag-chip">{tag}</span>
                    ))}
                    {prompt.tags.length > 3 && <span className="tag-chip">+{prompt.tags.length - 3}</span>}
                </div>
            </div>
            <div className="prompt-card-body">
                <p className="prompt-preview">
                    {prompt.content.length > 100
                        ? prompt.content.substring(0, 100) + '...'
                        : prompt.content}
                </p>
            </div>
            <div className="prompt-card-footer">
                <div className="prompt-meta">
                    {new Date(prompt.modifiedAt).toLocaleDateString()}
                </div>
                <div className="prompt-actions">
                    <Button variant="ghost" size="sm" onClick={() => onToggleFavorite(prompt.id)} title={prompt.isFavorite ? "Unfavorite" : "Favorite"}>
                        {prompt.isFavorite ? '❤️' : '🤍'}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onCopy(prompt.content)} title="Copy">
                        📋
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onEdit(prompt)} title="Edit">
                        ✏️
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onDelete(prompt.id)} title="Delete">
                        🗑️
                    </Button>
                </div>
            </div>
        </div>
    );
};
