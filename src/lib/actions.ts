'use server';

import { redirect } from 'next/navigation';

export async function generateStoryAction(formData: FormData) {
    const username = formData.get('username')?.toString();

    if (!username) {
        return { error: 'Username is required' };
    }

    // Simulate server latency for "Animation" effect
    await new Promise(resolve => setTimeout(resolve, 800));

    redirect(`/${username}`);
}
