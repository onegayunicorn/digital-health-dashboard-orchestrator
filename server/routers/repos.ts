/**
 * tRPC router for repository management and querying
 */

import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import {
  getAllRepositories,
  getRepositoryWithStats,
  upsertRepository,
  upsertRepositoryStats,
  upsertRepositoryIntelligence,
} from "../db";
import {
  fetchOrganizationRepositories,
  fetchRepositoryStats,
  fetchLatestCommitDate,
  fetchCommitCount,
} from "../github";
import { generateRepositoryIntelligence } from "../llm-intelligence";
import { eq, like, and } from "drizzle-orm";
import { getDb } from "../db";
import { repositories, repositoryIntelligence } from "../../drizzle/schema";

export const reposRouter = router({
  /**
   * Sync repositories from GitHub and cache them in the database
   */
  syncRepositories: protectedProcedure.mutation(async () => {
    try {
      const githubRepos = await fetchOrganizationRepositories();

      if (githubRepos.length === 0) {
        return { success: false, message: "No repositories found" };
      }

      for (const githubRepo of githubRepos) {
        // Upsert repository
        await upsertRepository({
          githubId: githubRepo.id,
          name: githubRepo.name,
          fullName: githubRepo.full_name,
          description: githubRepo.description,
          url: githubRepo.html_url,
          visibility: githubRepo.private ? "private" : "public",
          language: githubRepo.language,
          lastUpdated: new Date(githubRepo.updated_at),
        });

        // Get the repo ID from database
        const db = await getDb();
        if (!db) continue;

        const repoResult = await db
          .select()
          .from(repositories)
          .where(eq(repositories.githubId, githubRepo.id))
          .limit(1);

        if (repoResult.length === 0) continue;

        const repoId = repoResult[0].id;

        // Fetch and upsert stats
        const stats = await fetchRepositoryStats(githubRepo.full_name);
        if (stats) {
          const latestCommit = await fetchLatestCommitDate(githubRepo.full_name);
          const commitCount = await fetchCommitCount(githubRepo.full_name);

          await upsertRepositoryStats({
            repositoryId: repoId,
            starCount: stats.starCount,
            forkCount: stats.forkCount,
            openIssuesCount: stats.openIssuesCount,
            watchers: stats.watchers,
            lastCommitDate: latestCommit,
            commitCount,
          });
        }

        // Generate and upsert intelligence
        const intelligence = await generateRepositoryIntelligence({
          name: githubRepo.name,
          description: githubRepo.description,
          url: githubRepo.html_url,
          language: githubRepo.language,
          starCount: githubRepo.stargazers_count,
          forkCount: githubRepo.forks_count,
          openIssuesCount: githubRepo.open_issues_count,
        });

        if (intelligence) {
          await upsertRepositoryIntelligence({
            repositoryId: repoId,
            purpose: intelligence.purpose,
            category: intelligence.category,
            healthScore: intelligence.healthScore,
            tags: intelligence.tags.join(","),
          });
        }
      }

      return { success: true, count: githubRepos.length };
    } catch (error) {
      console.error("[Repos] Sync failed:", error);
      return { success: false, message: String(error) };
    }
  }),

  /**
   * Get all repositories with their stats and intelligence
   */
  list: protectedProcedure.query(async () => {
    const repos = await getAllRepositories();

    const db = await getDb();
    if (!db) return [];

    const result = [];
    for (const repo of repos) {
      const stats = await db
        .select()
        .from(repositories)
        .leftJoin(
          repositoryIntelligence,
          eq(repositories.id, repositoryIntelligence.repositoryId)
        )
        .where(eq(repositories.id, repo.id))
        .limit(1);

      if (stats.length > 0) {
        result.push({
          ...repo,
          intelligence: stats[0].repository_intelligence,
        });
      }
    }

    return result;
  }),

  /**
   * Search repositories by name or description
   */
  search: protectedProcedure
    .input(z.object({ query: z.string().min(1) }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      const searchTerm = `%${input.query}%`;
      const results = await db
        .select()
        .from(repositories)
        .where(
          or(
            like(repositories.name, searchTerm),
            like(repositories.description, searchTerm),
            like(repositories.fullName, searchTerm)
          )
        );

      return results;
    }),

  /**
   * Filter repositories by category
   */
  filterByCategory: protectedProcedure
    .input(z.object({ category: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      const results = await db
        .select()
        .from(repositories)
        .leftJoin(
          repositoryIntelligence,
          eq(repositories.id, repositoryIntelligence.repositoryId)
        )
        .where(eq(repositoryIntelligence.category, input.category));

      return results.map((r) => ({ ...r.repositories, intelligence: r.repository_intelligence }));
    }),

  /**
   * Filter repositories by multiple tags
   */
  filterByTags: protectedProcedure
    .input(z.object({ tags: z.array(z.string()) }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      const results = await db
        .select()
        .from(repositories)
        .leftJoin(
          repositoryIntelligence,
          eq(repositories.id, repositoryIntelligence.repositoryId)
        );

      // Filter by tags on the client side since MySQL FIND_IN_SET is complex
      return results
        .filter((r) => {
          if (!r.repository_intelligence?.tags) return false;
          const repoTags = r.repository_intelligence.tags.split(",");
          return input.tags.some((tag) => repoTags.includes(tag));
        })
        .map((r) => ({ ...r.repositories, intelligence: r.repository_intelligence }));
    }),

  /**
   * Get a single repository with full details
   */
  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return getRepositoryWithStats(input.id);
    }),
});

// Helper function for OR conditions
function or(...conditions: any[]) {
  return conditions.reduce((acc, cond) => (acc ? { or: [acc, cond] } : cond));
}
