import { SecurityHeader } from "@/components/SecurityHeader";
import { SecurityDashboard } from "@/components/SecurityDashboard";
import { RateLimitingSimulator } from "@/components/RateLimitingSimulator";
import { CSRFProtectionSimulator } from "@/components/CSRFProtectionSimulator";
import { InputSanitizationSimulator } from "@/components/InputSanitizationSimulator";
import { SecurityHeadersViewer } from "@/components/SecurityHeadersViewer";
import { LoginScreen } from "@/components/LoginScreen";
import { useAuth } from "@/hooks/useAuth";

/**
 * SecureShield - Educational Security Simulator
 * 
 * IMPORTANT DISCLAIMER:
 * This application is PURELY EDUCATIONAL. None of the security mechanisms
 * shown here are actually implemented. All protections are simulated with
 * mock data and fictional logic.
 * 
 * PURPOSE:
 * - Teach fundamental concepts of application security
 * - Demonstrate what happens "behind the scenes"
 * - Explain risks of missing security measures
 * - Make security visible and understandable
 * 
 * IN A REAL APPLICATION:
 * - Rate limiting would use server-side middleware + Redis
 * - CSRF tokens would be cryptographically generated server-side
 * - Input sanitization would happen on BOTH client and server
 * - Security headers would be configured at the web server level
 * 
 * Remember: Security is a DESIGN CHOICE, not an afterthought!
 */

const Index = () => {
  const { isAuthenticated, login, logout } = useAuth();

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return <LoginScreen onLogin={login} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <SecurityHeader onLogout={logout} />
      
      {/* Main Content */}
      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Dashboard Section */}
        <section className="mb-12">
          <SecurityDashboard />
        </section>

        {/* Simulators Grid */}
        <section>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              🛡️ Simulatori di Sicurezza
            </h2>
            <p className="text-muted-foreground">
              Interagisci con ogni modulo per capire come funzionano i meccanismi di protezione
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="animate-fade-in" style={{ animationDelay: "100ms" }}>
              <RateLimitingSimulator />
            </div>
            
            <div className="animate-fade-in" style={{ animationDelay: "200ms" }}>
              <CSRFProtectionSimulator />
            </div>
            
            <div className="animate-fade-in" style={{ animationDelay: "300ms" }}>
              <InputSanitizationSimulator />
            </div>
            
            <div className="animate-fade-in" style={{ animationDelay: "400ms" }}>
              <SecurityHeadersViewer />
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-16 border-t border-border/50 pt-8">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">
              <strong className="text-foreground">SecureShield</strong> - Educational Security Simulator
            </p>
            <p className="text-xs text-muted-foreground max-w-2xl mx-auto">
              ⚠️ Questa app è puramente educativa. Nessun meccanismo di sicurezza è realmente implementato.
              L'obiettivo è insegnare i concetti fondamentali della sicurezza applicativa attraverso
              simulazioni interattive e visuali.
            </p>
          </div>
        </footer>
      </main>

      {/* Background Effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-secondary/5 rounded-full blur-3xl" />
      </div>
    </div>
  );
};

export default Index;