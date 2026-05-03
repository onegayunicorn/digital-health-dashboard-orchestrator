import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, repositories, repositoryStats, repositoryIntelligence, metricsTechnical, metricsFinancial, metricsImpact, actionPlanItems } from "../drizzle/schema";
import { InsertRepository, InsertRepositoryStats, InsertRepositoryIntelligence, InsertMetricsTechnical, InsertMetricsFinancial, InsertMetricsImpact, InsertActionPlanItem } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/**
 * Repository queries
 */
export async function getAllRepositories() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(repositories);
}

export async function getRepositoryWithStats(repoId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db
    .select()
    .from(repositories)
    .leftJoin(repositoryStats, eq(repositories.id, repositoryStats.repositoryId))
    .leftJoin(repositoryIntelligence, eq(repositories.id, repositoryIntelligence.repositoryId))
    .where(eq(repositories.id, repoId))
    .limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function upsertRepository(repo: InsertRepository) {
  const db = await getDb();
  if (!db) return;
  await db.insert(repositories).values(repo).onDuplicateKeyUpdate({
    set: {
      name: repo.name,
      description: repo.description,
      url: repo.url,
      visibility: repo.visibility,
      language: repo.language,
      lastUpdated: repo.lastUpdated,
      syncedAt: new Date(),
    },
  });
}

export async function upsertRepositoryStats(stats: InsertRepositoryStats) {
  const db = await getDb();
  if (!db) return;
  await db.insert(repositoryStats).values(stats).onDuplicateKeyUpdate({
    set: {
      starCount: stats.starCount,
      forkCount: stats.forkCount,
      openIssuesCount: stats.openIssuesCount,
      watchers: stats.watchers,
      lastCommitDate: stats.lastCommitDate,
      commitCount: stats.commitCount,
      updatedAt: new Date(),
    },
  });
}

export async function upsertRepositoryIntelligence(intel: InsertRepositoryIntelligence) {
  const db = await getDb();
  if (!db) return;
  const existing = await db
    .select()
    .from(repositoryIntelligence)
    .where(eq(repositoryIntelligence.repositoryId, intel.repositoryId))
    .limit(1);

  if (existing.length > 0) {
    await db
      .update(repositoryIntelligence)
      .set({
        purpose: intel.purpose,
        category: intel.category,
        healthScore: intel.healthScore,
        tags: intel.tags,
        generatedAt: new Date(),
      })
      .where(eq(repositoryIntelligence.repositoryId, intel.repositoryId));
  } else {
    await db.insert(repositoryIntelligence).values(intel);
  }
}

/**
 * Metrics queries
 */
export async function getTechnicalMetrics() {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(metricsTechnical).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getFinancialMetrics() {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(metricsFinancial).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getImpactMetrics() {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(metricsImpact).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function upsertTechnicalMetrics(metrics: InsertMetricsTechnical) {
  const db = await getDb();
  if (!db) return;
  const existing = await db.select().from(metricsTechnical).limit(1);
  if (existing.length > 0) {
    await db.update(metricsTechnical).set(metrics).limit(1);
  } else {
    await db.insert(metricsTechnical).values(metrics);
  }
}

export async function upsertFinancialMetrics(metrics: InsertMetricsFinancial) {
  const db = await getDb();
  if (!db) return;
  const existing = await db.select().from(metricsFinancial).limit(1);
  if (existing.length > 0) {
    await db.update(metricsFinancial).set(metrics).limit(1);
  } else {
    await db.insert(metricsFinancial).values(metrics);
  }
}

export async function upsertImpactMetrics(metrics: InsertMetricsImpact) {
  const db = await getDb();
  if (!db) return;
  const existing = await db.select().from(metricsImpact).limit(1);
  if (existing.length > 0) {
    await db.update(metricsImpact).set(metrics).limit(1);
  } else {
    await db.insert(metricsImpact).values(metrics);
  }
}

/**
 * Action plan queries
 */
export async function getActionPlanItems() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(actionPlanItems).orderBy(actionPlanItems.week);
}

export async function upsertActionPlanItem(item: InsertActionPlanItem) {
  const db = await getDb();
  if (!db) return;
  await db.insert(actionPlanItems).values(item).onDuplicateKeyUpdate({
    set: {
      title: item.title,
      description: item.description,
      completed: item.completed,
      priority: item.priority,
      updatedAt: new Date(),
    },
  });
}
