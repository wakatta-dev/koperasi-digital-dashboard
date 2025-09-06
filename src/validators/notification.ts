/** @format */

import { z } from "zod";

// Align with docs/modules/notification.md (channel/type/status/target_type)
export const createNotificationSchema = z.object({
  tenant_id: z
    .union([z.string(), z.number()])
    .optional()
    .transform((v) =>
      v === undefined || v === null || v === "" ? undefined : Number(v)
    )
    .refine(
      (v) => v === undefined || (!Number.isNaN(v) && v > 0),
      "Tenant ID tidak valid"
    ),
  channel: z.enum(["IN_APP", "EMAIL", "PUSH"]).default("IN_APP"),
  type: z
    .enum(["SYSTEM", "BILLING", "RAT", "LOAN", "SAVINGS", "CUSTOM"])
    .default("SYSTEM"),
  category: z.string().min(1, "Kategori wajib diisi"),
  target_type: z.enum(["SINGLE", "ALL", "GROUP"]).default("ALL"),
  title: z.string().min(2, "Judul minimal 2 karakter"),
  body: z.string().min(2, "Pesan minimal 2 karakter"),
  status: z
    .enum(["DRAFT", "PUBLISHED", "SENT", "READ", "ARCHIVED"]) // docs status enum
    .default("PUBLISHED"),
});

export type CreateNotificationSchema = z.infer<typeof createNotificationSchema>;
