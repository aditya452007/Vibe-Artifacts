/// <reference types="chrome" />
import { generatePrompt } from './api-client';
import { AuthManager } from '../utils/auth-manager';

chrome.runtime.onInstalled.addListener(() => {
    // Initialize default settings if needed
    console.log('Prompt Builder: Service Worker Initialized');
});

interface GeneratePayload {
    context: string;
    provider?: 'openai' | 'anthropic' | 'gemini';
}

chrome.runtime.onMessage.addListener((message: any, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) => {

    // 1. Message Router
    if (message.type === 'GENERATE_PROMPT') {
        handleGeneratePrompt(message.payload, sendResponse);
        return true; // Async response
    }

    if (message.type === 'CHECK_AUTH') {
        checkAuthStatus(sendResponse);
        return true;
    }
});

/**
 * Handles the prompt generation request with validation and error handling.
 */
async function handleGeneratePrompt(payload: any, sendResponse: (response?: any) => void) {
    try {
        // 2. Validation (Native, no Zod to keep size low)
        if (!payload || typeof payload.context !== 'string' || payload.context.length < 2) {
            throw new Error('INVALID_CONTEXT: Input too short');
        }

        // 3. Auth Check & Provider Selection
        // Fetch User Preference for default provider
        const { defaultProvider } = await chrome.storage.sync.get('defaultProvider');
        const fallbackProvider = defaultProvider || 'openai';

        const validProviders = ['openai', 'anthropic', 'gemini'];
        const provider = payload.provider && validProviders.includes(payload.provider)
            ? payload.provider
            : fallbackProvider;

        const keys = await AuthManager.getKeys();
        if (!keys[provider as keyof typeof keys]) {
            sendResponse({ error: 'MISSING_API_KEY', provider });
            return;
        }

        // 4. Execution
        const result = await generatePrompt({
            context: payload.context,
            keys,
            provider
        });

        sendResponse({ result });

    } catch (error: any) {
        console.error('Generation Failed:', error);
        sendResponse({ error: error.message || 'UNKNOWN_ERROR' });
    }
}

async function checkAuthStatus(sendResponse: (response?: any) => void) {
    const keys = await AuthManager.getKeys();
    const status = {
        openai: !!keys.openai,
        anthropic: !!keys.anthropic,
        gemini: !!keys.gemini
    };
    sendResponse({ status });
}
