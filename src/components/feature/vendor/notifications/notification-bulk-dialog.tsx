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
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const schema = z.object({
  message: z.string().min(2, "Pesan wajib"),
  targetType: z.enum(["SINGLE", "ALL", "GROUP"]).default("ALL"),
  segment: z.enum(["VENDOR", "KOPERASI", "UMKM", "BUMDES"]).default("KOPERASI"),
});

export function NotificationBulkDialog({ trigger }: { trigger?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const { vendorBulk } = useNotificationActions();

  const form = useForm<z.input<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      message: "",
      targetType: "ALL",
      segment: "KOPERASI",
    },
  });

  async function onSubmit(values: z.output<typeof schema>) {
    await vendorBulk.mutateAsync(values as any);
    setOpen(false);
  }

  const Trigger = useMemo(() => {
    if (trigger) return trigger;
    return <Button type="button" variant="outline">Bulk</Button>;
  }, [trigger]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{Trigger}</SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-xl p-0">
        <SheetHeader>
          <SheetTitle>Bulk Notifikasi</SheetTitle>
          <SheetDescription>Buat antrian bulk notifikasi berdasarkan segment.</SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="segment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Segment</FormLabel>
                    <FormControl>
                      <select
                        className="border rounded px-3 py-2 w-full"
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                      >
                        <option value="VENDOR">VENDOR</option>
                        <option value="KOPERASI">KOPERASI</option>
                        <option value="UMKM">UMKM</option>
                        <option value="BUMDES">BUMDES</option>
                      </select>
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
              <Button type="submit">Jadwalkan</Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
