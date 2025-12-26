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
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-2xl bg-void-surface/90 glass-heavy rounded-2xl p-8 border border-white/10 shadow-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-2">Initialize Inference Engine</h2>
                                <p className="text-gray-400 text-sm">Select active modules and verify credentials.</p>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>

                        {/* Model Selection Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            {(Object.keys(MODEL_CONFIGS) as ModelProvider[]).map((id) => {
                                const isSelected = selectedModels.includes(id)

                                // Icon mapping
                                const Icon = id === 'gemini' ? Cpu // Using generic icons for now as Lucide doesn't have brand icons, but styling them distinctively
                                    : id === 'openai' ? Zap
                                        : id === 'claude' ? Brain
                                            : Network

                                return (
                                    <button
                                        key={id}
                                        onClick={() => toggleModel(id)}
                                        className={cn(
                                            "relative p-4 rounded-xl border transition-all duration-200 flex flex-col items-center gap-3 text-center",
                                            "hover:bg-white/5 active:scale-95", // Subtle interaction only
                                            isSelected
                                                ? "bg-white/5 border-neon-cyan/50 shadow-[0_0_20px_rgba(0,255,255,0.15)]"
                                                : "bg-transparent border-white/10 text-gray-500 hover:border-white/20"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-12 h-12 rounded-xl flex items-center justify-center transition-colors glass-heavy",
                                            isSelected ? "text-neon-cyan border border-neon-cyan/30" : "text-gray-500 border border-white/5"
                                        )}>
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        <span className={cn("text-[10px] font-mono tracking-widest uppercase", isSelected ? "text-white" : "")}>
                                            {MODEL_CONFIGS[id].name}
                                        </span>
                                    </button>
                                )
                            })}
                        </div>
                        {/* API Key Inputs for Selected Models */}
                        <div className="space-y-4 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            <AnimatePresence>
                                {selectedModels.map(id => (
                                    <motion.div
                                        key={id}
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="bg-black/20 rounded-lg p-4 border border-white/5">
                                            <div className="flex justify-between items-center mb-2">
                                                <label className="text-xs font-mono text-neon-cyan uppercase tracking-wider">{MODEL_CONFIGS[id].name} API KEY</label>
                                                {apiKeys[id] && validateApiKey(id, apiKeys[id]!) && (
                                                    <span className="flex items-center gap-1 text-[10px] text-green-400">
                                                        <Check className="w-3 h-3" /> VERIFIED
                                                    </span>
                                                )}
                                            </div>
                                            <div className="relative">
                                                <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                                <input
                                                    type="password"
                                                    value={apiKeys[id] || ''}
                                                    onChange={(e) => setApiKey(id, e.target.value)}
                                                    placeholder={`Paste ${MODEL_CONFIGS[id].name} Key...`}
                                                    className="w-full bg-black/40 border border-white/10 rounded-md py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-neon-cyan/50 transition-colors font-mono"
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            {selectedModels.length === 0 && (
                                <div className="text-center py-8 text-gray-500 italic">Select at least one model to configure.</div>
                            )}
                        </div>

                        {/* Footer / Error */}
                        {error && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-4 text-xs text-red-500 font-medium flex items-center gap-2 bg-red-500/5 border border-red-500/10 p-3 rounded-xl">
                                <AlertCircle className="w-4 h-4" />
                                {error}
                            </motion.div>
                        )}

                        <button
                            onClick={handleLaunch}
                            disabled={selectedModels.length === 0}
                            className="w-full py-4 bg-white text-black font-medium tracking-wide hover:bg-gray-100 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-lg shadow-white/5"
                        >
                            Launch Workstation
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
