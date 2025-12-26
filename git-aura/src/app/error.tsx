'use client';

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--void-bg)] text-[var(--foreground)] font-mono p-4">
            <h2 className="text-2xl font-bold mb-4">System Malfunction</h2>
            <p className="text-red-500 mb-8 max-w-md text-center">{error.message || "An unexpected error occurred."}</p>
            <button
                onClick={reset}
                className="px-4 py-2 bg-[var(--neon-rust)] text-black font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
            >
                Reboot System
            </button>
        </div>
    );
}
