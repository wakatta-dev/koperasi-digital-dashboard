/** @format */

import { z } from "zod";

export const invoiceItemSchema = z.object({
  description: z
    .string({ error: "Deskripsi wajib diisi" })
    .min(2, "Deskripsi minimal 2 karakter"),
  quantity: z
    .union([z.string(), z.number()])
    .transform((v) => Number(v))
    .refine((v) => !Number.isNaN(v) && v > 0, "Jumlah harus > 0"),
  price: z
    .union([z.string(), z.number()])
    .transform((v) => Number(v))
    .refine((v) => !Number.isNaN(v) && v >= 0, "Harga tidak valid"),
});

export const createInvoiceSchema = z.object({
  number: z.string({ error: "Nomor invoice wajib diisi" }).min(2, "Nomor minimal 2 karakter"),
  issued_at: z.string({ error: "Tanggal terbit wajib diisi" }).min(1, "Tanggal terbit wajib diisi"),
  due_date: z.string().optional(),
  items: z.array(invoiceItemSchema).min(1, "Minimal satu item"),
});

export type CreateInvoiceSchema = z.infer<typeof createInvoiceSchema>;
