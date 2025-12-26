'use client'

import { useState } from 'react'
import { Check, ChevronDown, Cpu, Zap, Brain, Network } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { type ModelProvider } from '@/lib/api-keys'
import { getModelsByProvider } from '@/lib/models'
import { useUserSettings } from '@/hooks/use-user-settings'

interface ModelSelectorProps {
    provider: ModelProvider
}

export function ModelSelector({ provider }: ModelSelectorProps) {
    const { activeModels, setActiveModel } = useUserSettings()
    const [isOpen, setIsOpen] = useState(false)

    const models = getModelsByProvider(provider)
    const currentModelId = activeModels[provider]
    const currentModel = models.find(m => m.id === currentModelId) || models[0]

    // Icon mapping
    const Icon = provider === 'gemini' ? Cpu
        : provider === 'openai' ? Zap
            : provider === 'claude' ? Brain
                : Network

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 bg-black/20 hover:bg-white/5 border border-white/5 hover:border-white/10 rounded-lg px-3 py-1.5 transition-colors group"
            >
                <div className={cn(
                    "w-4 h-4 rounded-full flex items-center justify-center bg-white/5",
                    provider === 'gemini' ? "text-neon-cyan" :
                        provider === 'openai' ? "text-emerald-400" :
                            provider === 'claude' ? "text-purple-400" : "text-blue-400"
                )}>
                    <Icon className="w-3 h-3" />
                </div>
                <div className="text-left">
                    <div className="text-[10px] text-gray-500 font-mono leading-none tracking-wider uppercase mb-0.5">
                        {provider}
                    </div>
                    <div className="text-xs text-white font-medium leading-none truncate max-w-[120px]">
                        {currentModel?.name || 'Select Model'}
                    </div>
                </div>
                <ChevronDown className="w-3 h-3 text-gray-500 ml-1 group-hover:text-white transition-colors" />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 5, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 5, scale: 0.95 }}
                            className="absolute top-full left-0 mt-2 w-64 z-50 bg-[#0A0A0A] border border-white/10 rounded-xl shadow-2xl overflow-hidden backdrop-blur-xl"
                        >
                            <div className="p-1 max-h-[240px] overflow-y-auto custom-scrollbar">
                                {models.map((model) => (
                                    <button
                                        key={model.id}
                                        onClick={() => {
                                            setActiveModel(provider, model.id)
                                            setIsOpen(false)
                                        }}
                                        className={cn(
                                            "w-full text-left p-2 rounded-lg flex items-start gap-3 transition-colors hover:bg-white/5 group",
                                            currentModelId === model.id ? "bg-white/5" : ""
                                        )}
                                    >
                                        <div className={cn(
                                            "mt-1 w-3 h-3 rounded-full border border-white/20 flex items-center justify-center shrink-0",
                                            currentModelId === model.id
                                                ? (provider === 'gemini' ? "border-neon-cyan bg-neon-cyan" :
                                                    provider === 'openai' ? "border-emerald-400 bg-emerald-400" :
                                                        provider === 'claude' ? "border-purple-400 bg-purple-400" : "border-blue-400 bg-blue-400")
                                                : "group-hover:border-white/40"
                                        )}>
                                            {currentModelId === model.id && <Check className="w-2 h-2 text-black" />}
                                        </div>
                                        <div>
                                            <div className="text-xs font-semibold text-gray-200 group-hover:text-white">
                                                {model.name}
                                            </div>
                                            <div className="text-[10px] text-gray-500 mt-0.5">
                                                {model.type}
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}
