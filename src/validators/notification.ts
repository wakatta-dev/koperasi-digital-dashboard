/** @format */

import { z } from "zod";

export const createNotificationSchema = z.object({
  title: z
    .string({ error: "Judul wajib diisi" })
    .min(2, "Judul minimal 2 karakter"),
  message: z
    .string({ error: "Pesan wajib diisi" })
    .min(2, "Pesan minimal 2 karakter"),
  status: z.enum(["unread", "read"]).default("unread"),
});

export type CreateNotificationSchema = z.infer<typeof createNotificationSchema>;
