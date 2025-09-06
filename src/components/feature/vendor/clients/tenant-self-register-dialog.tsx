/** @format */

"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { listVendorPlans, registerTenantVendor, verifyTenantRegistration } from "@/services/api";
import { toast } from "sonner";

const regSchema = z.object({
  name: z.string().min(2),
  domain: z.string().min(2),
  type: z.string().min(2),
  full_name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  primary_plan_id: z.coerce.number().int().positive(),
});

type RegInput = z.input<typeof regSchema>;
type RegValues = z.output<typeof regSchema>;

export function TenantSelfRegisterDialog() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"form" | "verify">("form");
  const [regId, setRegId] = useState<string>("");
  const [plans, setPlans] = useState<any[]>([]);
  const form = useForm<RegInput, any, RegValues>({
    resolver: zodResolver(regSchema),
    defaultValues: { name: "", domain: "", type: "koperasi", full_name: "", email: "", password: "", primary_plan_id: undefined } as Partial<RegInput>,
  });

  useEffect(() => {
    (async () => {
      const res = await listVendorPlans({ limit: 50 }).catch(() => null);
      setPlans(res?.data ?? []);
    })();
  }, []);

  async function onSubmit(values: RegValues) {
    try {
      const res = await registerTenantVendor(values as any);
      if (!res.success) throw new Error(res.message);
      setRegId((res.data as any)?.registration_id || "");
      setStep("verify");
    } catch (e: any) {
      toast.error(e?.message || "Gagal registrasi tenant");
    }
  }

  async function onVerify(data: { otp: string }) {
    try {
      const res = await verifyTenantRegistration({ registration_id: regId, otp: data.otp });
      if (!res.success) throw new Error(res.message);
      toast.success("Tenant terverifikasi");
      setOpen(false);
    } catch (e: any) {
      toast.error(e?.message || "Verifikasi gagal");
    }
  }

  return (
    <Sheet open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setStep("form"); setRegId(""); } }}>
      <SheetTrigger asChild>
        <Button variant="outline">Self-Register (OTP)</Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-2xl p-0">
        <SheetHeader>
          <SheetTitle>Registrasi Tenant (OTP)</SheetTitle>
          <SheetDescription>Daftarkan tenant baru, lalu verifikasi OTP.</SheetDescription>
        </SheetHeader>

        {step === "form" && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 p-4">
              <FormField name="name" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama</FormLabel>
                  <FormControl>
                    <Input placeholder="KSP Maju" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField name="domain" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Domain</FormLabel>
                  <FormControl>
                    <Input placeholder="ksp-maju.id" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField name="type" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipe</FormLabel>
                  <FormControl>
                    <Input placeholder="koperasi|umkm|bumdes" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField name="full_name" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Admin</FormLabel>
                  <FormControl>
                    <Input placeholder="Admin Awal" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField name="email" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="admin@ksp-maju.id" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField name="password" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField name="primary_plan_id" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Paket</FormLabel>
                  <FormControl>
                    <select className="border rounded px-3 py-2 w-full" value={(field.value as any) ?? ""} onChange={(e) => field.onChange(Number(e.target.value || 0))}>
                      <option value="">Pilih paket</option>
                      {plans.map((p: any) => (
                        <option key={p.id} value={p.id}>{p.name} — Rp {p.price}</option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <SheetFooter>
                <Button type="submit">Daftarkan</Button>
              </SheetFooter>
            </form>
          </Form>
        )}

        {step === "verify" && (
          <form className="space-y-3 p-4" onSubmit={(e) => { e.preventDefault(); const otp = (e.currentTarget.elements.namedItem("otp") as HTMLInputElement).value; onVerify({ otp }); }}>
            <div>
              <div className="text-sm text-muted-foreground">Registration ID</div>
              <div className="text-xs break-all">{regId}</div>
            </div>
            <div>
              <Input name="otp" placeholder="Masukkan OTP" />
            </div>
            <SheetFooter>
              <Button type="button" variant="outline" onClick={() => setStep("form")}>Kembali</Button>
              <Button type="submit">Verifikasi</Button>
            </SheetFooter>
          </form>
        )}
      </SheetContent>
    </Sheet>
  );
}
