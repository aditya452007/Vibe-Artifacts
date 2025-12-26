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
        <div className="w-full max-w-6xl mx-auto h-[600px] flex gap-8 p-6 font-sans">
            {/* Sidebar: Module List */}
            <div className="w-1/3 flex flex-col gap-2 relative z-10">
                <div className="mb-4 text-[11px] font-semibold text-canvas-subtext uppercase tracking-widest pl-2">
                    Available Modules
                </div>
                <div className="flex-1 overflow-y-auto pr-2 space-y-1 no-scrollbar">
                    {ARCHETYPES.map((arch) => {
                        const isActive = selectedId === arch.id
                        const Icon = arch.icon

                        return (
                            <button
                                key={arch.id}
                                onClick={() => setSelectedId(arch.id)}
                                className={cn(
                                    "w-full text-left px-4 py-2.5 rounded-lg transition-all duration-200 flex items-center gap-3 group relative",
                                    isActive
                                        ? "bg-foreground/5 text-foreground"
                                        : "hover:bg-foreground/5 text-canvas-subtext hover:text-foreground"
                                )}
                            >
                                <Icon className={cn("w-4 h-4 transition-colors", isActive ? "text-system-blue" : "text-canvas-subtext group-hover:text-foreground")} />
                                <span className={cn("text-[13px] font-medium tracking-wide", isActive ? "text-foreground" : "")}>
                                    {arch.label}
                                </span>
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Main View: Schematic & Console */}
            <div className="flex-1 relative bg-surface/50 border border-border/50 rounded-2xl flex flex-col overflow-hidden shadow-sm">

                <AnimatePresence mode="wait">
                    {selectedModule && (
                        <motion.div
                            key={selectedModule.id}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.3 }}
                            className="flex flex-col h-full p-8 relative z-20"
                        >
                            {/* Header */}
                            <div className="mb-6 border-b border-border/50 pb-4">
                                <div className="text-canvas-subtext text-[10px] font-bold mb-2 tracking-widest uppercase">ARCHETYPE_ID: {selectedModule.id.toUpperCase()}</div>
                                <h2 className="text-2xl font-bold text-foreground tracking-tight">
                                    {selectedModule.label}
                                </h2>
                            </div>

                            {/* Description Typewriter */}
                            <div className="mb-8 min-h-[60px] text-foreground/80 text-lg leading-relaxed font-light">
                                {typedText}
                            </div>

                            {/* Mini-Console */}
                            <div className="mt-auto bg-background border border-border rounded-xl p-5 font-mono text-sm shadow-sm">
                                <div className="text-canvas-subtext text-[10px] font-bold mb-3 border-b border-border/50 pb-2 flex justify-between tracking-wider uppercase">
                                    <span>Live Preview</span>
                                    <span className="text-green-500">Ready</span>
                                </div>
                                <pre className="text-foreground/90 whitespace-pre-wrap relative z-10 selection:bg-system-blue/20">
                                    <span className="text-purple-500 font-bold">In:</span> {selectedModule.code}
                                </pre>

                                {/* Action Button */}
                                <button
                                    className="mt-5 px-4 py-2 bg-foreground text-background text-xs font-semibold rounded-lg hover:opacity-90 transition-opacity uppercase tracking-wider"
                                >
                                    Execute
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
