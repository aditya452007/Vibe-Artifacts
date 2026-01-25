/// <reference types="chrome" />
import React, { useState, useEffect } from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { AuthManager, ApiKeys } from '../../utils/auth-manager';
import '../styles/components.scss';

interface SettingsPanelProps {
    onClose: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ onClose }) => {
    const [keys, setKeys] = useState<ApiKeys>({ openai: '', anthropic: '', gemini: '' });
    const [defaultProvider, setDefaultProvider] = useState('openai');
    const [isSaving, setIsSaving] = useState(false);
    const [statusMsg, setStatusMsg] = useState('');

    useEffect(() => {
        // Load keys and preferences
        const loadData = async () => {
            const storedKeys = await AuthManager.getKeys();
            setKeys({
                openai: storedKeys.openai || '',
                anthropic: storedKeys.anthropic || '',
                gemini: storedKeys.gemini || ''
            });

            chrome.storage.sync.get(['defaultProvider'], (result) => {
                if (result.defaultProvider) {
                    setDefaultProvider(result.defaultProvider);
                }
            });
        };
        loadData();
    }, []);

    const handleChange = (provider: keyof ApiKeys, value: string) => {
        setKeys(prev => ({ ...prev, [provider]: value }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        setStatusMsg('');

        try {
            await AuthManager.saveKeys(keys);
            await chrome.storage.sync.set({ defaultProvider });

            setStatusMsg('Settings saved successfully!');
            setTimeout(() => onClose(), 1000);
        } catch (err) {
            console.error(err);
            setStatusMsg('Failed to save settings.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="prompt-editor-overlay glass-panel">
            <div className="editor-container" style={{ maxWidth: '500px' }}>
                <header className="editor-header">
                    <h2>Settings</h2>
                    <Button variant="ghost" onClick={onClose}>✕</Button>
                </header>

                <div className="editor-body" style={{ gap: '1.5rem' }}>

                    <section>
                        <h4 style={{ marginBottom: '1rem', color: '#666' }}>API Configuration</h4>

                        <Input
                            type="password"
                            label="OpenAI API Key"
                            value={keys.openai || ''}
                            onChange={(e) => handleChange('openai', e.target.value)}
                            placeholder="sk-..."
                        />

                        <div style={{ height: '10px' }}></div>

                        <Input
                            type="password"
                            label="Anthropic API Key"
                            value={keys.anthropic || ''}
                            onChange={(e) => handleChange('anthropic', e.target.value)}
                            placeholder="sk-ant-..."
                        />

                        <div style={{ height: '10px' }}></div>

                        <Input
                            type="password"
                            label="Google Gemini API Key"
                            value={keys.gemini || ''}
                            onChange={(e) => handleChange('gemini', e.target.value)}
                            placeholder="AIza..."
                        />
                    </section>

                    <section>
                        <h4 style={{ marginBottom: '0.5rem', color: '#666' }}>Preferences</h4>
                        <div className="input-group">
                            <label className="input-label">Default Provider</label>
                            <select
                                className="input-field"
                                value={defaultProvider}
                                onChange={(e) => setDefaultProvider(e.target.value)}
                            >
                                <option value="openai">OpenAI (GPT-5.2)</option>
                                <option value="anthropic">Anthropic (Sonnet 4.5)</option>
                                <option value="gemini">Google Gemini 2.5 Flash</option>
                            </select>
                        </div>
                    </section>

                    {statusMsg && (
                        <div style={{
                            padding: '8px',
                            borderRadius: '4px',
                            backgroundColor: statusMsg.includes('Failed') ? '#fee2e2' : '#dcfce7',
                            color: statusMsg.includes('Failed') ? '#991b1b' : '#166534',
                            fontSize: '0.9rem',
                            textAlign: 'center'
                        }}>
                            {statusMsg}
                        </div>
                    )}
                </div>

                <footer className="editor-footer">
                    <Button variant="ghost" onClick={onClose}>Cancel</Button>
                    <Button variant="primary" onClick={handleSave} isLoading={isSaving}>
                        Save Configuration
                    </Button>
                </footer>
            </div>
        </div>
    );
};
