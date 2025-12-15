/** @format */

"use client";

import Link from "next/link";
import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { register as registerUser } from "@/services/api/auth";
import { BUSINESS_TYPE_OPTIONS, DEFAULT_TENANT_ROLE_ID } from "../constants";
import { registerSchema, type RegisterFormValues } from "../schemas";
import { mapRegisterPayload } from "../utils";
import { usePasswordToggle } from "../hooks/use-password-toggle";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { showToastError, showToastSuccess } from "@/lib/toast";

type RegisterFormProps = {
  onRegistered?: (email: string) => void;
};

export function RegisterForm({ onRegistered }: RegisterFormProps) {
  const passwordToggle = usePasswordToggle(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      businessName: "",
      businessType: "",
      email: "",
      phone: "",
      password: "",
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setError("");
    setIsSubmitting(true);
    try {
      const payload = mapRegisterPayload(values, DEFAULT_TENANT_ROLE_ID);
      const response = await registerUser(payload);
      if (!response?.success) {
        throw response;
      }
      showToastSuccess("Akun berhasil dibuat", "Silakan verifikasi email kamu.");
      onRegistered?.(values.email);
    } catch (err: any) {
      setError("Pendaftaran gagal, silakan coba lagi.");
      showToastError("Pendaftaran gagal", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl border bg-card/80 p-6 shadow-lg backdrop-blur-sm">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {error ? (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}

          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Lengkap Pemilik</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Tuliskan nama lengkap kamu"
                    autoComplete="name"
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="businessName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Usaha</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Contoh: Koperasi Abadi Jaya"
                    autoComplete="organization"
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="businessType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Jenis Usaha</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={isSubmitting}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih jenis usaha" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {BUSINESS_TYPE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder="m@example.com"
                    autoComplete="email"
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nomor Telepon</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="tel"
                    placeholder="08xxxxxxx"
                    autoComplete="tel"
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      type={passwordToggle.type}
                      placeholder="Buat password"
                      autoComplete="new-password"
                      disabled={isSubmitting}
                      className="pr-12"
                    />
                    <button
                      type="button"
                      onClick={passwordToggle.toggle}
                      className="absolute inset-y-0 right-2 grid w-10 place-items-center text-muted-foreground transition-colors hover:text-foreground"
                      aria-label={passwordToggle.visible ? "Sembunyikan sandi" : "Tampilkan sandi"}
                    >
                      {passwordToggle.visible ? (
                        <EyeOffIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Memproses..." : "Daftar"}
          </Button>
        </form>
      </Form>

      <div className="relative my-6 text-center">
        <Separator />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs font-medium text-muted-foreground">
          Atau
        </span>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Sudah punya akun?{" "}
        <Link href="/login" className="font-semibold text-primary hover:text-primary/90">
          Masuk
        </Link>
      </p>
    </div>
  );
}
