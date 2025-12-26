export default function Loading() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground gap-4">
            <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-surface"></div>
                <div className="absolute inset-0 rounded-full border-4 border-t-system-blue border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
            </div>
            <div className="text-xs font-mono text-canvas-subtext tracking-[0.2em] animate-pulse">
                INITIALIZING...
            </div>
        </div>
    )
}
