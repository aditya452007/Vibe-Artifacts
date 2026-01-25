import { ApiKeys } from '../utils/auth-manager';

interface GenerateOptions {
    context: string;
    keys: ApiKeys;
    provider?: keyof ApiKeys;
}

const SYSTEM_PROMPT = `
You are an expert Prompt Engineer. 
Your goal is to optimize the user's raw input into a professional, high-fidelity prompt.
Return ONLY the improved prompt, no conversational filler.
`;

export const generatePrompt = async ({ context, keys, provider = 'openai' }: GenerateOptions): Promise<string> => {
    if (!keys[provider]) {
        throw new Error(`MISSING_KEY:${provider}`);
    }

    const apiKey = keys[provider]!;

    try {
        switch (provider) {
            case 'openai':
                return await callOpenAI(context, apiKey);
            case 'anthropic':
                return await callAnthropic(context, apiKey);
            case 'gemini':
                return await callGemini(context, apiKey);
            default:
                throw new Error('Unsupported provider');
        }
    } catch (error: any) {
        console.error('API Call Failed:', error);
        throw new Error(error.message || 'API_ERROR');
    }
};

async function callOpenAI(context: string, key: string): Promise<string> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${key}`
        },
        body: JSON.stringify({
            model: 'gpt-5.2', // 2026 Flagship
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                { role: 'user', content: context }
            ],
            temperature: 0.7
        })
    });

    if (!response.ok) {
        const err = await response.json();
        throw new Error(`OpenAI Error: ${err.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '';
}

async function callAnthropic(context: string, key: string): Promise<string> {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'x-api-key': key,
            'anthropic-version': '2023-06-01',
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            model: 'claude-4.5-sonnet', // 2026 Update
            max_tokens: 1024,
            system: SYSTEM_PROMPT,
            messages: [
                { role: 'user', content: context }
            ]
        })
    });

    if (!response.ok) {
        const err = await response.json();
        throw new Error(`Anthropic Error: ${err.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return data.content[0]?.text || '';
}

async function callGemini(context: string, key: string): Promise<string> {
    // Gemini 2.5 Flash
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            contents: [{
                parts: [{ text: `${SYSTEM_PROMPT}\n\nUser Input: ${context}` }]
            }]
        })
    });

    if (!response.ok) {
        const err = await response.json();
        throw new Error(`Gemini Error: ${err.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}
