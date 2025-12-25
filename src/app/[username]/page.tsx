import React from 'react';
import { fetchGitHubData } from '@/lib/data-service';
import { SlideDeck } from '@/components/SlideDeck';
import { LoadingScreen } from '@/components/LoadingScreen';

interface PageProps {
    params: Promise<{ username: string }>;
}

export default async function UserStoryPage({ params }: PageProps) {
    const { username } = await params;

    // Ignore internal requests
    if (username === 'favicon.ico') return null;

    const data = await fetchGitHubData(username);

    if (!data) {
        // Simple error state for now
        return (
            <div className="w-screen h-screen bg-black text-red-500 flex flex-col items-center justify-center font-mono">
                <h1 className="text-4xl font-bold mb-4">404_USER_NOT_FOUND</h1>
                <p>The signal is lost. Check the username.</p>
                <a href="/" className="mt-8 text-white underline">Return to Grid</a>
            </div>
        );
    }

    return <SlideDeck data={data} />;
}
