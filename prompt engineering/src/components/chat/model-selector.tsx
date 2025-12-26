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
                className="flex items-center gap-2 bg-surface hover:bg-surface/80 border border-border/50 rounded-lg px-3 py-1.5 transition-all active:scale-95 group shadow-sm"
            >
                <div className={cn(
                    "w-5 h-5 rounded-full flex items-center justify-center bg-foreground/5",
                    provider === 'gemini' ? "text-blue-500" :
                        provider === 'openai' ? "text-green-500" :
                            provider === 'claude' ? "text-purple-500" : "text-orange-500"
                )}>
                    <Icon className="w-3 h-3" />
                </div>
                <div className="text-left">
                    <div className="text-[10px] text-canvas-subtext font-medium leading-none tracking-wide uppercase mb-0.5">
                        {provider}
                    </div>
                    <div className="text-xs text-foreground font-semibold leading-none truncate max-w-[120px]">
                        {currentModel?.name || 'Select Model'}
                    </div>
                </div>
                <ChevronDown className="w-3 h-3 text-canvas-subtext ml-1 group-hover:text-foreground transition-colors" />
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
                            transition={{ duration: 0.15 }}
                            className="absolute top-full left-0 mt-2 w-64 z-50 bg-surface/90 border border-border/50 rounded-xl shadow-xl overflow-hidden backdrop-blur-xl ring-1 ring-black/5"
                        >
                            <div className="p-1 max-h-[240px] overflow-y-auto no-scrollbar">
                                {models.map((model) => (
                                    <button
                                        key={model.id}
                                        onClick={() => {
                                            setActiveModel(provider, model.id)
                                            setIsOpen(false)
                                        }}
                                        className={cn(
                                            "w-full text-left p-2.5 rounded-lg flex items-start gap-3 transition-colors hover:bg-foreground/5 group",
                                            currentModelId === model.id ? "bg-foreground/5" : ""
                                        )}
                                    >
                                        <div className={cn(
                                            "mt-0.5 w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0",
                                            currentModelId === model.id
                                                ? "border-system-blue bg-system-blue"
                                                : "border-border"
                                        )}>
                                            {currentModelId === model.id && <Check className="w-2.5 h-2.5 text-white" />}
                                        </div>
                                        <div>
                                            <div className="text-[13px] font-medium text-foreground">
                                                {model.name}
                                            </div>
                                            <div className="text-[11px] text-canvas-subtext mt-0.5">
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
