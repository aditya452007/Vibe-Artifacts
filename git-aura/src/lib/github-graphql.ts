/**
 * GitHub GraphQL Client for Git-Aura
 * Optimized single-query fetching to maximize rate limits
 */

import { z } from 'zod';

// Token validation schema
export const GitHubTokenSchema = z.string()
  .regex(/^ghp_[a-zA-Z0-9]{36}$/, 'Invalid GitHub token format. Must start with "ghp_"')
  .or(z.string().regex(/^github_pat_[a-zA-Z0-9_]{82}$/, 'Invalid GitHub token format'));

export type RateLimitStatus = {
  limit: number;
  remaining: number;
  resetAt: string;
  isOverclocked: boolean;
};

export type GraphQLError = {
  type: 'RATE_LIMIT' | 'NOT_FOUND' | 'INVALID_TOKEN' | 'NETWORK' | 'UNKNOWN';
  message: string;
  status?: number;
};

/**
 * Optimized GraphQL query - fetches ALL needed data in one request
 */
const COMPREHENSIVE_USER_QUERY = `
query GetUserData($username: String!, $fromCurrent: DateTime!, $toCurrent: DateTime!, $fromPrev1: DateTime!, $toPrev1: DateTime!, $fromPrev2: DateTime!, $toPrev2: DateTime!) {
  user(login: $username) {
    # Profile Info
    login
    name
    bio
    avatarUrl(size: 256)
    websiteUrl
    location
    company
    twitterUsername
    createdAt
    
    # Social Stats
    followers { totalCount }
    following { totalCount }
    
    # Repository Stats
    repositories(first: 100, orderBy: {field: STARGAZERS, direction: DESC}, privacy: PUBLIC) {
      totalCount
      nodes {
        name
        description
        url
        stargazerCount
        forkCount
        primaryLanguage {
          name
          color
        }
        languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
          edges {
            size
            node {
              name
              color
            }
          }
        }
        isPrivate
        isFork
        createdAt
        updatedAt
      }
    }
    
    # Contribution Stats (Default for backward compatibility)
    contributionsCollection {
      totalCommitContributions
      totalPullRequestContributions
      totalIssueContributions
      totalRepositoryContributions
      contributionYears # Full list of years with activity
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            date
            contributionCount
            color
          }
        }
      }
    }

    # HISTORICAL DATA (For Time Machine)
    yearCurrent: contributionsCollection(from: $fromCurrent, to: $toCurrent) {
        totalCommitContributions
        totalPullRequestContributions
        totalIssueContributions
        totalPullRequestReviewContributions
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
              color
            }
          }
        }
    }

    yearPrev1: contributionsCollection(from: $fromPrev1, to: $toPrev1) {
        totalCommitContributions
        totalPullRequestContributions
        totalIssueContributions
        totalPullRequestReviewContributions
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
              color
            }
          }
        }
    }

    yearPrev2: contributionsCollection(from: $fromPrev2, to: $toPrev2) {
        totalCommitContributions
        totalPullRequestContributions
        totalIssueContributions
        totalPullRequestReviewContributions
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
              color
            }
          }
        }
    }
  }
  
  # Rate Limit Info
  rateLimit {
    limit
    remaining
    resetAt
  }
}
`;

/**
 * Fetch GitHub data via GraphQL
 */
export async function fetchGitHubGraphQL(
  username: string,
  token?: string
): Promise<{ data: any; rateLimit: RateLimitStatus } | { error: GraphQLError }> {

  // Validate token format if provided
  if (token) {
    const validation = GitHubTokenSchema.safeParse(token);
    if (!validation.success) {
      return {
        error: {
          type: 'INVALID_TOKEN',
          message: 'CORRUPT KEY DETECTED: Token format invalid. Expected ghp_... or github_pat_...',
        }
      };
    }
  }

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Dynamic Date Calculation
  const now = new Date();
  const currentYear = now.getFullYear();

  // Helper ISO String
  const getISO = (y: number, m: number, d: number, time: string) => `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}T${time}Z`;

  const variables = {
    username,
    fromCurrent: getISO(currentYear, 1, 1, '00:00:00'),
    toCurrent: getISO(currentYear, 12, 31, '23:59:59'),
    fromPrev1: getISO(currentYear - 1, 1, 1, '00:00:00'),
    toPrev1: getISO(currentYear - 1, 12, 31, '23:59:59'),
    fromPrev2: getISO(currentYear - 2, 1, 1, '00:00:00'),
    toPrev2: getISO(currentYear - 2, 12, 31, '23:59:59'),
  };

  try {
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query: COMPREHENSIVE_USER_QUERY,
        variables,
      }),
      next: {
        revalidate: 3600, // Cache for 1 hour
        tags: [`github-${username}`]
      }
    });

    // Handle rate limiting
    if (response.status === 403 || response.status === 429) {
      const resetTime = response.headers.get('X-RateLimit-Reset');
      const resetDate = resetTime ? new Date(parseInt(resetTime) * 1000) : new Date();

      return {
        error: {
          type: 'RATE_LIMIT',
          message: `TRAFFIC OVERLOAD. IP SIGNATURE COOLED DOWN AT ${resetDate.toLocaleTimeString()}. INSERT KEY TO BYPASS.`,
          status: response.status,
        }
      };
    }

    // Handle unauthorized
    if (response.status === 401) {
      return {
        error: {
          type: 'INVALID_TOKEN',
          message: 'UNAUTHORIZED: Token rejected by GitHub API. Verify your access key.',
          status: 401,
        }
      };
    }

    const json = await response.json();

    // Check for GraphQL errors
    if (json.errors) {
      const errorMessage = json.errors[0]?.message || 'Unknown GraphQL error';

      if (errorMessage.includes('Could not resolve to a User')) {
        return {
          error: {
            type: 'NOT_FOUND',
            message: `USER NOT FOUND: "${username}" does not exist in GitHub database.`,
          }
        };
      }

      return {
        error: {
          type: 'UNKNOWN',
          message: errorMessage,
        }
      };
    }

    // Extract rate limit info
    const rateLimit: RateLimitStatus = {
      limit: json.data.rateLimit.limit,
      remaining: json.data.rateLimit.remaining,
      resetAt: json.data.rateLimit.resetAt,
      isOverclocked: token ? true : false,
    };

    return {
      data: json.data.user,
      rateLimit,
    };

  } catch (error) {
    return {
      error: {
        type: 'NETWORK',
        message: 'NETWORK FAILURE: Unable to establish connection to GitHub API.',
      }
    };
  }
}

/**
 * Lightweight Query for Lazy Loading Years
 */
const YEARLY_CALENDAR_QUERY = `
query GetYearlyCalendar($username: String!, $from: DateTime!, $to: DateTime!) {
  user(login: $username) {
    contributionsCollection(from: $from, to: $to) {
      totalCommitContributions
      totalPullRequestContributions
      totalIssueContributions
      totalPullRequestReviewContributions
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            date
            contributionCount
            color
          }
        }
      }
    }
  }
}
`;

export async function fetchGitHubYearlyCalendar(
  username: string,
  year: number,
  token?: string
): Promise<{ data: any } | { error: GraphQLError }> {
  if (!token) return { error: { type: 'INVALID_TOKEN', message: 'Missing Token' } };

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  const getISO = (y: number, m: number, d: number, time: string) => `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}T${time}Z`;

  const variables = {
    username,
    from: getISO(year, 1, 1, '00:00:00'),
    to: getISO(year, 12, 31, '23:59:59')
  };

  try {
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query: YEARLY_CALENDAR_QUERY,
        variables,
      }),
      next: {
        revalidate: 3600, // Cache for 1 hour
        tags: [`github-${username}-calendar-${year}`]
      }
    });

    const json = await response.json();
    if (json.errors) return { error: { type: 'UNKNOWN', message: json.errors[0].message } };

    return { data: json.data.user.contributionsCollection };
  } catch (e) {
    return { error: { type: 'NETWORK', message: 'Fetch Failed' } };
  }
}

/**
 * Transform GraphQL response to existing data structure
 * (This maintains compatibility with existing slide components)
 */
export function transformGraphQLData(data: any): any {
  // TODO: Implement transformation to match TransformedData type
  // This will map the GraphQL response to the structure expected by slides
  return data;
}
