/** @format */

import type { Metadata } from "next";

import { LoginView } from "@/modules/auth/components/login-view";

export const metadata: Metadata = {
  title: "Login - Koperasi Digital",
  description: "Login page.",
};

export default function LoginPage() {
  return (
    <div data-testid="guest-login-page-root">
      <LoginView />
    </div>
  );
}
