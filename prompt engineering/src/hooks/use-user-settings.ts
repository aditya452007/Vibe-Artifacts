import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
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
                gemini: 'gemini-1.5-flash',
                openai: 'gpt-4o',
                claude: 'claude-3-5-sonnet-20240620',
                meta: 'llama-3.1-70b-versatile'
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
                return { selectedModels: [...state.selectedModels, provider] }
            }),

            setActiveModel: (provider, modelId) => set((state) => ({
                activeModels: { ...state.activeModels, [provider]: modelId }
            })),

            reset: () => set({
                apiKeys: {},
                selectedModels: ['gemini'],
                activeModels: {
                    gemini: 'gemini-1.5-flash',
                    openai: 'gpt-4o',
                    claude: 'claude-3-5-sonnet-20240620',
                    meta: 'llama-3.1-70b-versatile'
                }
            })
        }),
        {
            name: 'prompt-platform-settings',
            storage: createJSONStorage(() => localStorage),
        }
    )
)
