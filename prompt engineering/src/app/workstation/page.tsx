'use client'

import { useState } from 'react'
import { useUserSettings } from '@/hooks/use-user-settings'
import { MODEL_CONFIGS, type ModelProvider } from '@/lib/api-keys'
import { ScrollHeader } from '@/components/layout/scroll-header'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot, User, Maximize2, Zap, Brain, Cpu, Network } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChatMessage {
    id: string
    role: 'user' | 'assistant'
    content: string
    timestamp: number
    model?: ModelProvider
}

import { ModelSelector } from '@/components/chat/model-selector'

// ... (imports remain)

export default function Workstation() {
    const { selectedModels, apiKeys, activeModels } = useUserSettings()
    const [prompt, setPrompt] = useState('')
    const [isSending, setIsSending] = useState(false)

    // Chats state: Map of ModelID -> Messages[]
    const [chats, setChats] = useState<Record<ModelProvider, ChatMessage[]>>(() => {
        const initial: any = {}
        selectedModels.forEach(m => initial[m] = [])
        return initial
    })

    const getGridClass = () => {
        switch (selectedModels.length) {
            case 1: return "grid-cols-1"
            case 2: return "grid-cols-1 md:grid-cols-2"
            default: return "grid-cols-1 md:grid-cols-2" // 3 or 4 = 2x2 roughly
        }
    }

    // Helper to simulate streaming
    const streamResponse = async (modelId: ModelProvider, fullText: string, messageId: string) => {
        const tokens = fullText.split(/(?=[ \n])/) // Split by words/spaces roughly

        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i]
            const delay = Math.random() * 30 + 10 // Random delay 10-40ms per token
            await new Promise(r => setTimeout(r, delay))

            setChats(prev => {
                const modelMessages = prev[modelId] || []
                const msgIndex = modelMessages.findIndex(m => m.id === messageId)

                if (msgIndex === -1) return prev // Should not happen

                const updatedMsg = {
                    ...modelMessages[msgIndex],
                    content: modelMessages[msgIndex].content + token
                }

                const newModelMessages = [...modelMessages]
                newModelMessages[msgIndex] = updatedMsg

                return {
                    ...prev,
                    [modelId]: newModelMessages
                }
            })
        }
    }

    const handleSend = async () => {
        if (!prompt.trim() || isSending) return

        const userMsg: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: prompt,
            timestamp: Date.now()
        }

        setIsSending(true)
        const currentPrompt = prompt
        setPrompt('') // Clear input

        // 1. Add User Message to ALL models
        setChats(prev => {
            const next = { ...prev }
            selectedModels.forEach(m => {
                next[m] = [...(next[m] || []), userMsg]
            })
            return next
        })

        // 2. Parallel Streaming Requests
        const promises = selectedModels.map(async (provider) => { // Rename model -> provider for clarity
            const responseId = (Date.now() + Math.random()).toString()
            const activeModelId = activeModels[provider] // Get specific model ID

            // Initialize Assistant Message
            setChats(prev => ({
                ...prev,
                [provider]: [...prev[provider], { id: responseId, role: 'assistant', content: '', timestamp: Date.now(), model: provider }]
            }))

            try {
                // Prepare context for this model
                const modelMessages = chats[provider] || []
                const messagesToSend = [
                    ...modelMessages.map(m => ({ role: m.role, content: m.content })),
                    { role: 'user', content: currentPrompt }
                ]

                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        messages: messagesToSend,
                        model: activeModelId, // SEND SPECIFIC ID
                        apiKey: apiKeys[provider]
                    })
                })

                if (!response.body) throw new Error('No response body')
                // ... (streaming logic same)
            } catch (err) {
                // ... (error handling same)
            }
        })

        await Promise.all(promises)
        setIsSending(false)
    }

    return (
        <div className="min-h-screen bg-void text-foreground flex flex-col font-sans">
            <ScrollHeader showHomeButton={true} />

            {/* Main Grid Area */}
            <main className={cn(
                "flex-1 p-4 pt-24 pb-32 grid gap-4 container mx-auto h-[100vh]",
                getGridClass()
            )}>
                {selectedModels.map((modelId) => {
                    // Icon Mapping
                    const Icon = modelId === 'gemini' ? Cpu
                        : modelId === 'openai' ? Zap
                            : modelId === 'claude' ? Brain
                                : Network
                    return (
                        <motion.div
                            key={modelId}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative flex flex-col bg-void-surface/50 glass rounded-xl overflow-hidden border-t-2 border-white/5"
                            style={{
                                borderColor: modelId === 'gemini' ? '#00ffff' :
                                    modelId === 'claude' ? '#d946ef' :
                                        modelId === 'openai' ? '#10a37f' : '#2563eb'
                            }}
                        >
                            {/* Card Header */}
                            <div className="p-3 bg-black/20 flex justify-between items-center border-b border-white/5">
                                <ModelSelector provider={modelId} />
                                <div className="flex gap-2">
                                    {/* Action buttons could go here */}
                                </div>
                            </div>

                            {/* Messages Area */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                                {chats[modelId]?.map((msg) => (
                                    <div key={msg.id} className={cn("flex gap-3", msg.role === 'user' ? "justify-end" : "justify-start")}>
                                        {msg.role === 'assistant' && (
                                            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-1">
                                                <Icon className="w-3 h-3 text-neon-cyan" />
                                            </div>
                                        )}
                                        <div className={cn(
                                            "max-w-[85%] rounded-lg p-3 text-sm leading-relaxed",
                                            msg.role === 'user'
                                                ? "bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20 rounded-tr-none"
                                                : "bg-white/5 text-gray-300 border border-white/10 rounded-tl-none"
                                        )}>
                                            {msg.content}
                                        </div>
                                    </div>
                                ))}
                                {isSending && (
                                    <div className="flex gap-2 items-center text-xs text-gray-500 animate-pulse">
                                        <Icon className="w-3 h-3" />
                                        Thinking...
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )
                })}
            </main>

            {/* Unified Input Bar (Fixed Bottom) */}
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-void via-void to-transparent z-50">
                <div className="max-w-3xl mx-auto relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-neon-cyan via-purple-500 to-neon-magenta rounded-lg opacity-20 group-hover:opacity-50 blur transition duration-500" />
                    <div className="relative flex items-center bg-void-surface glass-heavy rounded-lg p-2 pr-4 border border-white/10">
                        <input
                            type="text"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder={`Message ${selectedModels.map(m => MODEL_CONFIGS[m].name).join(' + ')}...`}
                            className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-gray-500 px-4 py-2 font-mono text-sm"
                        />
                        <button
                            onClick={handleSend}
                            disabled={isSending}
                            className="p-2 bg-neon-cyan/10 rounded-md text-neon-cyan hover:bg-neon-cyan hover:text-black transition-colors disabled:opacity-50"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="text-center mt-2 text-[10px] text-gray-600 font-mono">
                        PARALLEL EXECUTION MODE ACTIVE • {selectedModels.length} THREADS
                    </div>
                </div>
            </div>
        </div>
    )
}
