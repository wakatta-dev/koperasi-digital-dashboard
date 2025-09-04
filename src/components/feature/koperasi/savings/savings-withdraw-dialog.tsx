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
import { withdrawSavings } from "@/services/api";
import { toast } from "sonner";

const schema = z.object({
  member_id: z.coerce.number().int().positive().optional(),
  type: z.string().min(1),
  amount: z.coerce.number().positive(),
  method: z.string().min(1),
  fee: z.coerce.number().nonnegative().optional(),
});

type FormInput = z.input<typeof schema>;
type FormValues = z.output<typeof schema>;

type Props = { memberId?: string; onSuccess?: () => void };

export function SavingsWithdrawDialog({ memberId, onSuccess }: Props) {
  const [open, setOpen] = useState(false);
  const form = useForm<FormInput, any, FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { member_id: memberId ? Number(memberId) : undefined, type: "sukarela", amount: 0, method: "transfer", fee: undefined } as Partial<FormInput>,
  });

  async function onSubmit(values: FormValues) {
    try {
      const targetMemberId = memberId ? Number(memberId) : Number(values.member_id);
      if (!targetMemberId) throw new Error("member_id kosong");
      await withdrawSavings(targetMemberId, { type: values.type, amount: values.amount, method: values.method, fee: values.fee });
      toast.success("Penarikan diajukan (pending)");
      setOpen(false);
      onSuccess?.();
    } catch (e: any) {
      toast.error(e?.message || "Gagal mengajukan penarikan");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          Penarikan
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Penarikan Simpanan</DialogTitle>
          <DialogDescription>Ajukan penarikan simpanan.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            {!memberId && (
              <FormField name="member_id" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>ID Anggota</FormLabel>
                    <FormControl>
                    <Input type="number" placeholder="123" {...field} value={field.value as any} />
                    </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            )}
            <FormField name="type" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Jenis Simpanan</FormLabel>
                <FormControl>
                  <Input placeholder="pokok|wajib|sukarela" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name="amount" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Jumlah</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="100000" {...field} value={field.value as any} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name="method" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Metode</FormLabel>
                <FormControl>
                  <Input placeholder="transfer|cash|gateway" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name="fee" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Biaya (opsional)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="1000" {...field} value={field.value as any} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <DialogFooter>
              <Button type="submit" disabled={form.formState.isSubmitting}>Ajukan</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
