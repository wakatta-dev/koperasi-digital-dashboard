/** @format */

"use server";

import { createTenant } from "@/actions/tenants";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createTenantAction(formData: FormData) {
  const name = String(formData.get("name"));
  const type = String(formData.get("type"));
  const domain = String(formData.get("domain"));

  const result = await createTenant({ name, type, domain });

  revalidatePath("/vendor/clients");

  const redirectUrl = result.success
    ? `/vendor/clients?message=${encodeURIComponent(result.message)}`
    : `/vendor/clients/create?error=${encodeURIComponent(result.message)}`;

  redirect(redirectUrl);
}
