/** @format */

import { Stepper } from "@/components/shared/navigation/stepper";
import { CHECKOUT_STEPS } from "../../config/checkoutSteps.config";

const iconMap: Record<string, string> = {
  cart: "check",
  payment: "payments",
  confirmation: "task_alt",
};

export function PaymentSteps() {
  const steps = CHECKOUT_STEPS.map((step) => ({
    label: step.label,
    icon: iconMap[step.id],
    state: step.id === "cart" ? "done" : step.id === "payment" ? "active" : "pending",
  }));

  const CheckoutStepper = Stepper as any;

  return <CheckoutStepper steps={steps} progressPercent={66} variant="checkout" />;
}
