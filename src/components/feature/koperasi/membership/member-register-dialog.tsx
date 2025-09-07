/** @format */

"use client";

import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { registerMember } from "@/services/api";
import AsyncCombobox from "@/components/ui/async-combobox";
import type { User } from "@/types/api";
import { listUsers } from "@/services/api";

const schema = z.object({
  user_id: z.coerce.number().int().positive(),
  no_anggota: z.string().min(2),
  initial_deposit: z.coerce.number().int().optional(),
});

type FormInput = z.input<typeof schema>;
type FormValues = z.output<typeof schema>;

export function MemberRegisterDialog() {
  const [open, setOpen] = useState(false);
  const form = useForm<FormInput, any, FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { user_id: undefined as any, no_anggota: "", initial_deposit: undefined } as Partial<FormInput>,
  });

  async function onSubmit(values: FormValues) {
    await registerMember({
      user_id: values.user_id,
      no_anggota: values.no_anggota,
      initial_deposit: values.initial_deposit,
    });
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          Tambah Anggota
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Daftarkan Anggota</DialogTitle>
          <DialogDescription>Isi data anggota baru.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="user_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pengguna</FormLabel>
                  <FormControl>
                    <AsyncCombobox<User, number>
                      value={(field.value as any) ?? null}
                      onChange={(val) => field.onChange(val as any)}
                      getOptionValue={(u) => u.id}
                      getOptionLabel={(u) => u.full_name || u.email || String(u.id)}
                      queryKey={["users", "search-membership"]}
                      fetchPage={async ({ search, pageParam }) => {
                        const params: Record<string, string | number> = { limit: 10 };
                        if (pageParam) params.cursor = pageParam;
                        if (search) params.term = search;
                        const res = await listUsers(params);
                        const items = (res?.data ?? []) as unknown as User[];
                        const nextPage = (res?.meta as any)?.pagination?.next_cursor as string | undefined;
                        return { items, nextPage };
                      }}
                      placeholder="Cari pengguna (nama/email)"
                      emptyText="Tidak ada pengguna"
                      notReadyText="Ketik untuk mencari"
                      minChars={1}
                      renderOption={(u) => (
                        <div className="flex flex-col">
                          <span className="font-medium">{u.full_name || "(tanpa nama)"}</span>
                          <span className="text-xs text-muted-foreground">{u.email}</span>
                        </div>
                      )}
                      renderValue={(val) => (
                        <span>
                          {(() => {
                            const v = Number(val);
                            if (!v) return "";
                            // Best-effort fallback when label cache is empty
                            return `User #${v}`;
                          })()}
                        </span>
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="no_anggota"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>No. Anggota</FormLabel>
                  <FormControl>
                    <Input placeholder="AGG-2025-001" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="initial_deposit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Setoran Awal (opsional)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="100000" {...field} value={field.value as any} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Simpan</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
