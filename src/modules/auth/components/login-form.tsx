/** @format */

"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { getSession } from "next-auth/react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { login } from "@/services/auth";
import { authLoginSchema, type AuthLoginValues } from "../schemas";
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
import { Separator } from "@/components/ui/separator";

export function AuthLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const passwordToggle = usePasswordToggle(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AuthLoginValues>({
    resolver: zodResolver(authLoginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onSubmit",
  });

  const handleRedirect = async () => {
    const session: any = await getSession();
    const redirectTarget = searchParams?.get("redirect");
    if (redirectTarget) {
      router.push(redirectTarget);
      return;
    }
    if (session?.user?.jenis_tenant) {
      const { jenis_tenant: jenisTenant } = session.user;
      if (jenisTenant === "bumdes") {
        router.push(`/${jenisTenant}/dashboard`);
        return;
      }
      router.push(`/${jenisTenant}/account`);
      return;
    }
    router.push("/");
  };

  const onSubmit = async (values: AuthLoginValues) => {
    setError("");
    setIsSubmitting(true);
    try {
      await login(values.email, values.password);
      await handleRedirect();
    } catch {
      setError("Gagal masuk. Periksa kembali email dan kata sandi kamu.");
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
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Kata sandi</FormLabel>
                  <Link
                    href="/forgot-password"
                    className="text-sm font-medium text-primary hover:text-primary/90"
                  >
                    Lupa kata sandi?
                  </Link>
                </div>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      type={passwordToggle.type}
                      placeholder="Masukkan kata sandi"
                      autoComplete="current-password"
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
            {isSubmitting ? "Memproses..." : "Masuk"}
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
        Belum punya akun?{" "}
        <Link
          href="/register"
          className="font-semibold text-primary hover:text-primary/90"
        >
          Daftar
        </Link>
      </p>
    </div>
  );
}
