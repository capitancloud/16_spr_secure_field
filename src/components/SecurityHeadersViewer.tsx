import { useState } from "react";
import { Globe, CheckCircle, XCircle, Info } from "lucide-react";
import { SecurityCard } from "./SecurityCard";
import { cn } from "@/lib/utils";

/**
 * SecurityHeadersViewer - Displays common security headers and their purpose
 * 
 * EDUCATIONAL NOTE:
 * HTTP Security Headers add layers of protection at the browser level.
 * 
 * WITHOUT SECURITY HEADERS:
 * - XSS attacks could execute any script
 * - Clickjacking could embed your site in malicious iframes
 * - MIME sniffing could trick browsers into executing files
 * - Protocol downgrade attacks could intercept traffic
 * 
 * REAL IMPLEMENTATION would include:
 * - Server/reverse proxy configuration (nginx, Apache)
 * - Framework middleware (helmet.js for Express)
 * - CDN-level headers (Cloudflare, AWS CloudFront)
 * - Regular header auditing tools (securityheaders.com)
 */

interface SecurityHeader {
  name: string;
  value: string;
  enabled: boolean;
  description: string;
  risk: string;
}

const SECURITY_HEADERS: SecurityHeader[] = [
  {
    name: "Content-Security-Policy",
    value: "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'",
    enabled: true,
    description: "Controlla quali risorse il browser può caricare, prevenendo XSS",
    risk: "Senza CSP, script malevoli possono essere iniettati ed eseguiti",
  },
  {
    name: "X-Frame-Options",
    value: "DENY",
    enabled: true,
    description: "Previene il clickjacking bloccando l'embedding in iframe",
    risk: "Attaccanti potrebbero ingannare utenti con UI overlay invisibili",
  },
  {
    name: "X-Content-Type-Options",
    value: "nosniff",
    enabled: true,
    description: "Impedisce al browser di interpretare file con MIME type errato",
    risk: "File potrebbero essere eseguiti come script invece che scaricati",
  },
  {
    name: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains; preload",
    enabled: true,
    description: "Forza connessioni HTTPS, previene downgrade attacks",
    risk: "Traffico potrebbe essere intercettato su connessioni HTTP",
  },
  {
    name: "X-XSS-Protection",
    value: "1; mode=block",
    enabled: true,
    description: "Attiva filtri XSS built-in del browser (legacy)",
    risk: "Browser più vecchi sarebbero vulnerabili a XSS riflessi",
  },
  {
    name: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
    enabled: true,
    description: "Controlla quali info referrer vengono inviate",
    risk: "URL sensibili potrebbero essere esposti a terze parti",
  },
  {
    name: "Permissions-Policy",
    value: "geolocation=(), microphone=(), camera=()",
    enabled: true,
    description: "Limita accesso a API browser sensibili",
    risk: "Script malevoli potrebbero accedere a camera/microfono",
  },
];

export const SecurityHeadersViewer = () => {
  const [headers, setHeaders] = useState(SECURITY_HEADERS);
  const [selectedHeader, setSelectedHeader] = useState<SecurityHeader | null>(null);

  const toggleHeader = (index: number) => {
    setHeaders(prev => prev.map((h, i) => 
      i === index ? { ...h, enabled: !h.enabled } : h
    ));
  };

  const enabledCount = headers.filter(h => h.enabled).length;
  const status = enabledCount === headers.length 
    ? "protected" 
    : enabledCount >= headers.length / 2 
      ? "warning" 
      : "threat";

  return (
    <SecurityCard
      title="Security Headers"
      description="HTTP headers that instruct browsers to enable security features"
      icon={<Globe className="h-6 w-6" />}
      status={status}
    >
      <div className="space-y-4">
        {/* Stats */}
        <div className="flex items-center gap-4 text-sm">
          <span className="text-muted-foreground">
            Headers attivi: <span className="text-foreground font-semibold">{enabledCount}/{headers.length}</span>
          </span>
          <span className="text-xs text-muted-foreground">
            (Clicca per toggle)
          </span>
        </div>

        {/* Headers List */}
        <div className="space-y-2">
          {headers.map((header, index) => (
            <div
              key={header.name}
              className={cn(
                "rounded-lg border p-3 cursor-pointer transition-all duration-300",
                header.enabled 
                  ? "border-success/30 bg-success/5 hover:bg-success/10" 
                  : "border-threat/30 bg-threat/5 hover:bg-threat/10"
              )}
              onClick={() => toggleHeader(index)}
              onMouseEnter={() => setSelectedHeader(header)}
              onMouseLeave={() => setSelectedHeader(null)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {header.enabled ? (
                    <CheckCircle className="h-4 w-4 text-success" />
                  ) : (
                    <XCircle className="h-4 w-4 text-threat" />
                  )}
                  <span className="font-mono text-sm text-foreground">{header.name}</span>
                </div>
                <Info className="h-4 w-4 text-muted-foreground" />
              </div>
              <code className={cn(
                "text-xs font-mono mt-1 block truncate",
                header.enabled ? "text-success/70" : "text-threat/70 line-through"
              )}>
                {header.value}
              </code>
            </div>
          ))}
        </div>

        {/* Info Panel */}
        {selectedHeader && (
          <div className="rounded-lg border border-primary/30 bg-primary/5 p-3 animate-fade-in">
            <h4 className="font-semibold text-sm text-primary mb-2">{selectedHeader.name}</h4>
            <p className="text-xs text-muted-foreground mb-2">{selectedHeader.description}</p>
            <p className="text-xs text-threat/80">
              <strong>⚠ Rischio se disabilitato:</strong> {selectedHeader.risk}
            </p>
          </div>
        )}

        <div className="rounded-lg border border-border/50 bg-muted/20 p-3 text-xs text-muted-foreground">
          <strong className="text-foreground">💡 In produzione:</strong> Gli header vengono 
          configurati nel server web (nginx, Apache) o tramite middleware (helmet.js). 
          Usa securityheaders.com per verificare la configurazione del tuo sito.
        </div>
      </div>
    </SecurityCard>
  );
};
