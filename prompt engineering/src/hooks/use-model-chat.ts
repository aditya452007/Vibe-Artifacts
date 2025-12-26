import { create } from 'zustand'

export type ModelId = 'gemini-3-pro-preview' | 'gemini-2.5-pro' | 'gemini-2.5-flash' | 'gpt-4o' | 'claude-3-opus'

export const AVAILABLE_MODELS: { id: ModelId; name: string; color: string }[] = [
    { id: 'gemini-3-pro-preview', name: 'Gemini 3 Pro', color: '#00ffff' }, // Cyan
    { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', color: '#0EA5E9' }, // Sky Blue
    { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', color: '#F59E0B' }, // Amber
    { id: 'gpt-4o', name: 'GPT-4o', color: '#10a37f' }, // OpenAI Green
    { id: 'claude-3-opus', name: 'Claude 3 Opus', color: '#d946ef' }, // Magenta
]

interface Message {
    role: 'user' | 'assistant'
    content: string
    timestamp: number
}

interface ChatState {
    selectedModels: ModelId[]
    // Messages are grouped by model ID
    messages: Record<ModelId, Message[]>
    isGenerating: boolean

    // Actions
    toggleModel: (id: ModelId) => void
    sendMessage: (prompt: string) => Promise<void>
    clearChat: () => void
}

const mockGenerate = async (model: ModelId, prompt: string): Promise<string> => {
    const latency = 1000 + Math.random() * 2000
    await new Promise(resolve => setTimeout(resolve, latency))

    const responses: Record<ModelId, string> = {
        'gemini-3-pro-preview': `[GEMINI 3 PRO] Reasoning:\nBased on your prompt "${prompt}", I suggest a multi-modal approach. The query implies a need for structural understanding.`,
        'gemini-2.5-pro': `[GEMINI 2.5 PRO] Analysis:\nHere is a detailed breakdown for "${prompt}".`,
        'gemini-2.5-flash': `[GEMINI 2.5 FLASH] Speed Response:\nQuick answer for "${prompt}".`,
        'gpt-4o': `[GPT] Response:\nHere is the optimized completion for: "${prompt}".\n\n1. Context verified.\n2. Logic applied.`,
        'claude-3-opus': `[CLAUDE] Insight:\nI've analyzed the nuance in "${prompt}". It seems you are looking for a creative yet constrained output. Here is my perspective...`
    }

    return responses[model]
}

export const useModelChat = create<ChatState>((set, get) => ({
    selectedModels: ['gemini-3-pro-preview', 'gpt-4o'], // Default active
    messages: {
        'gemini-3-pro-preview': [],
        'gemini-2.5-pro': [],
        'gemini-2.5-flash': [],
        'gpt-4o': [],
        'claude-3-opus': []
    },
    isGenerating: false,

    toggleModel: (id) => set(state => {
        // Don't allow empty selection? Or maybe yes.
        const exists = state.selectedModels.includes(id)
        if (exists) {
            // If it's the last one, maybe keep it? keeping it simple for now
            return { selectedModels: state.selectedModels.filter(m => m !== id) }
        }
        return { selectedModels: [...state.selectedModels, id] }
    }),

    sendMessage: async (prompt) => {
        if (!prompt.trim()) return

        set({ isGenerating: true })
        const { selectedModels, messages } = get()
        const now = Date.now()

        // 1. Optimistic Update: Add User Message to ALL active models
        const nextMessages = { ...messages }
        selectedModels.forEach(m => {
            nextMessages[m] = [
                ...nextMessages[m],
                { role: 'user', content: prompt, timestamp: now }
            ]
        })
        set({ messages: nextMessages })

        // 2. Fetch from APIS (Mocked Parallel)
        await Promise.all(selectedModels.map(async (model) => {
            try {
                const response = await mockGenerate(model, prompt)

                set(state => ({
                    messages: {
                        ...state.messages,
                        [model]: [
                            ...state.messages[model],
                            { role: 'assistant', content: response, timestamp: Date.now() }
                        ]
                    }
                }))
            } catch (error) {
                console.error(`Error fetching ${model}`, error)
                set(state => ({
                    messages: {
                        ...state.messages,
                        [model]: [
                            ...state.messages[model],
                            { role: 'assistant', content: "Error generating response.", timestamp: Date.now() }
                        ]
                    }
                }))
            }
        }))

        set({ isGenerating: false })
    },

    clearChat: () => set({
        messages: { 'gemini-3-pro-preview': [], 'gemini-2.5-pro': [], 'gemini-2.5-flash': [], 'gpt-4o': [], 'claude-3-opus': [] }
    })
}))
