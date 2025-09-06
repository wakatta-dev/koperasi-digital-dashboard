/** @format */

"use client";

import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNotificationActions } from "@/hooks/queries/notifications";
import { createNotificationSchema } from "@/validators/notification";
import { z } from "zod";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PlusIcon } from "lucide-react";
import { useConfirm } from "@/hooks/use-confirm";

type Props = {
  trigger?: React.ReactNode;
};

export function NotificationCreateDialog({ trigger }: Props) {
  const [open, setOpen] = useState(false);
  const { create } = useNotificationActions();
  const confirm = useConfirm();

  const form = useForm<z.input<typeof createNotificationSchema>>({
    resolver: zodResolver(createNotificationSchema),
    defaultValues: {
      tenant_id: undefined,
      channel: "IN_APP",
      type: "SYSTEM",
      category: "SYSTEM",
      target_type: "ALL",
      title: "",
      body: "",
      status: "PUBLISHED",
    },
  });

  const onSubmit = async (values: z.input<typeof createNotificationSchema>) => {
    try {
      const ok = await confirm({
        variant: "create",
        title: "Buat notifikasi?",
        description: `Notifikasi '${values.title}' akan dibuat/dikirimkan.`,
        confirmText: "Buat",
      });
      if (!ok) return;
      // Send both body and a legacy message field for UI compatibility
      await create.mutateAsync({
        tenant_id: values.tenant_id,
        channel: values.channel,
        type: values.type,
        category: values.category,
        target_type: values.target_type,
        title: values.title,
        body: values.body,
        message: values.body,
        status: values.status,
      } as any);
      setOpen(false);
    } catch (_e) {}
  };

  const Trigger = useMemo(() => {
    if (trigger) return trigger;
    return (
      <Button type="button">
        <PlusIcon className="w-4 h-4 mr-2" />
        Create Notification
      </Button>
    );
  }, [trigger]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{Trigger}</SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-xl p-0">
        <SheetHeader>
          <SheetTitle>Create Notification</SheetTitle>
          <SheetDescription>
            Isi data untuk menambahkan notifikasi baru.
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="channel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Channel</FormLabel>
                    <FormControl>
                      <select
                        className="border rounded px-3 py-2 w-full"
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                      >
                        <option value="IN_APP">IN_APP</option>
                        <option value="EMAIL">EMAIL</option>
                        <option value="PUSH">PUSH</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <FormControl>
                      <select
                        className="border rounded px-3 py-2 w-full"
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                      >
                        <option value="SYSTEM">SYSTEM</option>
                        <option value="BILLING">BILLING</option>
                        <option value="RAT">RAT</option>
                        <option value="LOAN">LOAN</option>
                        <option value="SAVINGS">SAVINGS</option>
                        <option value="CUSTOM">CUSTOM</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kategori</FormLabel>
                    <FormControl>
                      <Input placeholder="Kategori notifikasi (mis. BILLING)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="target_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target</FormLabel>
                    <FormControl>
                      <select
                        className="border rounded px-3 py-2 w-full"
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                      >
                        <option value="ALL">ALL</option>
                        <option value="SINGLE">SINGLE</option>
                        <option value="GROUP">GROUP</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="tenant_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tenant ID (opsional)</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} placeholder="mis. 123" value={(field.value as any) ?? ""} onChange={(e) => field.onChange(e.target.value)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <select
                        className="border rounded px-3 py-2 w-full"
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                      >
                        <option value="DRAFT">DRAFT</option>
                        <option value="PUBLISHED">PUBLISHED</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Judul</FormLabel>
                  <FormControl>
                    <Input placeholder="Judul notifikasi" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="body"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Isi Pesan</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Isi pesan" rows={4} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <SheetFooter className="mt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Batal
              </Button>
              <Button type="submit">Buat</Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
