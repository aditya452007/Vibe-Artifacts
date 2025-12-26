export type ModelProvider = 'gemini' | 'openai' | 'claude' | 'meta'

export interface AIModel {
    id: string
    name: string
    provider: ModelProvider
    type: 'Flash' | 'Pro' | 'Ultra' | 'Reasoning' | 'Standard'
    contextWindow: number
}

// Master List of Models
export const ALL_MODELS: AIModel[] = [
    // Google
    { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', provider: 'gemini', type: 'Flash', contextWindow: 1000000 },
    { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', provider: 'gemini', type: 'Pro', contextWindow: 2000000 },

    // OpenAI
    { id: 'gpt-4o', name: 'GPT-4o', provider: 'openai', type: 'Standard', contextWindow: 128000 },
    { id: 'gpt-4o-mini', name: 'GPT-4o Mini', provider: 'openai', type: 'Flash', contextWindow: 128000 },
    { id: 'o1-preview', name: 'o1 Preview', provider: 'openai', type: 'Reasoning', contextWindow: 128000 },

    // Anthropic
    { id: 'claude-3-5-sonnet-20240620', name: 'Claude 3.5 Sonnet', provider: 'claude', type: 'Pro', contextWindow: 200000 },
    { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus', provider: 'claude', type: 'Reasoning', contextWindow: 200000 },

    // Meta (Llama) - Handled via Groq or similar usually, but keeping ID for now
    { id: 'llama-3.1-70b-versatile', name: 'Llama 3.1 70B', provider: 'meta', type: 'Pro', contextWindow: 128000 },
    { id: 'llama-3.1-8b-instant', name: 'Llama 3.1 8B', provider: 'meta', type: 'Flash', contextWindow: 128000 },
]

export const getModelsByProvider = (provider: ModelProvider) => {
    return ALL_MODELS.filter(m => m.provider === provider)
}
