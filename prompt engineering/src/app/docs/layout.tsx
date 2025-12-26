import { ScrollHeader } from '@/components/layout/scroll-header'
import { Sidebar } from '@/components/docs/sidebar'
import { ChatFAB } from '@/components/chat/chat-fab'

export default function DocsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen bg-background text-foreground font-sans">
            <ScrollHeader showHomeButton={true} />

            <div className="flex w-full pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Sidebar />
                <main className="flex-1 relative min-w-0 pl-0 lg:pl-10">
                    {children}
                </main>
            </div>

            <ChatFAB />
        </div>
    )
}
