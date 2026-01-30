import { useState } from "react";
import { ShieldAlert, Code, AlertTriangle, CheckCircle } from "lucide-react";
import { SecurityCard } from "./SecurityCard";
import { Terminal } from "./Terminal";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { cn } from "@/lib/utils";

/**
 * InputSanitizationSimulator - Interactive demo of input sanitization
 * 
 * EDUCATIONAL NOTE:
 * Input sanitization prevents injection attacks by cleaning user input.
 * 
 * WITHOUT INPUT SANITIZATION:
 * - XSS attacks: <script>stealCookies()</script>
 * - SQL injection: ' OR '1'='1
 * - Command injection: ; rm -rf /
 * - Path traversal: ../../etc/passwd
 * 
 * REAL IMPLEMENTATION would include:
 * - Server-side validation (never trust client)
 * - Context-aware encoding (HTML, URL, JS, SQL)
 * - Parameterized queries for databases
 * - Content Security Policy headers
 * - Input length limits
 */

// Dangerous patterns to detect
const DANGEROUS_PATTERNS = [
  { pattern: /<script[\s\S]*?>[\s\S]*?<\/script>/gi, name: "XSS Script Tag", severity: "critical" },
  { pattern: /javascript:/gi, name: "JavaScript URI", severity: "critical" },
  { pattern: /on\w+\s*=/gi, name: "Event Handler", severity: "high" },
  { pattern: /'\s*(or|and)\s*'?\d*'?\s*=\s*'?\d*'?/gi, name: "SQL Injection", severity: "critical" },
  { pattern: /;\s*(rm|cat|ls|wget|curl)/gi, name: "Command Injection", severity: "critical" },
  { pattern: /\.\.\//g, name: "Path Traversal", severity: "high" },
  { pattern: /<iframe/gi, name: "Iframe Injection", severity: "high" },
  { pattern: /<img.*onerror/gi, name: "Image XSS", severity: "high" },
];

const sanitizeInput = (input: string): { sanitized: string; threats: string[] } => {
  let sanitized = input;
  const threats: string[] = [];

  for (const { pattern, name } of DANGEROUS_PATTERNS) {
    if (pattern.test(input)) {
      threats.push(name);
    }
    sanitized = sanitized.replace(pattern, "[BLOCKED]");
  }

  // HTML entity encoding
  sanitized = sanitized
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");

  return { sanitized, threats };
};

const EXAMPLE_ATTACKS = [
  '<script>alert("XSS")</script>',
  "'; DROP TABLE users; --",
  '<img src=x onerror="stealCookies()">',
  "../../../etc/passwd",
];

export const InputSanitizationSimulator = () => {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<{ sanitized: string; threats: string[] } | null>(null);
  const [logs, setLogs] = useState<Array<{ type: "input" | "output" | "error" | "success" | "warning"; content: string }>>([
    { type: "output", content: "Input sanitization engine ready" },
    { type: "success", content: "XSS, SQL Injection, Command Injection detection enabled" },
  ]);

  const handleSanitize = () => {
    const sanitized = sanitizeInput(input);
    setResult(sanitized);

    if (sanitized.threats.length > 0) {
      setLogs(prev => [...prev.slice(-5),
        { type: "warning" as const, content: `Analyzing input: ${input.substring(0, 30)}...` },
        { type: "error" as const, content: `⚠ THREATS DETECTED: ${sanitized.threats.join(", ")}` },
        { type: "success" as const, content: "Malicious content neutralized" },
      ]);
    } else {
      setLogs(prev => [...prev.slice(-5),
        { type: "input" as const, content: `Analyzing input: ${input.substring(0, 30)}...` },
        { type: "success" as const, content: "✓ No threats detected - Input is safe" },
      ]);
    }
  };

  const loadExample = (example: string) => {
    setInput(example);
    setResult(null);
  };

  const hasThreat = result && result.threats.length > 0;

  return (
    <SecurityCard
      title="Input Sanitization"
      description="Neutralizes malicious code in user input to prevent injection attacks"
      icon={<ShieldAlert className="h-6 w-6" />}
      status={hasThreat ? "warning" : "protected"}
    >
      <div className="space-y-4">
        {/* Example Attack Buttons */}
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-muted-foreground self-center">Prova un attacco:</span>
          {EXAMPLE_ATTACKS.map((attack, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => loadExample(attack)}
              className="font-mono text-xs"
            >
              {attack.substring(0, 15)}...
            </Button>
          ))}
        </div>

        {/* Input Area */}
        <div className="space-y-2">
          <Textarea
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setResult(null);
            }}
            placeholder="Inserisci input potenzialmente pericoloso..."
            className="font-mono text-sm min-h-[80px] bg-muted/30 border-border"
          />
          <Button onClick={handleSanitize} disabled={!input} className="glow-button">
            <Code className="mr-2 h-4 w-4" />
            Analizza e Sanitizza
          </Button>
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-3">
            {/* Threats Detected */}
            {result.threats.length > 0 && (
              <div className="rounded-lg border border-threat/30 bg-threat/10 p-3">
                <div className="flex items-center gap-2 text-threat mb-2">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="font-semibold text-sm">Minacce Rilevate</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {result.threats.map((threat, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded text-xs bg-threat/20 text-threat border border-threat/30"
                    >
                      {threat}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Sanitized Output */}
            <div className={cn(
              "rounded-lg border p-3",
              result.threats.length > 0 
                ? "border-success/30 bg-success/10" 
                : "border-primary/30 bg-primary/10"
            )}>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className={cn(
                  "h-4 w-4",
                  result.threats.length > 0 ? "text-success" : "text-primary"
                )} />
                <span className={cn(
                  "font-semibold text-sm",
                  result.threats.length > 0 ? "text-success" : "text-primary"
                )}>
                  Output Sanitizzato
                </span>
              </div>
              <code className="text-xs font-mono break-all text-muted-foreground">
                {result.sanitized || "(empty)"}
              </code>
            </div>
          </div>
        )}

        <Terminal
          lines={logs}
          title="Sanitization Engine"
          autoPlay={false}
        />

        <div className="rounded-lg border border-border/50 bg-muted/20 p-3 text-xs text-muted-foreground">
          <strong className="text-foreground">💡 In produzione:</strong> La sanitizzazione 
          avviene SEMPRE lato server. Il client può mostrare preview, ma la vera protezione 
          usa librerie come DOMPurify, query parametrizzate, e encoding context-aware.
        </div>
      </div>
    </SecurityCard>
  );
};
