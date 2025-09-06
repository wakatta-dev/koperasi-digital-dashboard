/** @format */

"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNotificationActions } from "@/hooks/queries/notifications";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const schema = z.object({
  category: z.string().min(1, "Kategori wajib"),
  message: z.string().min(2, "Pesan wajib"),
  targetType: z.enum(["SINGLE", "ALL", "GROUP"]).default("ALL"),
  tenantIDs: z.string().optional(), // comma separated
});

export function NotificationBroadcastDialog({ trigger }: { trigger?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const { vendorBroadcast } = useNotificationActions();

  const form = useForm<z.input<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      category: "SYSTEM",
      message: "",
      targetType: "ALL",
      tenantIDs: "",
    },
  });

  async function onSubmit(values: z.input<typeof schema>) {
    const ids = (values.tenantIDs || "")
      .split(",")
      .map((s) => Number(s.trim()))
      .filter((n) => !Number.isNaN(n) && n > 0);
    await vendorBroadcast.mutateAsync({
      category: values.category,
      message: values.message,
      targetType: values.targetType ?? "ALL",
      ...(ids.length ? { tenantIDs: ids } : {}),
    } as any);
    setOpen(false);
  }

  const Trigger = useMemo(() => {
    if (trigger) return trigger;
    return <Button type="button" variant="outline">Broadcast</Button>;
  }, [trigger]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{Trigger}</SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-xl p-0">
        <SheetHeader>
          <SheetTitle>Broadcast Notifikasi</SheetTitle>
          <SheetDescription>Kirim pengumuman ke tenant tertentu atau semua.</SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kategori</FormLabel>
                    <FormControl>
                      <Input placeholder="BILLING|SYSTEM|..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="targetType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih target" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ALL">ALL</SelectItem>
                        <SelectItem value="SINGLE">SINGLE</SelectItem>
                        <SelectItem value="GROUP">GROUP</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="tenantIDs"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tenant IDs (comma, optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. 12, 34, 56" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pesan</FormLabel>
                  <FormControl>
                    <Textarea rows={4} placeholder="Isi pesan" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SheetFooter>
              <Button type="submit">Kirim</Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
