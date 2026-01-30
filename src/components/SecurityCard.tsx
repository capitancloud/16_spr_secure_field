import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SecurityCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  status?: "protected" | "warning" | "threat";
  children?: ReactNode;
  className?: string;
}

/**
 * SecurityCard - A glassmorphism card component for displaying security modules
 * 
 * EDUCATIONAL NOTE:
 * In a real application, security components would be integrated at multiple layers:
 * - Network layer (WAF, load balancers)
 * - Server layer (middleware, headers)
 * - Application layer (input validation, CSRF tokens)
 * - Database layer (parameterized queries, RLS)
 * 
 * This visual representation helps understand that security is a holistic approach.
 */
export const SecurityCard = ({
  title,
  description,
  icon,
  status = "protected",
  children,
  className,
}: SecurityCardProps) => {
  const statusStyles = {
    protected: "border-success/30 hover:border-success/50",
    warning: "border-warning/30 hover:border-warning/50",
    threat: "border-threat/30 hover:border-threat/50",
  };

  const glowStyles = {
    protected: "group-hover:shadow-[0_0_30px_hsl(142_72%_45%/0.2)]",
    warning: "group-hover:shadow-[0_0_30px_hsl(38_92%_50%/0.2)]",
    threat: "group-hover:shadow-[0_0_30px_hsl(0_84%_60%/0.2)]",
  };

  return (
    <div
      className={cn(
        "glass-card group p-6 transition-all duration-500",
        statusStyles[status],
        glowStyles[status],
        className
      )}
    >
      <div className="flex items-start gap-4">
        <div
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-lg transition-all duration-300",
            status === "protected" && "bg-success/10 text-success group-hover:bg-success/20",
            status === "warning" && "bg-warning/10 text-warning group-hover:bg-warning/20",
            status === "threat" && "bg-threat/10 text-threat group-hover:bg-threat/20"
          )}
        >
          {icon}
        </div>
        <div className="flex-1 space-y-1">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
};
