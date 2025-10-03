/** @format */

"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Plan } from "@/types/api";
import { useBillingActions } from "@/hooks/queries/billing";
import { upsertPlanSchema } from "@/validators/plan";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PlusIcon, Edit } from "lucide-react";
import { listModules } from "@/services/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useConfirm } from "@/hooks/use-confirm";

type Props = {
  plan?: Plan;
  trigger?: React.ReactNode;
};

export function PlanUpsertDialog({ plan, trigger }: Props) {
  const isEdit = !!plan;
  const [open, setOpen] = useState(false);
  const { createPlan, updatePlan } = useBillingActions();
  const [modules, setModules] = useState<Array<{ id: string; code: string; name: string }>>([]);
  const confirm = useConfirm();

  useEffect(() => {
    (async () => {
      try {
        const res = await listModules().catch(() => null);
        setModules(((res?.data as any[]) ?? []).map((m: any) => ({ id: String(m.id ?? m.code), code: m.code, name: m.name })));
      } catch {
        setModules([]);
      }
    })();
  }, []);

  const form = useForm<z.input<typeof upsertPlanSchema>>({
    resolver: zodResolver(upsertPlanSchema),
    defaultValues: isEdit
      ? {
          name: plan!.name,
          type: (plan as any).type ?? "package",
          module_code: (plan as any).module_code ?? "",
          price: plan!.price,
          duration_months: plan!.duration_months,
        }
      : {
          name: "",
          type: "package",
          module_code: "",
          price: 0,
          duration_months: undefined,
        },
  });

  const onSubmit = async (values: z.input<typeof upsertPlanSchema>) => {
    try {
      const payload = {
        name: values.name,
        type: values.type,
        module_code: values.module_code,
        price: Number(values.price),
        duration_months:
          values.duration_months === undefined ||
          values.duration_months === null ||
          values.duration_months === ("" as any)
            ? undefined
            : Number(values.duration_months),
      } as Partial<Plan>;
      if (isEdit) {
        const ok = await confirm({
          variant: "edit",
          title: "Simpan perubahan plan?",
          description: `Plan ${plan!.name} akan diperbarui.`,
          confirmText: "Simpan",
        });
        if (!ok) return;
        await updatePlan.mutateAsync({ id: plan!.id, payload });
      } else {
        const ok = await confirm({
          variant: "create",
          title: "Buat plan baru?",
          description: `Plan ${values.name || "baru"} akan dibuat.`,
          confirmText: "Buat",
        });
        if (!ok) return;
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
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{Trigger}</SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-xl p-0">
        <SheetHeader>
          <SheetTitle>{isEdit ? "Edit Plan" : "Create Plan"}</SheetTitle>
          <SheetDescription>
            {isEdit
              ? "Ubah data paket langganan."
              : "Isi data untuk menambahkan paket langganan."}
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipe</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih tipe" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="package">package</SelectItem>
                        <SelectItem value="addon">addon</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="module_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Module</FormLabel>
                    {modules.length ? (
                      <Select
                        value={field.value || undefined}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih module" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {modules.map((m) => (
                            <SelectItem key={m.id} value={m.code}>
                              {m.name} ({m.code})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input placeholder="mis. BILLING" {...field} />
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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

            <SheetFooter className="mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
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
