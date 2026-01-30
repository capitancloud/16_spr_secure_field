import { Shield, Lock, Eye, Zap } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { cn } from "@/lib/utils";

/**
 * SecurityDashboard - Overview of all security features
 * 
 * EDUCATIONAL NOTE:
 * A security dashboard in production would integrate with:
 * - Real-time monitoring systems
 * - Incident response tools
 * - Compliance tracking
 * - Vulnerability scanners
 * 
 * The key principle: Security must be VISIBLE.
 * When security is invisible, it gets ignored.
 */

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  description?: string;
}

const StatCard = ({ title, value, icon, description }: StatCardProps) => (
  <div className="glass-card p-4 animated-border">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      <div className="rounded-lg bg-primary/10 p-2 text-primary">
        {icon}
      </div>
    </div>
  </div>
);

export const SecurityDashboard = () => {
  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/5 rounded-full blur-3xl" />
        
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 blur-xl rounded-full animate-pulse" />
              <Shield className="relative h-12 w-12 text-primary" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-foreground">
                Security <span className="text-glow text-primary">Overview</span>
              </h2>
              <p className="text-muted-foreground">
                La sicurezza è una scelta di design, non un'aggiunta finale
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mt-6">
            <StatusBadge status="protected" label="Rate Limiting Attivo" size="lg" />
            <StatusBadge status="protected" label="CSRF Protection" size="lg" />
            <StatusBadge status="protected" label="Input Sanitization" size="lg" />
            <StatusBadge status="protected" label="Security Headers" size="lg" />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Threats Blocked"
          value="1,247"
          icon={<Shield className="h-5 w-5" />}
          description="Nelle ultime 24 ore"
        />
        <StatCard
          title="Security Score"
          value="98%"
          icon={<Lock className="h-5 w-5" />}
          description="Eccellente"
        />
        <StatCard
          title="Active Monitors"
          value={7}
          icon={<Eye className="h-5 w-5" />}
          description="Tutti operativi"
        />
        <StatCard
          title="Response Time"
          value="<1ms"
          icon={<Zap className="h-5 w-5" />}
          description="Overhead sicurezza"
        />
      </div>

      {/* Philosophy Banner */}
      <div className={cn(
        "rounded-xl border border-border/50 p-6",
        "bg-gradient-to-r from-muted/30 via-background to-muted/30"
      )}>
        <div className="flex items-start gap-4">
          <div className="rounded-full bg-primary/10 p-3 text-primary shrink-0">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-2">
              🎯 Filosofia SecureShield
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Questa app dimostra che la <strong className="text-foreground">sicurezza deve essere visibile</strong>. 
              Ogni meccanismo di protezione qui simulato rappresenta un layer reale che 
              protegge le applicazioni moderne. Nessuna difesa è implementata realmente 
              - l'obiettivo è <strong className="text-foreground">educare e sensibilizzare</strong> sui 
              principi fondamentali della sicurezza applicativa.
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="px-2 py-1 rounded bg-primary/10 text-primary text-xs">Defense in Depth</span>
              <span className="px-2 py-1 rounded bg-primary/10 text-primary text-xs">Zero Trust</span>
              <span className="px-2 py-1 rounded bg-primary/10 text-primary text-xs">Least Privilege</span>
              <span className="px-2 py-1 rounded bg-primary/10 text-primary text-xs">Fail Secure</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
