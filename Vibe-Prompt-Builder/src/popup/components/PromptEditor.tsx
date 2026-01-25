import React, { useState, useEffect } from 'react';
import { Prompt, storage } from '../../utils/storage';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import '../styles/components.scss';

interface PromptEditorProps {
    prompt?: Prompt | null;
    onSave: () => void;
    onCancel: () => void;
}

export const PromptEditor: React.FC<PromptEditorProps> = ({ prompt, onSave, onCancel }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (prompt) {
            setTitle(prompt.title);
            setContent(prompt.content);
            setTags(prompt.tags.join(', '));
        }
    }, [prompt]);

    const handleSave = async () => {
        if (!title.trim() || !content.trim()) return;

        setIsSaving(true);
        const newPrompt: Prompt = {
            id: prompt?.id || crypto.randomUUID(),
            title,
            content,
            tags: tags.split(',').map(t => t.trim()).filter(Boolean),
            groupId: prompt?.groupId,
            createdAt: prompt?.createdAt || Date.now(),
            modifiedAt: Date.now()
        };

        await storage.savePrompt(newPrompt);
        setIsSaving(false);
        onSave();
    };

    return (
        <div className="prompt-editor-overlay glass-panel">
            <div className="editor-container">
                <header className="editor-header">
                    <h2>{prompt ? 'Edit Prompt' : 'New Prompt'}</h2>
                    <Button variant="ghost" onClick={onCancel}>✕</Button>
                </header>

                <div className="editor-body">
                    <Input
                        label="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g., Coding Assistant"
                        autoFocus
                    />

                    <div className="input-group">
                        <label className="input-label">Prompt Content</label>
                        <textarea
                            className="input-field editor-textarea"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Enter your prompt here... Use {{variable}} for dynamic placeholders."
                            rows={10}
                        />
                    </div>

                    <Input
                        label="Tags (comma separated)"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        placeholder="coding, writing, email"
                    />
                </div>

                <footer className="editor-footer">
                    <Button variant="ghost" onClick={onCancel}>Cancel</Button>
                    <Button variant="primary" onClick={handleSave} isLoading={isSaving} disabled={!title || !content}>
                        Save Prompt
                    </Button>
                </footer>
            </div>
        </div>
    );
};
