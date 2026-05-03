import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * GitHub repositories table - stores metadata from onegayunicorn GitHub account
 */
export const repositories = mysqlTable("repositories", {
  id: int("id").autoincrement().primaryKey(),
  githubId: int("github_id").notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  description: text("description"),
  url: varchar("url", { length: 512 }).notNull(),
  visibility: mysqlEnum("visibility", ["public", "private"]).notNull(),
  language: varchar("language", { length: 64 }),
  lastUpdated: timestamp("last_updated").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  syncedAt: timestamp("synced_at").defaultNow().onUpdateNow().notNull(),
});

export type Repository = typeof repositories.$inferSelect;
export type InsertRepository = typeof repositories.$inferInsert;

/**
 * Repository stats table - cached GitHub stats (stars, commits, issues)
 */
export const repositoryStats = mysqlTable("repository_stats", {
  id: int("id").autoincrement().primaryKey(),
  repositoryId: int("repository_id").notNull().references(() => repositories.id),
  starCount: int("star_count").default(0).notNull(),
  forkCount: int("fork_count").default(0).notNull(),
  openIssuesCount: int("open_issues_count").default(0).notNull(),
  watchers: int("watchers").default(0).notNull(),
  lastCommitDate: timestamp("last_commit_date"),
  commitCount: int("commit_count").default(0).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type RepositoryStats = typeof repositoryStats.$inferSelect;
export type InsertRepositoryStats = typeof repositoryStats.$inferInsert;

/**
 * Repository intelligence table - LLM-generated insights
 */
export const repositoryIntelligence = mysqlTable("repository_intelligence", {
  id: int("id").autoincrement().primaryKey(),
  repositoryId: int("repository_id").notNull().references(() => repositories.id),
  purpose: text("purpose"), // LLM-generated summary of repo purpose
  category: varchar("category", { length: 64 }), // quantum, health, AI, telecom, etc.
  healthScore: int("health_score"), // 0-100 score based on activity and description
  tags: varchar("tags", { length: 512 }), // comma-separated tags
  generatedAt: timestamp("generated_at").defaultNow().notNull(),
});

export type RepositoryIntelligence = typeof repositoryIntelligence.$inferSelect;
export type InsertRepositoryIntelligence = typeof repositoryIntelligence.$inferInsert;

/**
 * Technical metrics table - FHIR transactions, API calls, uptime, latency
 */
export const metricsTechnical = mysqlTable("metrics_technical", {
  id: int("id").autoincrement().primaryKey(),
  fhirTransactionsAnnual: varchar("fhir_transactions_annual", { length: 64 }), // e.g., "1B"
  apiCallsAnnual: varchar("api_calls_annual", { length: 64 }), // e.g., "10B"
  dataStored: varchar("data_stored", { length: 64 }), // e.g., "1PB"
  uptime: varchar("uptime", { length: 64 }), // e.g., "99.99%"
  latency: varchar("latency", { length: 64 }), // e.g., "50ms"
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type MetricsTechnical = typeof metricsTechnical.$inferSelect;
export type InsertMetricsTechnical = typeof metricsTechnical.$inferInsert;

/**
 * Financial metrics table - revenue, EBITDA, grants, sponsorships, valuation
 */
export const metricsFinancial = mysqlTable("metrics_financial", {
  id: int("id").autoincrement().primaryKey(),
  revenue: varchar("revenue", { length: 64 }), // e.g., "$500M"
  ebitda: varchar("ebitda", { length: 64 }), // e.g., "$200M"
  grants: varchar("grants", { length: 64 }), // e.g., "$50M"
  sponsorships: varchar("sponsorships", { length: 64 }), // e.g., "$50M"
  valuation: varchar("valuation", { length: 64 }), // e.g., "$2.5B"
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type MetricsFinancial = typeof metricsFinancial.$inferSelect;
export type InsertMetricsFinancial = typeof metricsFinancial.$inferInsert;

/**
 * Impact metrics table - lives touched, cost saved, contributors, countries, publications
 */
export const metricsImpact = mysqlTable("metrics_impact", {
  id: int("id").autoincrement().primaryKey(),
  livesTouched: varchar("lives_touched", { length: 64 }), // e.g., "500M"
  healthcareCostSaved: varchar("healthcare_cost_saved", { length: 64 }), // e.g., "$10B"
  openSourceContributors: varchar("open_source_contributors", { length: 64 }), // e.g., "5,000"
  countriesWithFreeAccess: varchar("countries_with_free_access", { length: 64 }), // e.g., "100+"
  researchPublications: varchar("research_publications", { length: 64 }), // e.g., "100"
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type MetricsImpact = typeof metricsImpact.$inferSelect;
export type InsertMetricsImpact = typeof metricsImpact.$inferInsert;

/**
 * Action plan items table - 30-day milestone tracker
 */
export const actionPlanItems = mysqlTable("action_plan_items", {
  id: int("id").autoincrement().primaryKey(),
  week: int("week").notNull(), // 1-4
  day: int("day"), // optional: specific day within week
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  completed: int("completed").default(0).notNull(), // 0 or 1 for boolean
  priority: mysqlEnum("priority", ["low", "medium", "high"]).default("medium").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type ActionPlanItem = typeof actionPlanItems.$inferSelect;
export type InsertActionPlanItem = typeof actionPlanItems.$inferInsert;