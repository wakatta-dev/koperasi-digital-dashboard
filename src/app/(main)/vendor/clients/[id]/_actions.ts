/** @format */

"use server";

import {
  updateTenant,
  updateTenantStatus,
  addTenantUser,
  updateTenantModule,
} from "@/actions/tenants";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateTenantAction(id: string, formData: FormData) {
  const res = await updateTenant(id, {
    name: String(formData.get("name")),
    type: String(formData.get("type")),
    domain: String(formData.get("domain")),
  });
  revalidatePath(`/vendor/clients/${id}`);
  const target = res.success
    ? `/vendor/clients/${id}?message=${encodeURIComponent(res.message)}`
    : `/vendor/clients/${id}?error=${encodeURIComponent(res.message)}`;
  redirect(target);
}

export async function updateStatusAction(id: string, formData: FormData) {
  const is_active = formData.get("status") === "on";
  const res = await updateTenantStatus(id, { is_active });
  revalidatePath(`/vendor/clients/${id}`);
  const target = res.success
    ? `/vendor/clients/${id}?message=${encodeURIComponent(res.message)}`
    : `/vendor/clients/${id}?error=${encodeURIComponent(res.message)}`;
  redirect(target);
}

export async function addUserAction(id: string, formData: FormData) {
  const res = await addTenantUser(id, {
    email: String(formData.get("email")),
    password: String(formData.get("password")),
    full_name: String(formData.get("full_name")),
    tenant_role_id: Number(formData.get("role_id")),
  });
  revalidatePath(`/vendor/clients/${id}`);
  const target = res.success
    ? `/vendor/clients/${id}?message=${encodeURIComponent(res.message)}`
    : `/vendor/clients/${id}?error=${encodeURIComponent(res.message)}`;
  redirect(target);
}

export async function toggleModuleAction(id: string, formData: FormData) {
  const res = await updateTenantModule(id, {
    module_id: Number(formData.get("module_id")),
    status: String(formData.get("status")),
  });
  revalidatePath(`/vendor/clients/${id}`);
  const target = res.success
    ? `/vendor/clients/${id}?message=${encodeURIComponent(res.message)}`
    : `/vendor/clients/${id}?error=${encodeURIComponent(res.message)}`;
  redirect(target);
}
