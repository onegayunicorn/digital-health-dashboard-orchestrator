import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Globe, Users, TrendingUp, Heart, Code } from "lucide-react";

export default function FoundationPage() {
  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Zap className="w-8 h-8 text-neon-cyan" />
          <h1 className="text-4xl font-bold text-neon-cyan">Global Digital Health Foundation</h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl">
          A quantum-ready, open-source digital health infrastructure serving 4.5 billion people without digital health access
        </p>
      </div>

      {/* Mission Statement */}
      <Card className="p-6 border-neon-magenta/50 bg-gradient-to-r from-neon-magenta/10 to-neon-purple/10 neon-glow-magenta">
        <h2 className="text-2xl font-bold text-neon-magenta mb-4">Our Mission</h2>
        <p className="text-foreground leading-relaxed">
          To democratize access to world-class digital health infrastructure, enabling every person on Earth to benefit from
          advanced healthcare technologies, regardless of geography or economic status. We build open-source, quantum-ready
          systems that consolidate fragmented health data, enable AI-driven insights, and empower individuals to take control
          of their health journey.
        </p>
      </Card>

      {/* Core Pillars */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-neon-cyan">Core Pillars</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              icon: Globe,
              title: "Global Access",
              description: "Free digital health infrastructure for 100+ countries",
              color: "neon-cyan",
            },
            {
              icon: Code,
              title: "Open Source",
              description: "47 public repositories with 847 applications",
              color: "neon-lime",
            },
            {
              icon: Zap,
              title: "Quantum Ready",
              description: "0.947 coherence quantum-ready architecture",
              color: "neon-magenta",
            },
            {
              icon: Users,
              title: "Community Driven",
              description: "42 agents, 2,650 bots, 5,000+ contributors",
              color: "neon-purple",
            },
            {
              icon: Heart,
              title: "Patient Centric",
              description: "Health Vault app for personal health records",
              color: "neon-magenta",
            },
            {
              icon: TrendingUp,
              title: "Impact Focused",
              description: "500M lives touched, $10B healthcare cost saved",
              color: "neon-lime",
            },
          ].map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <Card
                key={idx}
                className={`p-4 border-${pillar.color}/30 bg-sidebar/50 hover:bg-sidebar/80 transition-all neon-glow-${pillar.color}`}
              >
                <Icon className={`w-6 h-6 text-${pillar.color} mb-3`} />
                <h3 className="font-semibold text-foreground mb-2">{pillar.title}</h3>
                <p className="text-sm text-muted-foreground">{pillar.description}</p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Technical Infrastructure */}
      <Card className="p-6 border-neon-cyan/50 bg-sidebar/50">
        <h2 className="text-2xl font-bold text-neon-cyan mb-4">Technical Infrastructure</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Public Repos", value: "47" },
              { label: "Applications", value: "847" },
              { label: "AI Agents", value: "42" },
              { label: "Bots", value: "2,650" },
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <p className="text-2xl font-bold text-neon-cyan">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Legal Structure */}
      <Card className="p-6 border-neon-purple/50 bg-sidebar/50">
        <h2 className="text-2xl font-bold text-neon-purple mb-4">Legal Structure</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              name: "Global Digital Health Foundation",
              type: "Nonprofit (Switzerland)",
              description: "Governance, research, and public health initiatives",
            },
            {
              name: "Health Vault AG",
              type: "For-Profit (Switzerland)",
              description: "Personal health record platform and consumer apps",
            },
            {
              name: "Digital Health API Inc",
              type: "For-Profit (USA)",
              description: "Enterprise API services and healthcare integrations",
            },
          ].map((org, idx) => (
            <div key={idx} className="border border-neon-purple/30 rounded-lg p-4">
              <h3 className="font-semibold text-neon-purple mb-1">{org.name}</h3>
              <Badge variant="outline" className="text-xs border-neon-cyan text-neon-cyan mb-2">
                {org.type}
              </Badge>
              <p className="text-sm text-muted-foreground">{org.description}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Market Opportunity */}
      <Card className="p-6 border-neon-lime/50 bg-gradient-to-r from-neon-lime/10 to-neon-cyan/10">
        <h2 className="text-2xl font-bold text-neon-lime mb-4">Market Opportunity</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-foreground mb-2">Addressable Market</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• 4.5B people without digital health access</li>
              <li>• $500B healthcare IT market</li>
              <li>• 1,000+ fragmented health systems</li>
              <li>• Growing demand for data consolidation</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-2">Competitive Advantages</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Open-source, community-driven model</li>
              <li>• Quantum-ready architecture</li>
              <li>• FHIR-compliant standards</li>
              <li>• Zero-cost access for developing nations</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Financial Projections */}
      <Card className="p-6 border-neon-magenta/50 bg-sidebar/50">
        <h2 className="text-2xl font-bold text-neon-magenta mb-4">5-Year Financial Projections</h2>
        <div className="space-y-3">
          {[
            { metric: "Revenue", from: "$0", to: "$500M" },
            { metric: "EBITDA", from: "-$40M", to: "$200M" },
            { metric: "Valuation", from: "$50M", to: "$2.5B" },
            { metric: "Lives Touched", from: "500K", to: "500M" },
            { metric: "Healthcare Cost Saved", from: "$100M", to: "$10B" },
          ].map((proj, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-sidebar/50 rounded border border-neon-magenta/20">
              <span className="font-medium text-foreground">{proj.metric}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{proj.from}</span>
                <Zap className="w-4 h-4 text-neon-magenta" />
                <span className="text-sm font-semibold text-neon-magenta">{proj.to}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Call to Action */}
      <Card className="p-6 border-neon-cyan/50 bg-gradient-to-r from-neon-cyan/10 to-neon-magenta/10 text-center">
        <h2 className="text-2xl font-bold text-neon-cyan mb-3">Join the Revolution</h2>
        <p className="text-muted-foreground mb-4">
          Help us build the world's most accessible digital health infrastructure. Contribute code, join our team, or support
          our mission.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <a
            href="https://github.com/onegayunicorn"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-neon-cyan/20 hover:bg-neon-cyan/30 text-neon-cyan border border-neon-cyan rounded transition-colors"
          >
            GitHub
          </a>
          <a
            href="#"
            className="px-4 py-2 bg-neon-magenta/20 hover:bg-neon-magenta/30 text-neon-magenta border border-neon-magenta rounded transition-colors"
          >
            Contact Us
          </a>
        </div>
      </Card>
    </div>
  );
}
