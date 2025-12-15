/** @format */

import { z } from "zod";

export const authLoginSchema = z.object({
  email: z.email({ error: "Format email tidak valid" }),
  password: z
    .string({ error: "Password wajib diisi" })
    .min(6, "Password minimal 6 karakter"),
});

export type AuthLoginValues = z.infer<typeof authLoginSchema>;

export const registerSchema = z.object({
  fullName: z
    .string({ error: "Nama lengkap wajib diisi" })
    .min(2, "Nama lengkap minimal 2 karakter"),
  businessName: z
    .string({ error: "Nama usaha wajib diisi" })
    .min(2, "Nama usaha minimal 2 karakter"),
  businessType: z
    .string({ error: "Jenis usaha wajib dipilih" })
    .min(1, "Jenis usaha wajib dipilih"),
  email: z
    .string({ error: "Email wajib diisi" })
    .email("Format email tidak valid"),
  phone: z
    .string({ error: "Nomor telepon wajib diisi" })
    .min(8, "Nomor telepon minimal 8 karakter"),
  password: z
    .string({ error: "Password wajib diisi" })
    .min(6, "Password minimal 6 karakter"),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
