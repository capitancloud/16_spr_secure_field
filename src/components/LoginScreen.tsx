import { useState } from "react";
import { Shield, Lock, AlertCircle, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { validateAccessCode, setAuthenticated } from "@/lib/auth";

interface LoginScreenProps {
  onLogin: () => void;
}

export const LoginScreen = ({ onLogin }: LoginScreenProps) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showCode, setShowCode] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const isValid = await validateAccessCode(code);
      
      if (isValid) {
        setAuthenticated(true);
        onLogin();
      } else {
        setError("Codice di accesso non valido. Riprova.");
      }
    } catch (err) {
      setError("Errore durante la validazione. Riprova.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <Card className="w-full max-w-md glass-card border-primary/20">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto relative">
            <div className="absolute inset-0 animate-pulse-glow rounded-full bg-primary/20 blur-xl" />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mx-auto">
              <Shield className="h-8 w-8" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">
              Secure<span className="text-primary">Shield</span>
            </CardTitle>
            <CardDescription className="text-muted-foreground mt-2">
              Educational Security Simulator
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="accessCode" className="text-sm font-medium text-foreground flex items-center gap-2">
                <Lock className="h-4 w-4 text-primary" />
                Codice di Accesso
              </label>
              <div className="relative">
                <Input
                  id="accessCode"
                  type={showCode ? "text" : "password"}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Inserisci il codice di accesso..."
                  className="pr-10 bg-background/50 border-border/50 focus:border-primary"
                  autoComplete="off"
                />
                <button
                  type="button"
                  onClick={() => setShowCode(!showCode)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showCode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <Alert variant="destructive" className="border-destructive/50 bg-destructive/10">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !code.trim()}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Verifica in corso...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Accedi
                </span>
              )}
            </Button>
          </form>

        </CardContent>
      </Card>
    </div>
  );
};
