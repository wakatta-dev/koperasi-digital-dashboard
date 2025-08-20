/** @format */

"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import type { UserRole } from "@/lib/types";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: UserRole;
}

export function ProtectedRoute({
  children,
  requiredRole,
}: ProtectedRouteProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status !== "loading") {
      const role = (session?.user as any)?.role;
      if (!session?.user) {
        router.push("/login");
        return;
      }

      if (requiredRole && role !== requiredRole) {
        router.push("/login");
        return;
      }
    }
  }, [session, status, requiredRole, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const role = (session?.user as any)?.role;
  if (!session?.user || (requiredRole && role !== requiredRole)) {
    return null;
  }

  return <>{children}</>;
}
