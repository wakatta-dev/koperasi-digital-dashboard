/** @format */

import { DEFAULT_TENANT_ROLE_ID } from "./constants";
import type { RegisterFormValues } from "./schemas";
import type { RegisterRequest } from "@/types/api";

export function mapRegisterPayload(
  values: RegisterFormValues,
  tenantRoleId = DEFAULT_TENANT_ROLE_ID,
): RegisterRequest {
  return {
    email: values.email,
    full_name: values.fullName,
    password: values.password,
    tenant_role_id: tenantRoleId,
  };
}
