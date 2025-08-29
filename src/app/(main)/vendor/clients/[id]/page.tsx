/** @format */

import { redirect } from "next/navigation";
import {
  getTenant,
  listTenantModules,
  listTenantUsers,
} from "@/actions/tenants";
import TenantDetailClient from "./tenant-detail-client";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ message?: string; error?: string }>;
}

export default async function TenantDetailPage({
  params,
  searchParams,
}: PageProps) {
  const { id } = await params;
  const searchParam = await searchParams;
  const { data: tenant, success } = await getTenant(id);
  if (!success || !tenant) redirect("/tenant-not-found");

  const usersRes = await listTenantUsers(id, {
    limit: 10,
  });

  const modulesRes = await listTenantModules(id, {
    limit: 10,
  });

  return (
    <TenantDetailClient
      id={id}
      initialTenant={tenant}
      initialUsers={usersRes.data ?? []}
      initialModules={modulesRes.data ?? []}
      initialMessage={searchParam?.message}
      initialError={searchParam?.error}
    />
  );
}
