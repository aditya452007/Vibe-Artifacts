import { z } from 'zod';

// --- STAGE 1: Data Contracts (Strict) ---

export interface UserProfile {
    username: string;
    fullName: string;
    avatarUrl: string;
    bio: string;
    location?: string;
    company?: string;
    websiteUrl?: string;
    twitterUsername?: string;
    createdAt: string;
    followers: number;
    following: number;
}

export interface RepositorySummary {
    name: string;
    description: string;
    stars: number;
    forks: number;
    language: string;
    langColor: string;
    url: string;
    isPrivate: boolean;
}

export interface ContributionCalendar {
    totalContributions: number;
    weeks: {
        contributionDays: {
            date: string;
            contributionCount: number;
            color: string;
        }[];
    }[];
}

export interface ContributionStats {
    totalCommits: number;
    totalPRs: number;
    totalIssues: number;
    totalReviews: number; // Optional in API, but we default to 0
    restrictedContributions?: number;
    calendar: ContributionCalendar;
    years: number[]; // Full available history list
    history?: {
        year: number;
        total: number;
        calendar: ContributionCalendar;
    }[];
}

// Derived from commit history analysis
export interface CommitActivity {
    totalCommitsLastYear: number;
    maxStreak: number;
    currentStreak: number;
    mostActiveDay: string; // e.g., "Wednesday"
    mostActiveHour: number; // 0-23
    isNightOwl: boolean; // Computed
    isWeekendWarrior: boolean; // Computed
}

export interface LanguageStat {
    name: string;
    color: string;
    percentage: number;
}

// The master object returned to the frontend
export interface GitHubData {
    profile: UserProfile;
    repositories: RepositorySummary[];
    contributions: ContributionStats;
    activity: CommitActivity;
    languages: LanguageStat[];
}

// --- Zod Schemas for Validation (kept for runtime safety) ---

export const RepoSchema = z.object({
    name: z.string(),
    description: z.string().nullable().optional(),
    url: z.string(),
    stargazerCount: z.number(),
    forkCount: z.number(),
    isPrivate: z.boolean(),
    primaryLanguage: z.object({
        name: z.string(),
        color: z.string().nullable(),
    }).nullable().optional(),
});

// Reusable Calendar Schema
const CalendarSchema = z.object({
    totalContributions: z.number(),
    weeks: z.array(
        z.object({
            contributionDays: z.array(
                z.object({
                    date: z.string(),
                    contributionCount: z.number(),
                    color: z.string(),
                })
            ),
        })
    ),
});

const CollectionSchema = z.object({
    totalCommitContributions: z.number(),
    totalIssueContributions: z.number(),
    totalPullRequestContributions: z.number(),
    totalPullRequestReviewContributions: z.number().optional().nullable(),
    contributionYears: z.array(z.number()).optional(), // Optional because partial views don't fetch it
    contributionCalendar: CalendarSchema,
});

export const UserDataSchema = z.object({
    login: z.string(),
    name: z.string().nullable(),
    avatarUrl: z.string(),
    bio: z.string().nullable(),
    location: z.string().nullable(),
    company: z.string().nullable(),
    websiteUrl: z.string().nullable(),
    twitterUsername: z.string().nullable(),
    createdAt: z.string(),
    followers: z.object({ totalCount: z.number() }),
    following: z.object({ totalCount: z.number() }),
    repositories: z.object({
        nodes: z.array(RepoSchema),
    }),
    contributionsCollection: CollectionSchema, // Original default
    // Multi-year Aliases (Optional to allow fallback)
    yearCurrent: CollectionSchema.optional(),
    yearPrev1: CollectionSchema.optional(),
    yearPrev2: CollectionSchema.optional(),
});

export type RawGitHubUser = z.infer<typeof UserDataSchema>;
