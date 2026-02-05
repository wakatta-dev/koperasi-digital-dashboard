/** @format */

import { Stepper } from "@/components/shared/navigation/stepper";
import { CHECKOUT_STEPS } from "../../config/checkoutSteps.config";

const iconMap: Record<string, string> = {
  cart: "check",
  shipping: "check",
  payment: "payments",
  review: "rate_review",
};

export function PaymentSteps() {
  const steps = CHECKOUT_STEPS.map((step) => ({
    label: step.label,
    icon: iconMap[step.id],
    state:
      step.id === "cart" || step.id === "shipping"
        ? "done"
        : step.id === "payment"
          ? "active"
          : "pending",
  }));

  const CheckoutStepper = Stepper as any;

  return <CheckoutStepper steps={steps} progressPercent={66} variant="checkout" />;
}
