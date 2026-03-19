/** @format */

import type { Metadata } from "next";

import { LoginView } from "@/modules/auth/components/login-view";

export const metadata: Metadata = {
  title: "Login - Koperasi Digital",
  description: "Login page.",
};

type LoginPageProps = {
  searchParams?: Promise<{ redirect?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const searchParamsResolved = await searchParams;
  return (
    <div data-testid="guest-login-page-root">
      <LoginView redirectTarget={searchParamsResolved?.redirect} />
    </div>
  );
}
