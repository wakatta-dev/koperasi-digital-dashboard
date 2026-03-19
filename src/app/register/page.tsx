/** @format */

import type { Metadata } from "next";

import { RegisterView } from "@/modules/auth/components/register-view";

export const metadata: Metadata = {
  title: "Register - Koperasi Digital",
  description: "Register page.",
};

export default function RegisterPage() {
  return (
    <div data-testid="guest-register-page-root">
      <RegisterView />
    </div>
  );
}
