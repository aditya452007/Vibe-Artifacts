'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Book, Zap, Cpu, Code, Terminal, Layers, Workflow, GitBranch, Database, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'

const SECTIONS = [
    {
        title: 'Core Concepts',
        items: [
            { title: 'The Paradigm', icon: Book, href: '/docs/introduction' },
            { title: 'Prompt Strategy', icon: Layers, href: '/docs/prompt-strategy' },
        ]
    },
    {
        title: 'Techniques',
        items: [
            { title: 'Zero-Shot', icon: Zap, href: '/docs/zero-shot' },
            { title: 'Few-Shot', icon: Code, href: '/docs/few-shot' },
            { title: 'Chain of Thought', icon: Cpu, href: '/docs/chain-of-thought' },
            { title: 'Tree of Thoughts', icon: GitBranch, href: '/docs/tree-of-thoughts' },
        ]
    },
    {
        title: 'Advanced Frameworks',
        items: [
            { title: 'ReAct', icon: Terminal, href: '/docs/react' },
            { title: 'RAG Systems', icon: Database, href: '/docs/rag' },
            { title: 'Meta-Prompting', icon: FileText, href: '/docs/meta-prompting' },
            { title: 'DSPy', icon: Workflow, href: '/docs/dspy' },
            { title: 'Agentic Workflows', icon: Workflow, href: '/docs/agentic-workflows' },
        ]
    }
]

export function Sidebar() {
    const pathname = usePathname()

    return (
        <aside className="hidden lg:block w-64 h-[calc(100vh-80px)] sticky top-20 pr-4 overflow-y-auto no-scrollbar">
            <div className="py-2 mb-4">
                <h2 className="text-xs font-semibold text-canvas-subtext uppercase tracking-wider mb-0.5">Documentation</h2>
                <div className="text-sm font-medium text-foreground">Knowledge Base</div>
            </div>

            <nav className="space-y-8">
                {SECTIONS.map((section, idx) => (
                    <div key={idx}>
                        <h3 className="px-3 mb-2 text-[11px] font-semibold text-canvas-subtext uppercase tracking-wider">{section.title}</h3>
                        <div className="space-y-0.5">
                            {section.items.map((item) => {
                                const isActive = pathname === item.href
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "relative flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-200 group",
                                            isActive ? "bg-foreground/5 text-foreground" : "text-canvas-subtext hover:text-foreground hover:bg-foreground/5"
                                        )}
                                    >
                                        <item.icon className={cn(
                                            "w-4 h-4 transition-colors",
                                            isActive ? "text-system-blue" : "text-canvas-subtext group-hover:text-foreground"
                                        )} />
                                        <span className="text-[13px] font-medium">{item.title}</span>
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </nav>
        </aside>
    )
}
