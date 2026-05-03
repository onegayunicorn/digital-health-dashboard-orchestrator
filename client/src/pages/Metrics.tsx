import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Loader2, TrendingUp, DollarSign, Heart } from "lucide-react";

export default function MetricsPage() {
  const technicalMetrics = trpc.metrics.getTechnical.useQuery();
  const financialMetrics = trpc.metrics.getFinancial.useQuery();
  const impactMetrics = trpc.metrics.getImpact.useQuery();

  const MetricCard = ({ label, value, icon: Icon }: any) => (
    <Card className="p-4 border-neon-cyan/30 bg-sidebar/50 neon-glow-cyan">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-muted-foreground mb-1">{label}</p>
          <p className="text-2xl font-bold text-neon-cyan">{value}</p>
        </div>
        <Icon className="w-6 h-6 text-neon-magenta" />
      </div>
    </Card>
  );

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-neon-cyan">Metrics Dashboard</h1>
        <p className="text-muted-foreground">Global Digital Health Foundation KPIs and performance indicators</p>
      </div>

      {/* Technical Metrics */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-neon-purple" />
          <h2 className="text-2xl font-bold text-neon-purple">Technical Metrics</h2>
        </div>
        {technicalMetrics.isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-neon-cyan" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <MetricCard
              label="FHIR Transactions (Annual)"
              value={technicalMetrics.data?.fhirTransactionsAnnual || "N/A"}
              icon={TrendingUp}
            />
            <MetricCard
              label="API Calls (Annual)"
              value={technicalMetrics.data?.apiCallsAnnual || "N/A"}
              icon={TrendingUp}
            />
            <MetricCard
              label="Data Stored"
              value={technicalMetrics.data?.dataStored || "N/A"}
              icon={TrendingUp}
            />
            <MetricCard
              label="Uptime SLA"
              value={technicalMetrics.data?.uptime || "N/A"}
              icon={TrendingUp}
            />
            <MetricCard
              label="Average Latency"
              value={technicalMetrics.data?.latency || "N/A"}
              icon={TrendingUp}
            />
          </div>
        )}
      </section>

      {/* Financial Metrics */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <DollarSign className="w-6 h-6 text-neon-lime" />
          <h2 className="text-2xl font-bold text-neon-lime">Financial Metrics</h2>
        </div>
        {financialMetrics.isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-neon-cyan" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <MetricCard
              label="Revenue Target"
              value={financialMetrics.data?.revenue || "N/A"}
              icon={DollarSign}
            />
            <MetricCard
              label="EBITDA Target"
              value={financialMetrics.data?.ebitda || "N/A"}
              icon={DollarSign}
            />
            <MetricCard
              label="Grants Secured"
              value={financialMetrics.data?.grants || "N/A"}
              icon={DollarSign}
            />
            <MetricCard
              label="Sponsorships"
              value={financialMetrics.data?.sponsorships || "N/A"}
              icon={DollarSign}
            />
            <MetricCard
              label="Valuation Target"
              value={financialMetrics.data?.valuation || "N/A"}
              icon={DollarSign}
            />
          </div>
        )}
      </section>

      {/* Impact Metrics */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Heart className="w-6 h-6 text-neon-magenta" />
          <h2 className="text-2xl font-bold text-neon-magenta">Impact Metrics</h2>
        </div>
        {impactMetrics.isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-neon-cyan" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <MetricCard
              label="Lives Touched"
              value={impactMetrics.data?.livesTouched || "N/A"}
              icon={Heart}
            />
            <MetricCard
              label="Healthcare Cost Saved"
              value={impactMetrics.data?.healthcareCostSaved || "N/A"}
              icon={Heart}
            />
            <MetricCard
              label="Open Source Contributors"
              value={impactMetrics.data?.openSourceContributors || "N/A"}
              icon={Heart}
            />
            <MetricCard
              label="Countries with Free Access"
              value={impactMetrics.data?.countriesWithFreeAccess || "N/A"}
              icon={Heart}
            />
            <MetricCard
              label="Research Publications"
              value={impactMetrics.data?.researchPublications || "N/A"}
              icon={Heart}
            />
          </div>
        )}
      </section>
    </div>
  );
}
