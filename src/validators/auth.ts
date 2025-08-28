/** @format */

import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string({ error: "Email wajib diisi" })
    .min(1, "Email wajib diisi")
    .email("Format email tidak valid"),
  password: z
    .string({ error: "Password wajib diisi" })
    .min(6, "Password minimal 6 karakter"),
});

export type LoginSchema = z.infer<typeof loginSchema>;
