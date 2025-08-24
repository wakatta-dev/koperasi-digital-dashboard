/** @format */

"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import type { UserRole } from "@/lib/types";
import EnterpriseLoading from "./enterprise-loading";

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
      const role = (session?.user as any)?.jenis_tenant;
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
      <div className="w-screen">
        <EnterpriseLoading
          duration={4000}
          title="Loading..."
          subtitle="Harap tunggu..."
        />
      </div>
    );
  }

  const role = (session?.user as any)?.jenis_tenant;

  if (!session?.user || (requiredRole && role !== requiredRole)) {
    return null;
  }

  return <>{children}</>;
}
