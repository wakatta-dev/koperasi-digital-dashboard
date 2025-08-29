/** @format */

"use client";

import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Plan } from "@/types/api";
import { useBillingActions } from "@/hooks/queries/billing";
import { upsertPlanSchema } from "@/validators/plan";
import { z } from "zod";
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
import { PlusIcon, Edit } from "lucide-react";

type Props = {
  plan?: Plan;
  trigger?: React.ReactNode;
};

export function PlanUpsertDialog({ plan, trigger }: Props) {
  const isEdit = !!plan;
  const [open, setOpen] = useState(false);
  const { createPlan, updatePlan } = useBillingActions();

  const form = useForm<z.input<typeof upsertPlanSchema>>({
    resolver: zodResolver(upsertPlanSchema),
    defaultValues: isEdit
      ? {
          name: plan!.name,
          price: plan!.price,
          duration_months: plan!.duration_months,
        }
      : {
          name: "",
          price: 0,
          duration_months: undefined,
        },
  });

  const onSubmit = async (values: z.input<typeof upsertPlanSchema>) => {
    try {
      const payload = {
        name: values.name,
        price: Number(values.price),
        duration_months:
          values.duration_months === undefined ||
          values.duration_months === null ||
          values.duration_months === ("" as any)
            ? undefined
            : Number(values.duration_months),
      } as Partial<Plan>;
      if (isEdit) {
        await updatePlan.mutateAsync({ id: plan!.id, payload });
      } else {
        await createPlan.mutateAsync(payload);
      }
      setOpen(false);
    } catch (_e) {
      // handled upstream
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
        Add Plan
      </Button>
    );
  }, [trigger, isEdit]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{Trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Plan" : "Create Plan"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Ubah data paket langganan."
              : "Isi data untuk menambahkan paket langganan."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Paket</FormLabel>
                  <FormControl>
                    <Input placeholder="Contoh: Basic" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
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

            <FormField
              control={form.control}
              name="duration_months"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Durasi (bulan)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      placeholder="Opsional"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Batal
              </Button>
              <Button type="submit">{isEdit ? "Simpan" : "Buat"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
