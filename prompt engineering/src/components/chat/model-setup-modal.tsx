'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Check, AlertCircle, Cpu, Key, Zap, Brain, Network } from 'lucide-react'
import { useUserSettings } from '@/hooks/use-user-settings'
import { MODEL_CONFIGS, validateApiKey, type ModelProvider } from '@/lib/api-keys'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'

export function ModelSetupModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const router = useRouter()
    const { apiKeys, selectedModels, toggleModel, setApiKey } = useUserSettings()
    const [error, setError] = useState<string | null>(null)

    const handleLaunch = () => {
        // Validate that ALL selected models have keys
        const missingKeys = selectedModels.filter(m => !apiKeys[m] || !validateApiKey(m, apiKeys[m]!))

        if (missingKeys.length > 0) {
            setError(`Missing or invalid API keys for: ${missingKeys.map(k => MODEL_CONFIGS[k].name).join(', ')}`)
            return
        }

        onClose()
        router.push('/workstation')
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-background/60 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 10 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 10 }}
                        transition={{ type: "spring", stiffness: 350, damping: 25 }}
                        className="relative w-full max-w-2xl bg-surface glass shadow-2xl rounded-2xl p-8 border border-border overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-xl font-semibold text-foreground mb-1">Initialize Inference Engine</h2>
                                <p className="text-canvas-subtext text-sm">Select active modules and verify credentials.</p>
                            </div>
                            <button onClick={onClose} className="p-1.5 hover:bg-foreground/5 rounded-full transition-colors">
                                <X className="w-5 h-5 text-canvas-subtext" />
                            </button>
                        </div>

                        {/* Model Selection Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                            {(Object.keys(MODEL_CONFIGS) as ModelProvider[]).map((id) => {
                                const isSelected = selectedModels.includes(id)

                                // Icon mapping
                                const Icon = id === 'gemini' ? Cpu
                                    : id === 'openai' ? Zap
                                        : id === 'claude' ? Brain
                                            : Network

                                return (
                                    <button
                                        key={id}
                                        onClick={() => toggleModel(id)}
                                        className={cn(
                                            "relative p-4 rounded-xl border transition-all duration-200 flex flex-col items-center gap-2.5 text-center",
                                            "hover:bg-foreground/5 active:scale-98",
                                            isSelected
                                                ? "bg-foreground/5 border-system-blue shadow-sm ring-1 ring-system-blue/20"
                                                : "bg-surface border-border text-canvas-subtext hover:border-foreground/20"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                                            isSelected ? "text-system-blue bg-system-blue/10" : "text-canvas-subtext bg-foreground/5"
                                        )}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <span className={cn("text-[10px] font-medium tracking-wide uppercase", isSelected ? "text-foreground" : "")}>
                                            {MODEL_CONFIGS[id].name}
                                        </span>
                                    </button>
                                )
                            })}
                        </div>
                        {/* API Key Inputs for Selected Models */}
                        <div className="space-y-3 mb-6 max-h-[280px] overflow-y-auto pr-2 no-scrollbar">
                            <AnimatePresence>
                                {selectedModels.map(id => (
                                    <motion.div
                                        key={id}
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="bg-foreground/5 rounded-lg p-3 border border-border/50">
                                            <div className="flex justify-between items-center mb-1.5">
                                                <label className="text-[10px] font-semibold text-foreground uppercase tracking-wider">{MODEL_CONFIGS[id].name} API KEY</label>
                                                {apiKeys[id] && validateApiKey(id, apiKeys[id]!) && (
                                                    <span className="flex items-center gap-1 text-[10px] text-green-500 font-medium">
                                                        <Check className="w-3 h-3" /> VERIFIED
                                                    </span>
                                                )}
                                            </div>
                                            <div className="relative">
                                                <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-canvas-subtext" />
                                                <input
                                                    type="password"
                                                    value={apiKeys[id] || ''}
                                                    onChange={(e) => setApiKey(id, e.target.value)}
                                                    placeholder={`Paste ${MODEL_CONFIGS[id].name} Key...`}
                                                    className="w-full bg-surface border border-border rounded-md py-2 pl-9 pr-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-system-blue/20 focus:border-system-blue transition-all font-mono placeholder:text-canvas-subtext/50"
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            {selectedModels.length === 0 && (
                                <div className="text-center py-6 text-canvas-subtext text-sm">Select a model above to begin configuration.</div>
                            )}
                        </div>

                        {/* Footer / Error */}
                        {error && (
                            <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="mb-4 text-xs text-red-500 font-medium flex items-center gap-2 bg-red-500/10 border border-red-500/20 p-2.5 rounded-lg">
                                <AlertCircle className="w-4 h-4" />
                                {error}
                            </motion.div>
                        )}

                        <button
                            onClick={handleLaunch}
                            disabled={selectedModels.length === 0}
                            className="w-full py-3.5 bg-foreground text-background font-medium text-sm tracking-wide hover:bg-foreground/90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-lg shadow-black/5"
                        >
                            Launch Workstation
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
