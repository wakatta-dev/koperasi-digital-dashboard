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
import { makePaginatedListFetcher } from "@/lib/async-fetchers";

const schema = z.object({
  user_id: z.coerce.number().int().positive(),
  no_anggota: z.string().min(2, "Wajib diisi"),
  full_name: z.string().min(2, "Nama wajib diisi"),
  email: z.string().email("Email tidak valid"),
  phone: z.string().min(6, "Nomor telepon tidak valid"),
  address: z.string().min(3, "Alamat wajib diisi"),
  city: z.string().min(2, "Kota wajib diisi"),
  province: z.string().min(2, "Provinsi wajib diisi"),
  postal_code: z.string().min(3, "Kode pos wajib diisi"),
  identity_type: z.string().min(2, "Tipe identitas wajib"),
  identity_number: z.string().min(3, "Nomor identitas wajib"),
  occupation: z.string().optional(),
  initial_deposit: z.coerce.number().optional(),
});

type FormInput = z.input<typeof schema>;
type FormValues = z.output<typeof schema>;

export function MemberRegisterDialog() {
  const [open, setOpen] = useState(false);
  const form = useForm<FormInput, any, FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      user_id: undefined as any,
      no_anggota: "",
      full_name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      province: "",
      postal_code: "",
      identity_type: "",
      identity_number: "",
      occupation: "",
      initial_deposit: undefined,
    } as Partial<FormInput>,
  });

  async function onSubmit(values: FormValues) {
    await registerMember({
      user_id: values.user_id,
      no_anggota: values.no_anggota,
      full_name: values.full_name,
      email: values.email,
      phone: values.phone,
      address: values.address,
      city: values.city,
      province: values.province,
      postal_code: values.postal_code,
      identity_type: values.identity_type,
      identity_number: values.identity_number,
      occupation: values.occupation || undefined,
      initial_deposit: values.initial_deposit,
    });
    form.reset();
    setOpen(false);
  }

  const handleUserSelect = (user: User | null) => {
    if (!user) return;
    form.setValue("user_id", user.id);
    if (!form.getValues("full_name")) {
      form.setValue("full_name", user.full_name ?? "");
    }
    if (!form.getValues("email")) {
      form.setValue("email", user.email ?? "");
    }
  };

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
                      onChange={(val, option) => {
                        field.onChange(val as any);
                        handleUserSelect(option ?? null);
                      }}
                      getOptionValue={(u) => u.id}
                      getOptionLabel={(u) => u.full_name || u.email || String(u.id)}
                      queryKey={["users", "search-membership"]}
                      fetchPage={makePaginatedListFetcher<User>(listUsers, { limit: 10 })}
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
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Lengkap</FormLabel>
                  <FormControl>
                    <Input placeholder="Nama sesuai identitas" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="email@domain.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>No. Telepon</FormLabel>
                  <FormControl>
                    <Input placeholder="08xxxxxxxxxx" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alamat</FormLabel>
                  <FormControl>
                    <Input placeholder="Alamat domisili" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kota</FormLabel>
                    <FormControl>
                      <Input placeholder="Kota" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="province"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Provinsi</FormLabel>
                    <FormControl>
                      <Input placeholder="Provinsi" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="postal_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kode Pos</FormLabel>
                    <FormControl>
                      <Input placeholder="Kode pos" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="identity_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipe Identitas</FormLabel>
                    <FormControl>
                      <Input placeholder="KTP / SIM" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="identity_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>No. Identitas</FormLabel>
                    <FormControl>
                      <Input placeholder="Nomor identitas" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="occupation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pekerjaan (opsional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Pekerjaan" {...field} />
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
