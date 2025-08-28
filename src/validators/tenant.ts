/** @format */

import { z } from "zod";

export const createTenantSchema = z.object({
  name: z
    .string({ error: "Nama tenant wajib diisi" })
    .min(2, "Nama minimal 2 karakter"),
  type: z
    .string({ error: "Tipe tenant wajib diisi" })
    .min(2, "Tipe minimal 2 karakter"),
  domain: z
    .string({ error: "Domain wajib diisi" })
    .min(3, "Domain minimal 3 karakter"),
});

export type CreateTenantSchema = z.infer<typeof createTenantSchema>;
