import { cn } from "@/lib/utils";

interface ProgressMeterProps {
  value: number;
  max: number;
  label?: string;
  showValue?: boolean;
  variant?: "default" | "threat" | "warning" | "success";
  size?: "sm" | "md" | "lg";
  animated?: boolean;
}

/**
 * ProgressMeter - Visual meter for rate limits, quotas, etc.
 * 
 * EDUCATIONAL NOTE:
 * Rate limiting is a crucial defense mechanism against:
 * - Brute force attacks
 * - DDoS attacks
 * - API abuse
 * - Resource exhaustion
 * 
 * Real implementations use algorithms like:
 * - Token Bucket
 * - Leaky Bucket
 * - Sliding Window
 * - Fixed Window Counter
 */
export const ProgressMeter = ({
  value,
  max,
  label,
  showValue = true,
  variant = "default",
  size = "md",
  animated = true,
}: ProgressMeterProps) => {
  const percentage = Math.min((value / max) * 100, 100);

  const heightStyles = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4",
  };

  const variantStyles = {
    default: "bg-primary",
    threat: "bg-threat",
    warning: "bg-warning",
    success: "bg-success",
  };

  const glowStyles = {
    default: "shadow-[0_0_10px_hsl(var(--primary)/0.5)]",
    threat: "shadow-[0_0_10px_hsl(var(--threat)/0.5)]",
    warning: "shadow-[0_0_10px_hsl(var(--warning)/0.5)]",
    success: "shadow-[0_0_10px_hsl(var(--success)/0.5)]",
  };

  // Determine variant based on percentage if using default
  const autoVariant = variant === "default" 
    ? percentage >= 90 
      ? "threat" 
      : percentage >= 70 
        ? "warning" 
        : "success"
    : variant;

  return (
    <div className="space-y-2">
      {(label || showValue) && (
        <div className="flex items-center justify-between text-sm">
          {label && <span className="text-muted-foreground">{label}</span>}
          {showValue && (
            <span className="font-mono text-foreground">
              {value}/{max}
            </span>
          )}
        </div>
      )}
      <div
        className={cn(
          "w-full overflow-hidden rounded-full bg-muted/50",
          heightStyles[size]
        )}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out",
            variantStyles[autoVariant],
            glowStyles[autoVariant],
            animated && percentage > 0 && "animate-pulse-glow"
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
