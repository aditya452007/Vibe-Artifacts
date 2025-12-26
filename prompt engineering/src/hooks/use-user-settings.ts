import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { type ModelProvider } from '@/lib/api-keys'

interface UserSettingsState {
    apiKeys: Partial<Record<ModelProvider, string>>
    selectedModels: ModelProvider[]
    activeModels: Record<ModelProvider, string> // provider -> modelId

    setApiKey: (provider: ModelProvider, key: string) => void
    toggleModel: (provider: ModelProvider) => void
    setActiveModel: (provider: ModelProvider, modelId: string) => void
    reset: () => void
}

export const useUserSettings = create<UserSettingsState>()(
    persist(
        (set) => ({
            apiKeys: {},
            selectedModels: ['gemini'], // Default
            activeModels: {
                gemini: 'gemini-3-flash-preview',
                openai: 'gpt-5.2',
                claude: 'claude-sonnet-4-20250514',
                meta: 'llama-3.3-70b-instruct'
            },

            setApiKey: (provider, key) => set((state) => ({
                apiKeys: { ...state.apiKeys, [provider]: key }
            })),

            toggleModel: (provider) => set((state) => {
                const exists = state.selectedModels.includes(provider)
                if (exists) {
                    // Prevent removing the last one? Or allow it.
                    return { selectedModels: state.selectedModels.filter(m => m !== provider) }
                }
                return { selectedModels: [...state.selectedModels, provider] } // Limit to 4 if needed
            }),

            setActiveModel: (provider, modelId) => set((state) => ({
                activeModels: { ...state.activeModels, [provider]: modelId }
            })),

            reset: () => set({
                apiKeys: {},
                selectedModels: ['gemini'],
                activeModels: {
                    gemini: 'gemini-3-flash-preview',
                    openai: 'gpt-5.2',
                    claude: 'claude-sonnet-4-20250514',
                    meta: 'llama-3.3-70b-instruct'
                }
            })
        }),
        {
            name: 'prompt-platform-settings', // localStorage key
        }
    )
)
