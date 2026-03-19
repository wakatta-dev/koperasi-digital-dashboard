/** @format */

import { AuthLayout } from "./auth-layout";
import { AuthHeader } from "./auth-header";
import { AuthLoginForm } from "./login-form";

type LoginViewProps = {
  redirectTarget?: string;
};

export function LoginView({ redirectTarget }: LoginViewProps) {
  return (
    <AuthLayout heroPosition="left">
      <AuthHeader
        title="Masuk ke Akun Kamu"
        description="Masukkan email kamu di bawah untuk masuk ke dalam akun kamu"
      />
      <AuthLoginForm redirectTarget={redirectTarget} />
    </AuthLayout>
  );
}
