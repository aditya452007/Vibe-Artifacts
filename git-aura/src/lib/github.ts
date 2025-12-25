// Stateless Data Fetcher
// No Hooks. No Context. Pure Data.

interface GitHubUser {
    login: string;
    avatar_url: string;
    public_repos: number;
    followers: number;
    following: number;
    created_at: string;
    name: string;
    bio: string;
}

interface Repo {
    name: string;
    description: string;
    stargazers_count: number;
    language: string;
    html_url: string;
}

export interface AuraData {
    profile: GitHubUser;
    repos: Repo[];
}

export async function getGithubData(username: string): Promise<AuraData | null> {
    const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
    const headers: HeadersInit = {
        'Accept': 'application/vnd.github.v3+json',
    };

    if (token) {
        headers['Authorization'] = `token ${token}`;
    }

    try {
        console.log(`[Titan] Fetching data for: ${username}`);

        // 1. Fetch Profile
        const userRes = await fetch(`https://api.github.com/users/${username}`, {
            headers,
            next: { revalidate: 3600 }
        });

        if (!userRes.ok) {
            console.error(`[Titan] Profile fetch failed: ${userRes.status}`);
            return null;
        }

        const profile = await userRes.json();

        // 2. Fetch Top Repos
        const repoRes = await fetch(`https://api.github.com/users/${username}/repos?sort=stars&per_page=3`, {
            headers,
            next: { revalidate: 3600 }
        });

        const repos = repoRes.ok ? await repoRes.json() : [];

        return {
            profile,
            repos
        };

    } catch (error) { // eslint-disable-line @typescript-eslint/no-unused-vars
        console.error('[Titan] Network Error');
        return null;
    }
}
