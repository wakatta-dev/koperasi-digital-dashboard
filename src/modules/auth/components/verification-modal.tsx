/** @format */

"use client";

import { useEffect, useState } from "react";
import { CheckCircle2Icon } from "lucide-react";
import { OTP_LENGTH } from "../constants";
import { OtpInput } from "./otp-input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type VerificationModalProps = {
  open: boolean;
  email?: string;
  onClose: () => void;
  onSubmit: (otp: string) => Promise<void> | void;
};

export function VerificationModal({
  open,
  email,
  onClose,
  onSubmit,
}: VerificationModalProps) {
  const [otp, setOtp] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      setOtp("");
      setSubmitting(false);
    }
  }, [open]);

  const handleSubmit = async () => {
    if (otp.length < OTP_LENGTH) return;
    setSubmitting(true);
    try {
      await onSubmit(otp);
    } finally {
      setSubmitting(false);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="max-w-md" showCloseButton={false}>
        <div className="flex flex-col items-center text-center">
          <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-green-50 text-green-600 dark:bg-green-900/30">
            <CheckCircle2Icon className="h-10 w-10" />
          </div>
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-xl font-semibold">
              Akun berhasil dibuat
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Masukkan kode verifikasi yang telah dikirimkan ke{" "}
              <span className="font-medium text-foreground">{email}</span>
            </DialogDescription>
          </DialogHeader>
          <OtpInput value={otp} onChange={setOtp} className="mt-6 w-full" />
          <Button
            className="mt-6 w-full"
            onClick={handleSubmit}
            disabled={otp.length < OTP_LENGTH || submitting}
          >
            {submitting ? "Memverifikasi..." : "Verifikasi"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
