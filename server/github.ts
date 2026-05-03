/**
 * GitHub API client for fetching repository data from onegayunicorn organization
 */

const GITHUB_API_BASE = "https://api.github.com";
const ORG_NAME = "onegayunicorn";

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  url: string;
  html_url: string;
  private: boolean;
  language: string | null;
  updated_at: string;
  created_at: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  watchers_count: number;
}

interface GitHubCommit {
  commit: {
    author: {
      date: string;
    };
  };
}

/**
 * Fetch all public repositories for the onegayunicorn organization
 */
export async function fetchOrganizationRepositories(): Promise<GitHubRepo[]> {
  const repos: GitHubRepo[] = [];
  let page = 1;
  const perPage = 100;

  try {
    while (true) {
      const url = `${GITHUB_API_BASE}/orgs/${ORG_NAME}/repos?per_page=${perPage}&page=${page}&type=public`;
      const response = await fetch(url, {
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
      });

      if (!response.ok) {
        console.error(`GitHub API error: ${response.status} ${response.statusText}`);
        break;
      }

      const data: GitHubRepo[] = await response.json();
      if (data.length === 0) break;

      repos.push(...data);
      page++;
    }

    return repos;
  } catch (error) {
    console.error("[GitHub] Failed to fetch repositories:", error);
    return [];
  }
}

/**
 * Fetch detailed stats for a specific repository
 */
export async function fetchRepositoryStats(repoFullName: string) {
  try {
    const url = `${GITHUB_API_BASE}/repos/${repoFullName}`;
    const response = await fetch(url, {
      headers: {
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (!response.ok) {
      console.error(`GitHub API error: ${response.status} ${response.statusText}`);
      return null;
    }

    const data: GitHubRepo = await response.json();
    return {
      starCount: data.stargazers_count,
      forkCount: data.forks_count,
      openIssuesCount: data.open_issues_count,
      watchers: data.watchers_count,
    };
  } catch (error) {
    console.error(`[GitHub] Failed to fetch stats for ${repoFullName}:`, error);
    return null;
  }
}

/**
 * Fetch the latest commit date for a repository
 */
export async function fetchLatestCommitDate(repoFullName: string): Promise<Date | null> {
  try {
    const url = `${GITHUB_API_BASE}/repos/${repoFullName}/commits?per_page=1`;
    const response = await fetch(url, {
      headers: {
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (!response.ok) {
      return null;
    }

    const data: GitHubCommit[] = await response.json();
    if (data.length > 0) {
      return new Date(data[0].commit.author.date);
    }

    return null;
  } catch (error) {
    console.error(`[GitHub] Failed to fetch latest commit for ${repoFullName}:`, error);
    return null;
  }
}

/**
 * Fetch commit count for a repository
 */
export async function fetchCommitCount(repoFullName: string): Promise<number> {
  try {
    const url = `${GITHUB_API_BASE}/repos/${repoFullName}`;
    const response = await fetch(url, {
      headers: {
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (!response.ok) {
      return 0;
    }

    const data: GitHubRepo = await response.json();
    // GitHub doesn't directly provide commit count, so we use a proxy metric
    // You can enhance this by using the commits API with pagination
    return data.stargazers_count + data.forks_count; // Placeholder metric
  } catch (error) {
    console.error(`[GitHub] Failed to fetch commit count for ${repoFullName}:`, error);
    return 0;
  }
}
