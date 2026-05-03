import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  fetchOrganizationRepositories,
  fetchRepositoryStats,
  fetchLatestCommitDate,
  fetchCommitCount,
} from "./github";

// Mock global fetch
const originalFetch = global.fetch;

describe("GitHub API Client", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  describe("fetchOrganizationRepositories", () => {
    it("should fetch public repositories from organization", async () => {
      const mockResponse = {
        ok: true,
        json: async () => [
          {
            id: 1,
            name: "test-repo",
            full_name: "onegayunicorn/test-repo",
            description: "Test repository",
            url: "https://api.github.com/repos/onegayunicorn/test-repo",
            html_url: "https://github.com/onegayunicorn/test-repo",
            private: false,
            language: "TypeScript",
            updated_at: "2026-05-03T00:00:00Z",
            created_at: "2026-01-01T00:00:00Z",
            stargazers_count: 100,
            forks_count: 10,
            open_issues_count: 5,
            watchers_count: 100,
          },
        ],
      };

      global.fetch = vi.fn()
        .mockResolvedValueOnce(mockResponse)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => [],
        });

      const repos = await fetchOrganizationRepositories();

      expect(repos).toHaveLength(1);
      expect(repos[0].name).toBe("test-repo");
      expect(repos[0].stargazers_count).toBe(100);
    });

    it("should handle API errors gracefully", async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: "Not Found",
      });

      const repos = await fetchOrganizationRepositories();

      expect(repos).toEqual([]);
    });

    it("should handle network errors", async () => {
      global.fetch = vi.fn().mockRejectedValueOnce(new Error("Network error"));

      const repos = await fetchOrganizationRepositories();

      expect(repos).toEqual([]);
    });
  });

  describe("fetchRepositoryStats", () => {
    it("should fetch repository statistics", async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          stargazers_count: 150,
          forks_count: 20,
          open_issues_count: 8,
          watchers_count: 150,
        }),
      });

      const stats = await fetchRepositoryStats("onegayunicorn/test-repo");

      expect(stats).toEqual({
        starCount: 150,
        forkCount: 20,
        openIssuesCount: 8,
        watchers: 150,
      });
    });

    it("should return null on error", async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      const stats = await fetchRepositoryStats("onegayunicorn/nonexistent");

      expect(stats).toBeNull();
    });
  });

  describe("fetchLatestCommitDate", () => {
    it("should fetch the latest commit date", async () => {
      const commitDate = "2026-05-03T12:00:00Z";
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => [
          {
            commit: {
              author: {
                date: commitDate,
              },
            },
          },
        ],
      });

      const date = await fetchLatestCommitDate("onegayunicorn/test-repo");

      expect(date).toEqual(new Date(commitDate));
    });

    it("should return null if no commits found", async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      const date = await fetchLatestCommitDate("onegayunicorn/test-repo");

      expect(date).toBeNull();
    });

    it("should return null on error", async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
      });

      const date = await fetchLatestCommitDate("onegayunicorn/test-repo");

      expect(date).toBeNull();
    });
  });

  describe("fetchCommitCount", () => {
    it("should fetch commit count", async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          stargazers_count: 100,
          forks_count: 10,
        }),
      });

      const count = await fetchCommitCount("onegayunicorn/test-repo");

      expect(count).toBe(110); // stars + forks as proxy metric
    });

    it("should return 0 on error", async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
      });

      const count = await fetchCommitCount("onegayunicorn/test-repo");

      expect(count).toBe(0);
    });
  });
});
