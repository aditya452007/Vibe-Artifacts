'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Terminal, Cpu, Database, Network, Code, Zap, Search, Layers, Brain, GitBranch, MessageSquare, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'

// Archetypes Data
const ARCHETYPES = [
    { id: 'zero-shot', icon: Zap, label: 'Zero-Shot', description: 'Direct instruction without examples. Best for simple, common tasks.', code: 'Classify the sentiment of this text: "I love this product!"' },
    { id: 'few-shot', icon: Layers, label: 'Few-Shot', description: 'Providing 2-5 examples to guide the model\'s pattern recognition.', code: 'Input: "cool" -> Output: Positive\nInput: "meh" -> Output: Neutral\nInput: "awful" -> Output: Negative\nInput: "fantastic" -> ??' },
    { id: 'cot', icon: Brain, label: 'Chain-of-Thought', description: 'Forcing step-by-step reasoning to improve logic and math.', code: 'Q: If John has 5 apples and eats 2...\nA: Let\'s think step by step.\n1. John starts with 5.\n2. eats 2 implies 5 - 2 = 3.\nAnswer: 3' },
    { id: 'rag', icon: Database, label: 'RAG', description: 'Retrieval Augmented Generation. Injecting external context.', code: 'Context: [Company Manual 2024]\nQuestion: "What is the vacation policy?"' },
    { id: 'role-play', icon: Terminal, label: 'Persona', description: 'Assigning a specific role or expertise to the model.', code: 'You are a Senior React Engineer. Explain useEffect to a junior dev.' },
    { id: 'react', icon: Code, label: 'ReAct', description: 'Reasoning + Acting. Model thinks, acts, observes, repeats.', code: 'Thought: I need to search for the weather.\nAction: Search("Weather NY")\nObservation: 72F' },
    { id: 'self-consistency', icon: Network, label: 'Self-Consistency', description: 'Sampling multiple reasoning paths and voting on the best answer.', code: 'Sample 1: ... Answer A\nSample 2: ... Answer A\nSample 3: ... Answer B\nConsensus: Answer A' },
    { id: 'tree-of-thoughts', icon: GitBranch, label: 'Tree of Thoughts', description: 'Exploring multiple branches of reasoning simultaneously.', code: 'Hypothesis A -> Evidence -> Conclusion\nHypothesis B -> Evidence -> Dead end' },
    { id: 'meta-prompting', icon: Search, label: 'Meta-Prompting', description: 'Asking the model to refine its own prompt or detailed instructions.', code: 'Critique your previous answer and improve it for clarity.' },
    { id: 'interactive', icon: MessageSquare, label: 'Interactive', description: 'Multi-turn dialogue to refine constraints.', code: 'User: "Make it shorter."\nAI: "Updating..."' },
    { id: 'constraints', icon: Shield, label: 'Constraints', description: 'Negative constraints and formatting rules.', code: 'Do NOT use the word "happy". Output in JSON only.' },
    { id: 'step-back', icon: Cpu, label: 'Step-Back', description: 'Asking a higher-level abstract question first.', code: 'Q: Physics problem.\nStep-back: What are the underlying physical principles?' },
]

export function PromptTerminal() {
    const [selectedId, setSelectedId] = useState<string | null>('zero-shot')
    const selectedModule = ARCHETYPES.find(m => m.id === selectedId)

    // Typewriter Effect Data
    const [typedText, setTypedText] = useState('')

    useEffect(() => {
        if (!selectedModule) return
        let i = 0
        const text = selectedModule.description
        setTypedText('')

        const interval = setInterval(() => {
            setTypedText(text.slice(0, i + 1))
            i++
            if (i > text.length) clearInterval(interval)
        }, 20) // Speed

        return () => clearInterval(interval)
    }, [selectedModule])

    return (
        <div className="w-full max-w-6xl mx-auto h-[700px] flex gap-6 p-6 font-mono">
            {/* Sidebar: Module List */}
            <div className="w-1/3 flex flex-col gap-2 relative z-10">
                <div className="mb-4 text-xs font-bold text-gray-tint-500 uppercase tracking-widest pl-2">
          // Available Modules_
                </div>
                <div className="flex-1 overflow-y-auto pr-2 space-y-1 scrollbar-hide">
                    {ARCHETYPES.map((arch) => {
                        const isActive = selectedId === arch.id
                        const Icon = arch.icon

                        return (
                            <motion.button
                                key={arch.id}
                                onClick={() => setSelectedId(arch.id)}
                                whileHover={{ x: 4, backgroundColor: 'rgba(0, 255, 255, 0.05)' }}
                                className={cn(
                                    "w-full text-left px-4 py-3 border border-transparent transition-all duration-300 flex items-center gap-3 group rounded-none",
                                    isActive
                                        ? "bg-void-surface border-cyan-500/30 shadow-[0_0_15px_rgba(0,255,255,0.15)] bg-[rgba(0,255,255,0.02)]"
                                        : "hover:border-white/5 text-gray-tint-500 hover:text-cyan-200"
                                )}
                            >
                                <Icon className={cn("w-4 h-4 transition-colors", isActive ? "text-neon-cyan drop-shadow-[0_0_8px_rgba(0,255,255,0.8)]" : "text-gray-600 group-hover:text-cyan-400")} />
                                <span className={cn("text-sm tracking-wide", isActive ? "text-white font-semibold" : "")}>
                                    {arch.label}
                                </span>
                                {isActive && (
                                    <motion.div
                                        layoutId="active-indicator"
                                        className="ml-auto w-1.5 h-1.5 bg-neon-cyan shadow-[0_0_10px_#00ffff]"
                                    />
                                )}
                            </motion.button>
                        )
                    })}
                </div>
            </div>

            {/* Main View: Schematic & Console */}
            <div className="flex-1 relative glass-panel rounded-sm flex flex-col overflow-hidden">
                {/* Decor Elements */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent opacity-50" />
                <div className="absolute top-4 right-4 flex gap-1">
                    <div className="w-2 h-2 bg-red-500/20 rounded-full" />
                    <div className="w-2 h-2 bg-yellow-500/20 rounded-full" />
                    <div className="w-2 h-2 bg-green-500/20 rounded-full" />
                </div>

                <AnimatePresence mode="wait">
                    {selectedModule && (
                        <motion.div
                            key={selectedModule.id}
                            initial={{ opacity: 0, scale: 0.98, filter: 'blur(4px)' }}
                            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, scale: 1.02, filter: 'blur(4px)' }}
                            transition={{ duration: 0.4, ease: "circOut" }}
                            className="flex flex-col h-full p-8 relative z-20"
                        >
                            {/* Header */}
                            <div className="mb-8 border-b border-white/5 pb-4">
                                <div className="text-neon-cyan text-xs mb-2 tracking-[0.2em] opacity-70">ARCHETYPE_ID: {selectedModule.id.toUpperCase()}</div>
                                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-500">
                                    {selectedModule.label}
                                </h2>
                            </div>

                            {/* Description Typewriter */}
                            <div className="mb-8 min-h-[80px] text-gray-tint-300 text-lg leading-relaxed">
                                {typedText}
                                <span className="inline-block w-2.5 h-5 bg-neon-cyan ml-1 animate-flicker align-middle" />
                            </div>

                            {/* Mini-Console */}
                            <div className="mt-auto bg-black/40 border border-white/5 rounded p-4 font-mono text-sm relative group overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <div className="text-gray-500 text-xs mb-2 border-b border-white/5 pb-2 flex justify-between">
                                    <span>LIVE_PREVIEW</span>
                                    <span className="text-green-500">READY</span>
                                </div>
                                <pre className="text-gray-tint-300 whitespace-pre-wrap relative z-10 selection:bg-neon-magenta/30">
                                    <span className="text-neon-purple font-bold">In:</span> {selectedModule.code}
                                </pre>

                                {/* Jelly Button */}
                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    className="mt-4 px-4 py-2 bg-neon-cyan/10 border border-neon-cyan/20 text-neon-cyan text-xs hover:bg-neon-cyan/20 transition-colors uppercase tracking-widest"
                                >
                                    Execute
                                </motion.button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
