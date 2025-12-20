/** @format */

import { Stepper, type StepperStep } from "@/components/shared/navigation/stepper";

const STEPS: StepperStep[] = [
  { label: "Keranjang", icon: "check", state: "done" },
  { label: "Pengiriman", icon: "check", state: "done" },
  { label: "Pembayaran", icon: "check", state: "done" },
  { label: "Ulasan", icon: "rate_review", state: "active" },
];

export function ReviewSteps() {
  return <Stepper steps={STEPS} progressPercent={100} />;
}
