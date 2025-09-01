/** @format */

import { z } from "zod";

export const createTicketSchema = z.object({
  title: z.string().min(2, "Judul minimal 2 karakter"),
  category: z.enum(["billing", "technical", "access", "other"]),
  priority: z.enum(["low", "medium", "high"]),
  description: z.string().min(2, "Deskripsi minimal 2 karakter"),
  attachment_url: z.string().url().optional().or(z.literal("")),
});

export type CreateTicketSchema = z.infer<typeof createTicketSchema>;

export const addReplySchema = z.object({
  message: z.string().min(1, "Pesan wajib diisi"),
  attachment_url: z.string().url().optional().or(z.literal("")),
});

export type AddReplySchema = z.infer<typeof addReplySchema>;
