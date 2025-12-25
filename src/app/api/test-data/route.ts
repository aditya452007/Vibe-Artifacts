import { NextResponse } from 'next/server';
import { fetchGitHubData } from '@/lib/data-service';

export async function GET() {
    // defaults to a known user if param missing, or we can hardcode 'torvalds' for test
    const data = await fetchGitHubData('torvalds');

    if (!data) {
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }

    return NextResponse.json({
        success: true,
        dataStructureKeys: Object.keys(data),
        profileSample: data.profile.username,
        contributionsSample: data.contributions.totalCommits
    });
}
