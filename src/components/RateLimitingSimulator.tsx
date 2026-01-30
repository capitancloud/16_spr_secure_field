import { useState, useEffect, useCallback } from "react";
import { Gauge, Clock, AlertTriangle } from "lucide-react";
import { SecurityCard } from "./SecurityCard";
import { ProgressMeter } from "./ProgressMeter";
import { Terminal } from "./Terminal";
import { Button } from "./ui/button";

/**
 * RateLimitingSimulator - Interactive demo of rate limiting
 * 
 * EDUCATIONAL NOTE:
 * Rate limiting protects APIs from abuse by limiting request frequency.
 * 
 * WITHOUT RATE LIMITING:
 * - Attackers could brute force passwords (millions of attempts)
 * - DDoS attacks would easily overwhelm servers
 * - Automated bots could scrape all your data
 * - API costs could skyrocket from abuse
 * 
 * REAL IMPLEMENTATION would include:
 * - Server-side middleware (e.g., express-rate-limit)
 * - Redis or similar for distributed rate limiting
 * - Different limits for different endpoints
 * - IP-based and user-based limits
 * - Exponential backoff for repeated violations
 */

const MAX_REQUESTS = 10;
const RESET_TIME = 30; // seconds

export const RateLimitingSimulator = () => {
  const [requests, setRequests] = useState(0);
  const [blocked, setBlocked] = useState(false);
  const [timeToReset, setTimeToReset] = useState(0);
  const [logs, setLogs] = useState<Array<{ type: "input" | "output" | "error" | "success" | "warning"; content: string }>>([
    { type: "output", content: "Rate limiting monitor initialized" },
    { type: "success", content: `Limit: ${MAX_REQUESTS} requests per ${RESET_TIME}s window` },
  ]);

  const addLog = useCallback((type: "input" | "output" | "error" | "success" | "warning", content: string) => {
    setLogs(prev => [...prev.slice(-8), { type, content }]);
  }, []);

  useEffect(() => {
    if (blocked && timeToReset > 0) {
      const timer = setInterval(() => {
        setTimeToReset(prev => {
          if (prev <= 1) {
            setBlocked(false);
            setRequests(0);
            addLog("success", "Rate limit window reset. Requests allowed.");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [blocked, timeToReset, addLog]);

  const handleRequest = () => {
    if (blocked) {
      addLog("error", `Request BLOCKED - Wait ${timeToReset}s before retry`);
      return;
    }

    const newCount = requests + 1;
    setRequests(newCount);

    if (newCount >= MAX_REQUESTS) {
      setBlocked(true);
      setTimeToReset(RESET_TIME);
      addLog("warning", `Rate limit reached: ${newCount}/${MAX_REQUESTS}`);
      addLog("error", "⚠ BLOCKING subsequent requests for 30s");
    } else if (newCount >= MAX_REQUESTS * 0.7) {
      addLog("warning", `Request ${newCount}/${MAX_REQUESTS} - Approaching limit!`);
    } else {
      addLog("input", `Request ${newCount}/${MAX_REQUESTS} processed successfully`);
    }
  };

  const status = blocked ? "threat" : requests >= MAX_REQUESTS * 0.7 ? "warning" : "protected";

  return (
    <SecurityCard
      title="Rate Limiting"
      description="Protects against brute force and DDoS attacks by limiting request frequency"
      icon={<Gauge className="h-6 w-6" />}
      status={status}
    >
      <div className="space-y-4">
        <ProgressMeter
          value={requests}
          max={MAX_REQUESTS}
          label="Request Usage"
        />
        
        <div className="flex items-center gap-4">
          <Button
            onClick={handleRequest}
            disabled={blocked}
            variant={blocked ? "destructive" : "default"}
            className="glow-button"
          >
            {blocked ? (
              <>
                <AlertTriangle className="mr-2 h-4 w-4" />
                Blocked
              </>
            ) : (
              "Send Request"
            )}
          </Button>
          
          {blocked && (
            <div className="flex items-center gap-2 text-threat">
              <Clock className="h-4 w-4 animate-pulse" />
              <span className="font-mono text-sm">Reset in {timeToReset}s</span>
            </div>
          )}
        </div>

        <Terminal
          lines={logs}
          title="Rate Limit Monitor"
          autoPlay={false}
        />

        {/* Educational Comment Box */}
        <div className="rounded-lg border border-border/50 bg-muted/20 p-3 text-xs text-muted-foreground">
          <strong className="text-foreground">💡 In produzione:</strong> Il rate limiting sarebbe implementato 
          lato server con Redis per tracking distribuito, headers HTTP (X-RateLimit-*) per comunicare 
          limiti al client, e diverse soglie per endpoint sensibili (login, API).
        </div>
      </div>
    </SecurityCard>
  );
};
