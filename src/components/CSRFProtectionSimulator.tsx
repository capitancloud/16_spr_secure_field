import { useState, useEffect } from "react";
import { KeyRound, RefreshCw, CheckCircle, XCircle } from "lucide-react";
import { SecurityCard } from "./SecurityCard";
import { Terminal } from "./Terminal";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

/**
 * CSRFProtectionSimulator - Interactive demo of CSRF token protection
 * 
 * EDUCATIONAL NOTE:
 * CSRF (Cross-Site Request Forgery) attacks trick authenticated users
 * into performing unwanted actions on web applications.
 * 
 * WITHOUT CSRF PROTECTION:
 * - Malicious sites could transfer money from your bank
 * - Attackers could change your email/password
 * - Unauthorized purchases could be made
 * - Account settings could be modified without consent
 * 
 * REAL IMPLEMENTATION would include:
 * - Server-generated unique tokens per session
 * - Token validation on every state-changing request
 * - SameSite cookie attribute
 * - Double-submit cookie pattern
 * - Custom request headers for AJAX
 */

const generateToken = () => {
  // In production: crypto.randomBytes(32).toString('hex')
  return 'csrf_' + Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

export const CSRFProtectionSimulator = () => {
  const [serverToken, setServerToken] = useState(generateToken());
  const [clientToken, setClientToken] = useState(serverToken);
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<"success" | "error" | null>(null);
  const [attackMode, setAttackMode] = useState(false);
  const [logs, setLogs] = useState<Array<{ type: "input" | "output" | "error" | "success" | "warning"; content: string }>>([
    { type: "output", content: "CSRF protection initialized" },
    { type: "success", content: "Token synchronized with server" },
  ]);

  useEffect(() => {
    if (!attackMode) {
      setClientToken(serverToken);
    } else {
      setClientToken("malicious_fake_token_xyz");
    }
  }, [attackMode, serverToken]);

  const validateRequest = async () => {
    setIsValidating(true);
    setValidationResult(null);
    
    setLogs(prev => [...prev.slice(-6), 
      { type: "input" as const, content: "Submitting form with CSRF token..." },
      { type: "output" as const, content: `Client token: ${clientToken.substring(0, 20)}...` }
    ]);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const isValid = clientToken === serverToken;
    
    if (isValid) {
      setLogs(prev => [...prev.slice(-6),
        { type: "success" as const, content: "✓ Token validated successfully" },
        { type: "success" as const, content: "Request APPROVED - Action executed" }
      ]);
    } else {
      setLogs(prev => [...prev.slice(-6),
        { type: "error" as const, content: "✗ Token mismatch detected!" },
        { type: "error" as const, content: "Request REJECTED - Possible CSRF attack" }
      ]);
    }

    setValidationResult(isValid ? "success" : "error");
    setIsValidating(false);
  };

  const rotateToken = () => {
    const newToken = generateToken();
    setServerToken(newToken);
    setLogs(prev => [...prev.slice(-6),
      { type: "warning" as const, content: "Token rotated for security" },
      { type: "output" as const, content: `New token: ${newToken.substring(0, 20)}...` }
    ]);
    setValidationResult(null);
  };

  return (
    <SecurityCard
      title="CSRF Protection"
      description="Prevents cross-site request forgery by validating unique tokens"
      icon={<KeyRound className="h-6 w-6" />}
      status={attackMode ? "threat" : "protected"}
    >
      <div className="space-y-4">
        {/* Token Display */}
        <div className="grid gap-3">
          <div className="rounded-lg border border-success/30 bg-success/5 p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-success">Server Token (Hidden)</span>
              <CheckCircle className="h-3 w-3 text-success" />
            </div>
            <code className="text-xs font-mono text-success/80 break-all">
              {serverToken}
            </code>
          </div>
          
          <div className={cn(
            "rounded-lg border p-3 transition-all duration-300",
            attackMode 
              ? "border-threat/30 bg-threat/5" 
              : "border-primary/30 bg-primary/5"
          )}>
            <div className="flex items-center justify-between mb-1">
              <span className={cn(
                "text-xs",
                attackMode ? "text-threat" : "text-primary"
              )}>
                {attackMode ? "Attacker's Token (Fake)" : "Client Token (Form)"}
              </span>
              {attackMode && <XCircle className="h-3 w-3 text-threat" />}
            </div>
            <code className={cn(
              "text-xs font-mono break-all",
              attackMode ? "text-threat/80" : "text-primary/80"
            )}>
              {clientToken}
            </code>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={validateRequest}
            disabled={isValidating}
            variant={validationResult === "error" ? "destructive" : "default"}
            className="glow-button"
          >
            {isValidating ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : validationResult === "success" ? (
              <CheckCircle className="mr-2 h-4 w-4" />
            ) : validationResult === "error" ? (
              <XCircle className="mr-2 h-4 w-4" />
            ) : null}
            Submit Form
          </Button>
          
          <Button variant="outline" onClick={rotateToken}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Rotate Token
          </Button>
          
          <Button
            variant={attackMode ? "destructive" : "outline"}
            onClick={() => setAttackMode(!attackMode)}
          >
            {attackMode ? "🛑 Stop Attack" : "⚔️ Simulate Attack"}
          </Button>
        </div>

        <Terminal
          lines={logs}
          title="CSRF Validator"
          autoPlay={false}
        />

        <div className="rounded-lg border border-border/50 bg-muted/20 p-3 text-xs text-muted-foreground">
          <strong className="text-foreground">💡 In produzione:</strong> I token CSRF vengono generati 
          dal server con entropia crittografica, inclusi in form nascosti, e validati ad ogni 
          richiesta POST/PUT/DELETE. Cookies con SameSite=Strict aggiungono protezione extra.
        </div>
      </div>
    </SecurityCard>
  );
};
