export default function Loading() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--void-bg)] text-[var(--foreground)] font-mono">
            <div className="animate-pulse flex flex-col items-center gap-4">
                <div className="h-8 w-8 bg-[var(--neon-rust)] rounded-full" />
                <p className="tracking-widest uppercase text-sm">Initializing System...</p>
            </div>
        </div>
    );
}
