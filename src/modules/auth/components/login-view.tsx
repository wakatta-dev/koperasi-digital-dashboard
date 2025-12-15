/** @format */

import { Suspense } from "react";
import { AuthLayout } from "./auth-layout";
import { AuthHeader } from "./auth-header";
import { AuthLoginForm } from "./login-form";

export function LoginView() {
  return (
    <AuthLayout heroPosition="left">
      <AuthHeader
        title="Masuk ke Akun Kamu"
        description="Masukkan email kamu di bawah untuk masuk ke dalam akun kamu"
      />
      <Suspense fallback={null}>
        <AuthLoginForm />
      </Suspense>
    </AuthLayout>
  );
}
