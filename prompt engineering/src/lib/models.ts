import { type ModelProvider } from './api-keys'

export interface AIModel {
    id: string
    name: string
    provider: ModelProvider
    type: string
    description: string
}

export const ALL_MODELS: AIModel[] = [
    // Google / Gemini
    { id: 'gemini-3-flash-preview', name: 'Gemini 3 Flash (Preview)', provider: 'gemini', type: 'Speed + Reasoning', description: 'Newest Flagship, Ultra-Low Latency' },
    { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', provider: 'gemini', type: 'Complex Reasoning', description: 'Stable, High-Context, Multi-Modal' },
    { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', provider: 'gemini', type: 'High-Volume Efficiency', description: 'Cost-Effective, Fast Production' },

    // OpenAI
    { id: 'gpt-5.2', name: 'GPT-5.2', provider: 'openai', type: 'General Intelligence', description: 'Current Standard for Complex Tasks' },
    { id: 'o3-mini', name: 'o3 (Reasoning)', provider: 'openai', type: 'Deep Logic / Math', description: 'Chain of Thought, "Thinking" Model' },
    { id: 'gpt-5-mini', name: 'GPT-5 Mini', provider: 'openai', type: 'Efficient Tasks', description: 'Lightweight, Fast, Text-Heavy' },

    // Anthropic
    { id: 'claude-opus-4-20250514', name: 'Claude 4 Opus', provider: 'claude', type: 'Nuanced Writing', description: 'Highest Coherence, Human-like Flow' },
    { id: 'claude-sonnet-4-20250514', name: 'Claude 4 Sonnet', provider: 'claude', type: 'Balanced Intelligence', description: 'The "Daily Driver" for Coding/Text' },
    { id: 'claude-3-5-haiku-latest', name: 'Claude 3.5 Haiku', provider: 'claude', type: 'Instant Response', description: 'Simple Commands, Chatbots' },

    // Meta
    { id: 'llama-4-maverick-17b', name: 'Llama 4 Maverick', provider: 'meta', type: 'Open Weight Frontier', description: 'Latest Decentralized/Local Model' },
    { id: 'llama-3.3-70b-instruct', name: 'Llama 3.3 70B', provider: 'meta', type: 'Open Weight Workhorse', description: 'Reliable, efficient for self-hosting' }
]

export function getModelsByProvider(provider: ModelProvider) {
    return ALL_MODELS.filter(m => m.provider === provider)
}

export function getModelById(id: string) {
    return ALL_MODELS.find(m => m.id === id)
}
