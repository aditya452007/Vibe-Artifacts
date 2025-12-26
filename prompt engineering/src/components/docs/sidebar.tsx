'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Book, Zap, Cpu, Code, Terminal } from 'lucide-react'

const MENU_ITEMS = [
    { title: 'The Paradigm', icon: Book, href: '/docs/introduction' },
    { title: 'Zero-Shot', icon: Zap, href: '/docs/zero-shot' },
    { title: 'Few-Shot', icon: Code, href: '/docs/few-shot' },
    { title: 'Chain of Thought', icon: Cpu, href: '/docs/chain-of-thought' },
    { title: 'ReAct Framework', icon: Terminal, href: '/docs/react' },
]

export function Sidebar() {
    const pathname = usePathname()

    return (
        <aside className="hidden md:flex flex-col w-64 h-[calc(100vh-80px)] sticky top-20 border-r border-white/5 bg-black/20 backdrop-blur-xl p-4">
            <div className="mb-8 px-4 py-2">
                <h2 className="text-xs font-mono text-zinc-500 tracking-widest uppercase mb-1">Archive</h2>
                <div className="text-sm font-bold text-white">Knowledge Base</div>
            </div>

            <nav className="space-y-1">
                {MENU_ITEMS.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${isActive ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="sidebar-active"
                                    className="absolute inset-0 bg-white/5 border border-white/10 rounded-xl"
                                    initial={false}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}

                            <item.icon className={`w-4 h-4 relative z-10 ${isActive ? 'text-neon-cyan' : 'group-hover:text-white transition-colors'}`} />
                            <span className="text-sm font-medium relative z-10">{item.title}</span>

                            {isActive && (
                                <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-neon-cyan shadow-[0_0_10px_#00ffed]" />
                            )}
                        </Link>
                    )
                })}
            </nav>

            <div className="mt-auto px-4 py-6 border-t border-white/5">
                <div className="p-4 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/5">
                    <div className="text-xs text-zinc-400 mb-2">Need Help?</div>
                    <button className="text-xs text-neon-cyan hover:underline hover:text-white transition-colors">
                        Run Diagnostics
                    </button>
                </div>
            </div>
        </aside>
    )
}
