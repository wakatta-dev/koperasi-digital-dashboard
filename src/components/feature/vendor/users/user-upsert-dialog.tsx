/** @format */

"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { User } from "@/types/api";
import { useUserActions } from "@/hooks/queries/users";
import { useRoles } from "@/hooks/queries/roles";
import { createUserSchema, updateUserSchema } from "@/validators/user";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { PlusIcon, Edit } from "lucide-react";
import { useConfirm } from "@/hooks/use-confirm";

type Props = {
  user?: User;
  trigger?: React.ReactNode;
};

export function UserUpsertDialog({ user, trigger }: Props) {
  const isEdit = !!user;
  const [open, setOpen] = useState(false);
  const { create, update, patchStatus } = useUserActions();
  const { data: roles = [] } = useRoles();
  const confirm = useConfirm();

  const form = useForm<any>({
    resolver: zodResolver(isEdit ? updateUserSchema : createUserSchema),
    defaultValues: isEdit
      ? {
          full_name: user!.full_name,
          email: user!.email,
          tenant_role_id: user!.tenant_role_id,
          status: !!user!.status,
        }
      : {
          full_name: "",
          email: "",
          tenant_role_id: undefined as any,
          password: "",
          status: true,
        },
  });

  const onSubmit = async (values: any) => {
    try {
      const ok = await confirm({
        variant: isEdit ? "edit" : "create",
        title: isEdit ? "Simpan perubahan user?" : "Buat user baru?",
        description: isEdit
          ? `Perubahan untuk ${values.email} akan disimpan.`
          : `Akun ${values.email} akan dibuat.`,
        confirmText: isEdit ? "Simpan" : "Buat",
      });
      if (!ok) return;
      if (isEdit) {
        await update.mutateAsync({
          id: user!.id,
          payload: {
            full_name: values.full_name,
            email: values.email,
            tenant_role_id: Number(values.tenant_role_id),
          },
        });
        // Patch status separately to match docs (PATCH /users/{id}/status)
        if (typeof values.status === "boolean" && values.status !== !!user!.status) {
          await patchStatus.mutateAsync({ id: user!.id, status: !!values.status });
        }
      } else {
        const payload: any = {
          full_name: values.full_name,
          email: values.email,
          tenant_role_id: Number(values.tenant_role_id),
          // server expects `password`; cast to any to satisfy typing
          password: values.password,
        };
        const created = await create.mutateAsync(payload);
        // If user was toggled off at creation, patch status afterwards per docs
        if (created?.id && values.status === false) {
          await patchStatus.mutateAsync({ id: created.id, status: false });
        }
      }
      setOpen(false);
    } catch (_e) {
      // error handling via toasts/server; keep dialog open
    }
  };

  const Trigger = useMemo(() => {
    if (trigger) return trigger;
    return isEdit ? (
      <Button variant="ghost" size="icon" type="button">
        <Edit className="h-4 w-4" />
      </Button>
    ) : (
      <Button type="button">
        <PlusIcon className="w-4 h-4 mr-2" />
        Add User
      </Button>
    );
  }, [trigger, isEdit]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{Trigger}</SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-xl p-0">
        <SheetHeader>
          <SheetTitle>{isEdit ? "Edit User" : "Create User"}</SheetTitle>
          <SheetDescription>
            {isEdit
              ? "Ubah data pengguna lalu simpan."
              : "Isi data untuk menambahkan pengguna baru."}
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4">
            <FormField
              control={form.control}
              name={"full_name" as any}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Lengkap</FormLabel>
                  <FormControl>
                    <Input placeholder="Nama lengkap" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={"email" as any}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="email@contoh.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {!isEdit && (
              <FormField
                control={form.control}
                name={"password" as any}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name={"tenant_role_id" as any}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    value={String(field.value ?? "")}
                    onValueChange={(v) => field.onChange(Number(v))}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {roles.map((r: any) => (
                        <SelectItem key={r.id} value={String(r.id)}>
                          {r.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={"status" as any}
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Status</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Aktifkan untuk mengaktifkan akun pengguna
                    </p>
                  </div>
                  <FormControl>
                    <Switch checked={!!field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <SheetFooter className="mt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Batal
              </Button>
              <Button type="submit">{isEdit ? "Simpan" : "Buat"}</Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
