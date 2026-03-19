/** @format */

"use client";

import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import type { UserRole } from "@/lib/types";
import EnterpriseLoading from "./enterprise-loading";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: UserRole;
  allowedRoles?: string[];
  fallbackPath?: string;
}

function normalizeRoleName(role: unknown): string {
  return String(role ?? "")
    .trim()
    .toLowerCase();
}

export function ProtectedRoute({
  children,
  requiredRole,
  allowedRoles,
  fallbackPath,
}: ProtectedRouteProps) {
  const { data: session, status } = useSession();

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

  const tenantType = (session?.user as any)?.jenis_tenant;
  const internalRole = normalizeRoleName((session?.user as any)?.role);

  if (!session?.user || (requiredRole && tenantType !== requiredRole)) {
    redirect("/login");
  }

  if (
    allowedRoles?.length &&
    !allowedRoles.map(normalizeRoleName).includes(internalRole)
  ) {
    redirect(
      fallbackPath ?? (tenantType ? `/${tenantType}/dashboard` : "/login"),
    );
  }

  return <>{children}</>;
}
