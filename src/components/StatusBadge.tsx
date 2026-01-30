import { cn } from "@/lib/utils";
import { Shield, AlertTriangle, XCircle } from "lucide-react";

interface StatusBadgeProps {
  status: "protected" | "warning" | "threat";
  label?: string;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
  pulse?: boolean;
}

/**
 * StatusBadge - Visual indicator for security status
 * 
 * EDUCATIONAL NOTE:
 * Visual indicators help users understand the security posture of their application.
 * In production, these would be connected to real-time monitoring systems like:
 * - SIEM (Security Information and Event Management)
 * - WAF dashboards
 * - Application Performance Monitoring (APM)
 */
export const StatusBadge = ({
  status,
  label,
  showIcon = true,
  size = "md",
  pulse = false,
}: StatusBadgeProps) => {
  const sizeStyles = {
    sm: "px-2 py-0.5 text-xs gap-1",
    md: "px-3 py-1 text-sm gap-1.5",
    lg: "px-4 py-1.5 text-base gap-2",
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16,
  };

  const statusConfig = {
    protected: {
      icon: Shield,
      label: label || "Protected",
      className: "bg-success/10 text-success border-success/30",
    },
    warning: {
      icon: AlertTriangle,
      label: label || "Warning",
      className: "bg-warning/10 text-warning border-warning/30",
    },
    threat: {
      icon: XCircle,
      label: label || "Threat",
      className: "bg-threat/10 text-threat border-threat/30",
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-medium transition-all duration-300",
        sizeStyles[size],
        config.className,
        pulse && "animate-pulse-glow"
      )}
    >
      {showIcon && <Icon size={iconSizes[size]} />}
      {config.label}
    </span>
  );
};
