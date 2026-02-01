import { useState, useEffect, useCallback } from "react";
import { isAuthenticated, setAuthenticated as setAuth } from "@/lib/auth";

export function useAuth() {
  const [authenticated, setAuthenticated] = useState<boolean>(() => isAuthenticated());

  useEffect(() => {
    // Check auth status on mount
    setAuthenticated(isAuthenticated());
  }, []);

  const login = useCallback(() => {
    setAuth(true);
    setAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    setAuth(false);
    setAuthenticated(false);
  }, []);

  return {
    isAuthenticated: authenticated,
    login,
    logout,
  };
}
