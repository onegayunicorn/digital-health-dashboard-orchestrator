/**
 * tRPC router for metrics and action plan management
 */

import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import {
  getTechnicalMetrics,
  getFinancialMetrics,
  getImpactMetrics,
  getActionPlanItems,
  upsertTechnicalMetrics,
  upsertFinancialMetrics,
  upsertImpactMetrics,
  upsertActionPlanItem,
} from "../db";

export const metricsRouter = router({
  /**
   * Get technical metrics (FHIR transactions, API calls, uptime, latency)
   */
  getTechnical: protectedProcedure.query(async () => {
    const metrics = await getTechnicalMetrics();
    return metrics || {
      fhirTransactionsAnnual: "1B",
      apiCallsAnnual: "10B",
      dataStored: "1PB",
      uptime: "99.99%",
      latency: "50ms",
    };
  }),

  /**
   * Get financial metrics (revenue, EBITDA, grants, sponsorships, valuation)
   */
  getFinancial: protectedProcedure.query(async () => {
    const metrics = await getFinancialMetrics();
    return metrics || {
      revenue: "$500M",
      ebitda: "$200M",
      grants: "$50M",
      sponsorships: "$50M",
      valuation: "$2.5B",
    };
  }),

  /**
   * Get impact metrics (lives touched, cost saved, contributors, countries, publications)
   */
  getImpact: protectedProcedure.query(async () => {
    const metrics = await getImpactMetrics();
    return metrics || {
      livesTouched: "500M",
      healthcareCostSaved: "$10B",
      openSourceContributors: "5,000",
      countriesWithFreeAccess: "100+",
      researchPublications: "100",
    };
  }),

  /**
   * Update technical metrics (admin only)
   */
  updateTechnical: protectedProcedure
    .input(
      z.object({
        fhirTransactionsAnnual: z.string().optional(),
        apiCallsAnnual: z.string().optional(),
        dataStored: z.string().optional(),
        uptime: z.string().optional(),
        latency: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new Error("Unauthorized");
      }

      const current = await getTechnicalMetrics();
      await upsertTechnicalMetrics({
        fhirTransactionsAnnual: input.fhirTransactionsAnnual || current?.fhirTransactionsAnnual,
        apiCallsAnnual: input.apiCallsAnnual || current?.apiCallsAnnual,
        dataStored: input.dataStored || current?.dataStored,
        uptime: input.uptime || current?.uptime,
        latency: input.latency || current?.latency,
      });

      return { success: true };
    }),

  /**
   * Update financial metrics (admin only)
   */
  updateFinancial: protectedProcedure
    .input(
      z.object({
        revenue: z.string().optional(),
        ebitda: z.string().optional(),
        grants: z.string().optional(),
        sponsorships: z.string().optional(),
        valuation: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new Error("Unauthorized");
      }

      const current = await getFinancialMetrics();
      await upsertFinancialMetrics({
        revenue: input.revenue || current?.revenue,
        ebitda: input.ebitda || current?.ebitda,
        grants: input.grants || current?.grants,
        sponsorships: input.sponsorships || current?.sponsorships,
        valuation: input.valuation || current?.valuation,
      });

      return { success: true };
    }),

  /**
   * Update impact metrics (admin only)
   */
  updateImpact: protectedProcedure
    .input(
      z.object({
        livesTouched: z.string().optional(),
        healthcareCostSaved: z.string().optional(),
        openSourceContributors: z.string().optional(),
        countriesWithFreeAccess: z.string().optional(),
        researchPublications: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new Error("Unauthorized");
      }

      const current = await getImpactMetrics();
      await upsertImpactMetrics({
        livesTouched: input.livesTouched || current?.livesTouched,
        healthcareCostSaved: input.healthcareCostSaved || current?.healthcareCostSaved,
        openSourceContributors:
          input.openSourceContributors || current?.openSourceContributors,
        countriesWithFreeAccess:
          input.countriesWithFreeAccess || current?.countriesWithFreeAccess,
        researchPublications: input.researchPublications || current?.researchPublications,
      });

      return { success: true };
    }),

  /**
   * Get all action plan items
   */
  getActionPlan: protectedProcedure.query(async () => {
    return getActionPlanItems();
  }),

  /**
   * Update action plan item completion status
   */
  updateActionPlanItem: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        completed: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new Error("Unauthorized");
      }

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const { actionPlanItems } = await import("../../drizzle/schema");
      const { eq } = await import("drizzle-orm");

      await db.update(actionPlanItems).set({ completed: input.completed }).where(eq(actionPlanItems.id, input.id));

      return { success: true };
    }),
});

// Import getDb for the mutation
import { getDb } from "../db";
