/** @format */

"use server";

import type { ApiResponse, Tenant, User } from "@/types/api";
import { ensureSuccess } from "@/lib/api";
import {
  listTenants as listTenantsService,
  getTenant as getTenantService,
  createTenant as createTenantService,
  updateTenant as updateTenantService,
  updateTenantStatus as updateTenantStatusService,
  listTenantUsers as listTenantUsersService,
  addTenantUser as addTenantUserService,
  listTenantModules as listTenantModulesService,
  updateTenantModule as updateTenantModuleService,
  getTenantByDomain,
} from "@/services/api";

export async function listTenants(params?: {
  limit?: number;
  cursor?: string;
}): Promise<ApiResponse<Tenant[]>> {
  return listTenantsService(params);
}

export async function getTenant(
  id: string | number,
): Promise<ApiResponse<Tenant>> {
  return getTenantService(id);
}

export async function createTenant(payload: {
  name: string;
  type: string;
  domain: string;
}): Promise<ApiResponse<Tenant>> {
  return createTenantService(payload);
}

export async function updateTenant(
  id: string | number,
  payload: { name?: string; type?: string; domain?: string },
): Promise<ApiResponse<Tenant>> {
  return updateTenantService(id, payload);
}

export async function updateTenantStatus(
  id: string | number,
  payload: { status: string },
): Promise<ApiResponse<Tenant>> {
  return updateTenantStatusService(id, payload);
}

export async function listTenantUsers(
  id: string | number,
  params?: { limit?: number; cursor?: string },
): Promise<ApiResponse<User[]>> {
  return listTenantUsersService(id, params);
}

export async function addTenantUser(
  id: string | number,
  payload: {
    email: string;
    password: string;
    full_name: string;
    role_id: number;
  },
): Promise<ApiResponse<User>> {
  return addTenantUserService(id, payload);
}

export async function listTenantModules(
  id: string | number,
  params?: { limit?: number; cursor?: string },
): Promise<ApiResponse<any[]>> {
  return listTenantModulesService(id, params);
}

export async function updateTenantModule(
  id: string | number,
  payload: { module_id: number; status: string },
): Promise<ApiResponse<any>> {
  return updateTenantModuleService(id, payload);
}

export async function listTenantsAction(
  params?: Record<string, string | number>
) {
  const res = await listTenantsService(params);
  return ensureSuccess(res);
}

export type ListTenantsActionResult = Awaited<
  ReturnType<typeof listTenantsAction>
>;

export async function getTenantByDomainAction(domain: string) {
  const res = await getTenantByDomain(domain);
  return ensureSuccess(res);
}

export type GetTenantByDomainActionResult = Awaited<
  ReturnType<typeof getTenantByDomainAction>
>;
