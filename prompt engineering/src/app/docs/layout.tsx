import { ScrollHeader } from '@/components/layout/scroll-header'
import { Sidebar } from '@/components/docs/sidebar'
import { ChatFAB } from '@/components/chat/chat-fab'

export default function DocsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen bg-black text-white selection:bg-neon-cyan/30 font-sans">
            {/* Background Ambient */}
            <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/20 via-black to-black -z-50" />

            <ScrollHeader showHomeButton={true} />

            <div className="flex w-full pt-20">
                <Sidebar />
                <main className="flex-1 relative">
                    {children}
                </main>
            </div>

            <ChatFAB />
        </div>
    )
}
