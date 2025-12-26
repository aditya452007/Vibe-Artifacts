'use client'

import { useState } from 'react'
import { useUserSettings } from '@/hooks/use-user-settings'
import { MODEL_CONFIGS, type ModelProvider } from '@/lib/api-keys'
import { ScrollHeader } from '@/components/layout/scroll-header'
import { motion } from 'framer-motion'
import { Send, Zap, Brain, Cpu, Network } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ModelSelector } from '@/components/chat/model-selector'

interface ChatMessage {
    id: string
    role: 'user' | 'assistant'
    content: string
    timestamp: number
    model?: ModelProvider
}

export default function Workstation() {
    const { selectedModels, apiKeys, activeModels } = useUserSettings()
    const [prompt, setPrompt] = useState('')
    const [isSending, setIsSending] = useState(false)

    // Chats state: Map of ModelID -> Messages[]
    const [chats, setChats] = useState<Record<ModelProvider, ChatMessage[]>>(() => {
        const initial: Record<ModelProvider, ChatMessage[]> = {} as Record<ModelProvider, ChatMessage[]>
        selectedModels.forEach(m => initial[m] = [])
        return initial
    })

    const getGridClass = () => {
        switch (selectedModels.length) {
            case 1: return "grid-cols-1 max-w-2xl mx-auto"
            case 2: return "grid-cols-1 md:grid-cols-2"
            default: return "grid-cols-1 md:grid-cols-2" // 3 or 4 = 2x2 roughly
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
        const promises = selectedModels.map(async (provider) => {
            const responseId = (Date.now() + Math.random()).toString()
            const activeModelId = activeModels[provider]

            // Initialize Assistant Message
            setChats(prev => ({
                ...prev,
                [provider]: [...(prev[provider] || []), { id: responseId, role: 'assistant', content: '', timestamp: Date.now(), model: provider }]
            }))

            try {
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
                        model: activeModelId,
                        apiKey: apiKeys[provider]
                    })
                })

                if (!response.body) throw new Error('No response body')

                const reader = response.body.getReader()
                const decoder = new TextDecoder()

                while (true) {
                    const { done, value } = await reader.read()
                    if (done) break
                    const text = decoder.decode(value, { stream: true })

                    setChats(prev => {
                        const modelMessages = prev[provider] || []
                        const msgIndex = modelMessages.findIndex(m => m.id === responseId)
                        if (msgIndex === -1) return prev

                        const newMsgs = [...modelMessages]
                        newMsgs[msgIndex] = {
                            ...newMsgs[msgIndex],
                            content: newMsgs[msgIndex].content + text
                        }

                        return { ...prev, [provider]: newMsgs }
                    })
                }

            } catch (err) { // eslint-disable-line @typescript-eslint/no-unused-vars
                 setChats(prev => {
                    const modelMessages = prev[provider] || []
                    const msgIndex = modelMessages.findIndex(m => m.id === responseId)
                    if (msgIndex === -1) return prev

                    const newMsgs = [...modelMessages]
                    newMsgs[msgIndex] = {
                        ...newMsgs[msgIndex],
                        content: "Error: Failed to get response."
                    }
                    return { ...prev, [provider]: newMsgs }
                })
            }
        })

        await Promise.all(promises)
        setIsSending(false)
    }

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
            <ScrollHeader showHomeButton={true} />

            {/* Main Grid Area */}
            <main className={cn(
                "flex-1 p-4 pt-24 pb-32 grid gap-6 container mx-auto h-[100vh]",
                getGridClass()
            )}>
                {selectedModels.map((modelId) => {
                    const Icon = modelId === 'gemini' ? Cpu
                        : modelId === 'openai' ? Zap
                            : modelId === 'claude' ? Brain
                                : Network
                    return (
                        <motion.div
                            key={modelId}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative flex flex-col bg-surface/40 backdrop-blur-md rounded-2xl overflow-hidden border border-border/50 shadow-sm"
                        >
                            {/* Card Header */}
                            <div className="p-4 bg-surface/50 border-b border-border/50 flex justify-between items-center backdrop-blur-sm">
                                <ModelSelector provider={modelId} />
                                <Icon className="w-4 h-4 text-canvas-subtext" />
                            </div>

                            {/* Messages Area */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
                                {chats[modelId]?.map((msg) => (
                                    <div key={msg.id} className={cn("flex gap-3", msg.role === 'user' ? "justify-end" : "justify-start")}>
                                        {msg.role === 'assistant' && (
                                            <div className="w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center shrink-0 shadow-sm">
                                                <Icon className="w-4 h-4 text-foreground/70" />
                                            </div>
                                        )}
                                        <div className={cn(
                                            "max-w-[85%] rounded-2xl p-4 text-[15px] leading-relaxed shadow-sm",
                                            msg.role === 'user'
                                                ? "bg-system-blue text-white rounded-tr-sm"
                                                : "bg-surface border border-border/50 text-foreground/90 rounded-tl-sm"
                                        )}>
                                            {msg.content}
                                        </div>
                                    </div>
                                ))}
                                {isSending && (
                                    <div className="flex gap-2 items-center text-xs text-canvas-subtext px-4">
                                        <div className="flex space-x-1">
                                            <div className="w-1.5 h-1.5 bg-canvas-subtext/50 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                                            <div className="w-1.5 h-1.5 bg-canvas-subtext/50 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                                            <div className="w-1.5 h-1.5 bg-canvas-subtext/50 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )
                })}
            </main>

            {/* Unified Input Bar (Fixed Bottom) */}
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background via-background/95 to-transparent z-50">
                <div className="max-w-3xl mx-auto">
                    <div className="relative flex items-center bg-surface/80 backdrop-blur-xl rounded-full p-2 pr-2 border border-border shadow-lg shadow-black/5">
                        <input
                            type="text"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder={`Message ${selectedModels.map(m => MODEL_CONFIGS[m].name).join(' + ')}...`}
                            className="flex-1 bg-transparent border-none focus:ring-0 text-foreground placeholder-canvas-subtext/70 px-6 py-3 text-base"
                        />
                        <button
                            onClick={handleSend}
                            disabled={isSending || !prompt.trim()}
                            className="p-3 bg-system-blue rounded-full text-white hover:bg-system-blue/90 transition-all disabled:opacity-50 disabled:hover:bg-system-blue shadow-md"
                        >
                            <Send className="w-4 h-4 translate-x-0.5" />
                        </button>
                    </div>
                    <div className="text-center mt-3 text-[11px] text-canvas-subtext/60 tracking-wide font-medium">
                        Parallel Execution Active • {selectedModels.length} Models
                    </div>
                </div>
            </div>
        </div>
    )
}
