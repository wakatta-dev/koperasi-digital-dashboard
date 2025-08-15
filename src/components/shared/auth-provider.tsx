/** @format */

"use client";

import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import type { AuthUser, AuthSession } from "@/lib/auth";
import { getSession, signOut } from "@/lib/auth";

interface AuthContextType {
  user: AuthUser | null;
  session: AuthSession | null;
  loading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentSession = getSession();
    setSession(currentSession);
    setLoading(false);
  }, []);

  const logout = () => {
    setSession(null);
    signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        user: session?.user || null,
        session,
        loading,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
