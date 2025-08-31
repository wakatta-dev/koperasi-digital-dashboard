/** @format */

"use client";

import { useMemo, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createInvoiceSchema } from "@/validators/invoice";
import { z } from "zod";
import { useBillingActions } from "@/hooks/queries/billing";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { PlusIcon, Trash2 } from "lucide-react";
import { useConfirm } from "@/hooks/use-confirm";

type Props = {
  trigger?: React.ReactNode;
};

export function InvoiceUpsertDialog({ trigger }: Props) {
  const [open, setOpen] = useState(false);
  const { createVendorInv } = useBillingActions();
  const confirm = useConfirm();

  const form = useForm<z.input<typeof createInvoiceSchema>>({
    resolver: zodResolver(createInvoiceSchema),
    defaultValues: {
      number: "",
      issued_at: new Date().toISOString().slice(0, 10),
      due_date: undefined,
      items: [
        { description: "Langganan", quantity: 1, price: 0 },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({ control: form.control, name: "items" });

  const total = (form.watch("items") || []).reduce((acc, it) => {
    const qty = Number(it.quantity || 0);
    const price = Number(it.price || 0);
    return acc + qty * price;
  }, 0);

  const onSubmit = async (values: z.input<typeof createInvoiceSchema>) => {
    try {
      const payload: any = {
        number: values.number,
        issued_at: values.issued_at,
        due_date: values.due_date || undefined,
        items: values.items.map((it) => ({
          description: it.description,
          quantity: Number(it.quantity),
          price: Number(it.price),
        })),
        total,
        tenant_id: values.tenant_id ?? undefined,
        subscription_id: values.subscription_id ?? undefined,
      };
      const ok = await confirm({
        variant: "create",
        title: "Buat invoice?",
        description: `Invoice ${values.number || "baru"} akan dibuat dengan total ${new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(total)}.`,
        confirmText: "Buat",
      });
      if (!ok) return;
      await createVendorInv.mutateAsync(payload);
      setOpen(false);
    } catch (_e) {}
  };

  const Trigger = useMemo(() => {
    if (trigger) return trigger;
    return (
      <Button type="button">
        <PlusIcon className="w-4 h-4 mr-2" />
        Create Invoice
      </Button>
    );
  }, [trigger]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{Trigger}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Invoice</DialogTitle>
          <DialogDescription>
            Isi data invoice dan item. Total dihitung otomatis.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nomor</FormLabel>
                    <FormControl>
                      <Input placeholder="INV-001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="issued_at"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tanggal Terbit</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="due_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jatuh Tempo</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
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
                      <Input type="number" min={1} placeholder="mis. 123" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subscription_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subscription ID (opsional)</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} placeholder="mis. 456" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Item</h4>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => append({ description: "", quantity: 1 as any, price: 0 as any })}
                >
                  <PlusIcon className="h-4 w-4 mr-2" /> Tambah Item
                </Button>
              </div>

              {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                  <div className="md:col-span-6">
                    <FormField
                      control={form.control}
                      name={`items.${index}.description` as const}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Deskripsi</FormLabel>
                          <FormControl>
                            <Input placeholder="Deskripsi item" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <FormField
                      control={form.control}
                      name={`items.${index}.quantity` as const}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Qty</FormLabel>
                          <FormControl>
                            <Input type="number" min={1} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="md:col-span-3">
                    <FormField
                      control={form.control}
                      name={`items.${index}.price` as const}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Harga</FormLabel>
                          <FormControl>
                            <Input type="number" min={0} step={1000} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="md:col-span-1 flex md:justify-end">
                    <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between border-t pt-3">
              <span className="text-sm text-muted-foreground">Total</span>
              <span className="font-semibold">{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(total)}</span>
            </div>

            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Batal
              </Button>
              <Button type="submit">Buat</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
