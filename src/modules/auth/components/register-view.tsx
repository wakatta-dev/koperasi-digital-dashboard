/** @format */

"use client";

import { useState } from "react";
import { AuthLayout } from "./auth-layout";
import { AuthHeader } from "./auth-header";
import { RegisterForm } from "./register-form";
import { VerificationModal } from "./verification-modal";
import { showToastSuccess } from "@/lib/toast";

export function RegisterView() {
  const [showVerification, setShowVerification] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");

  const handleRegistered = (email: string) => {
    setPendingEmail(email);
    setShowVerification(true);
  };

  const handleVerify = async (otp: string) => {
    // Integrate with verification endpoint when available
    showToastSuccess("Verifikasi berhasil", `Kode ${otp} diterima.`);
  };

  return (
    <>
      <AuthLayout heroPosition="right">
        <AuthHeader
          title="Daftar ke 3Portals"
          description="Lengkapi data di bawah untuk mendaftar di 3Portals"
        />
        <RegisterForm onRegistered={handleRegistered} />
      </AuthLayout>

      <VerificationModal
        open={showVerification}
        email={pendingEmail}
        onClose={() => setShowVerification(false)}
        onSubmit={handleVerify}
      />
    </>
  );
}
