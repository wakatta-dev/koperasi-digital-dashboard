/** @format */

import { Stepper, type StepperStep } from "@/components/shared/navigation/stepper";

const STEPS: StepperStep[] = [
  { label: "Keranjang", icon: "shopping_cart", state: "active" },
  { label: "Pengiriman", icon: "local_shipping", state: "pending" },
  { label: "Pembayaran", icon: "payments", state: "pending" },
  { label: "Ulasan", icon: "rate_review", state: "pending" },
];

export function CheckoutSteps() {
  return <Stepper steps={STEPS} activeLabelTone="primary" />;
}
