/** @format */

import { z } from "zod";

export const createUserSchema = z.object({
  full_name: z
    .string({ error: "Nama wajib diisi" })
    .min(2, "Nama minimal 2 karakter"),
  email: z
    .string({ error: "Email wajib diisi" })
    .email("Email tidak valid"),
  role_id: z
    .union([z.string(), z.number()])
    .transform((v) => Number(v))
    .refine((v) => !Number.isNaN(v), "Role wajib dipilih"),
  password: z
    .string({ error: "Password wajib diisi" })
    .min(6, "Password minimal 6 karakter"),
  status: z.boolean().optional().default(true),
});

export type CreateUserSchema = z.infer<typeof createUserSchema>;

export const updateUserSchema = z.object({
  full_name: z
    .string({ error: "Nama wajib diisi" })
    .min(2, "Nama minimal 2 karakter"),
  email: z
    .string({ error: "Email wajib diisi" })
    .email("Email tidak valid"),
  role_id: z
    .union([z.string(), z.number()])
    .transform((v) => Number(v))
    .refine((v) => !Number.isNaN(v), "Role wajib dipilih"),
  status: z.boolean().default(true),
});

export type UpdateUserSchema = z.infer<typeof updateUserSchema>;
