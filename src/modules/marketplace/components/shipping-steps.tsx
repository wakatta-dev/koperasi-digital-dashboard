/** @format */

import { Stepper, type StepperStep } from "@/components/shared/navigation/stepper";

const STEPS: StepperStep[] = [
  { label: "Keranjang", icon: "check", state: "done" },
  { label: "Pengiriman", icon: "local_shipping", state: "active" },
  { label: "Pembayaran", icon: "payments", state: "pending" },
  { label: "Ulasan", icon: "rate_review", state: "pending" },
];

export function ShippingSteps() {
  return <Stepper steps={STEPS} progressPercent={33} />;
}
