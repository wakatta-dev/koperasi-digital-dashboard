/** @format */

import { Stepper, type StepperStep } from "@/components/shared/navigation/stepper";

const STEPS: StepperStep[] = [
  { label: "Keranjang", icon: "check", state: "done" },
  { label: "Pengiriman", icon: "check", state: "done" },
  { label: "Pembayaran", icon: "payments", state: "active" },
  { label: "Ulasan", icon: "rate_review", state: "pending" },
];

export function PaymentSteps() {
  return <Stepper steps={STEPS} progressPercent={66} />;
}
