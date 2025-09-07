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
import AsyncCombobox from "@/components/ui/async-combobox";
import { listMembers } from "@/services/api";
import { makePaginatedListFetcher } from "@/lib/async-fetchers";
import type { MemberListItem } from "@/types/api";

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
                  <FormLabel>Anggota</FormLabel>
                    <FormControl>
                    <AsyncCombobox<MemberListItem, number>
                      value={(field.value as any) ?? null}
                      onChange={(val) => field.onChange(val as any)}
                      getOptionValue={(m) => m.id}
                      getOptionLabel={(m) => m.user?.full_name || m.no_anggota || String(m.id)}
                      queryKey={["members", "search-savings-withdraw"]}
                      fetchPage={makePaginatedListFetcher<MemberListItem>(listMembers, { limit: 10 })}
                      placeholder="Cari anggota (nama/email/no. anggota)"
                      emptyText="Tidak ada anggota"
                      notReadyText="Ketik untuk mencari"
                      minChars={1}
                      renderOption={(m) => (
                        <div className="flex flex-col">
                          <span className="font-medium">{m.user?.full_name || `Anggota #${m.id}`}</span>
                          <span className="text-xs text-muted-foreground">{m.no_anggota} • {m.user?.email || '-'}</span>
                        </div>
                      )}
                      renderValue={(val) => <span>{val ? `Anggota #${val}` : ""}</span>}
                    />
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
