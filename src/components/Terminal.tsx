import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TerminalLine {
  type: "input" | "output" | "error" | "success" | "warning";
  content: string;
  delay?: number;
}

interface TerminalProps {
  lines: TerminalLine[];
  title?: string;
  className?: string;
  autoPlay?: boolean;
}

/**
 * Terminal - Simulated terminal output for security demonstrations
 * 
 * EDUCATIONAL NOTE:
 * This terminal simulation helps visualize what happens "behind the scenes"
 * in a real application. In production environments, security logs would be:
 * - Collected by logging aggregators (ELK Stack, Datadog, Splunk)
 * - Analyzed for patterns and anomalies
 * - Used to trigger alerts and automated responses
 * - Stored securely for compliance and forensics
 */
export const Terminal = ({
  lines,
  title = "Security Monitor",
  className,
  autoPlay = true,
}: TerminalProps) => {
  const [visibleLines, setVisibleLines] = useState<number>(autoPlay ? 0 : lines.length);

  useEffect(() => {
    if (!autoPlay || visibleLines >= lines.length) return;

    const delay = lines[visibleLines]?.delay || 300;
    const timer = setTimeout(() => {
      setVisibleLines((prev) => prev + 1);
    }, delay);

    return () => clearTimeout(timer);
  }, [visibleLines, lines, autoPlay]);

  const lineStyles = {
    input: "text-primary",
    output: "text-muted-foreground",
    error: "text-threat",
    success: "text-success",
    warning: "text-warning",
  };

  const linePrefix = {
    input: "❯",
    output: "→",
    error: "✗",
    success: "✓",
    warning: "⚠",
  };

  return (
    <div className={cn("rounded-lg border border-border bg-background/80 overflow-hidden", className)}>
      <div className="flex items-center gap-2 border-b border-border bg-muted/30 px-4 py-2">
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-threat/60" />
          <div className="h-3 w-3 rounded-full bg-warning/60" />
          <div className="h-3 w-3 rounded-full bg-success/60" />
        </div>
        <span className="font-mono text-xs text-muted-foreground">{title}</span>
      </div>
      <div className="p-4 font-mono text-sm space-y-1 min-h-[120px]">
        {lines.slice(0, visibleLines).map((line, index) => (
          <div
            key={index}
            className={cn(
              "flex items-start gap-2 animate-fade-in",
              lineStyles[line.type]
            )}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <span className="shrink-0 opacity-60">{linePrefix[line.type]}</span>
            <span>{line.content}</span>
          </div>
        ))}
        {autoPlay && visibleLines < lines.length && (
          <span className="inline-block w-2 h-4 bg-primary animate-pulse" />
        )}
      </div>
    </div>
  );
};
