/** @format */

import { z } from "zod";

export const upsertPlanSchema = z.object({
  name: z
    .string({ error: "Nama paket wajib diisi" })
    .min(2, "Nama minimal 2 karakter"),
  price: z
    .union([z.string(), z.number()])
    .transform((v) => Number(v))
    .refine((v) => !Number.isNaN(v) && v >= 0, "Harga tidak valid"),
  duration_months: z
    .union([z.string(), z.number()])
    .optional()
    .transform((v) => (v === undefined || v === null || v === "" ? undefined : Number(v)))
    .refine((v) => v === undefined || (!Number.isNaN(v) && v >= 0), "Durasi bulan tidak valid"),
});

export type UpsertPlanSchema = z.infer<typeof upsertPlanSchema>;
