import { Shield } from "lucide-react";

/**
 * SecurityHeader - Main application header with branding
 * 
 * EDUCATIONAL NOTE:
 * Security should be visible and communicated to users.
 * This builds trust and awareness. In production:
 * - SSL/TLS indicators (padlock icon)
 * - Security certifications display
 * - Last security audit date
 * - Privacy policy accessibility
 */
export const SecurityHeader = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 animate-pulse-glow rounded-lg bg-primary/20 blur-lg" />
            <div className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Shield className="h-6 w-6" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">
              Secure<span className="text-primary">Shield</span>
            </h1>
            <p className="text-xs text-muted-foreground">Educational Security Simulator</p>
          </div>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
            Dashboard
          </span>
          <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
            Simulations
          </span>
          <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
            Learn More
          </span>
        </nav>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
          <span>All Systems Secure</span>
        </div>
      </div>
    </header>
  );
};
