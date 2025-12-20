/** @format */

import { Stepper } from "@/components/shared/navigation/stepper";
import { CHECKOUT_STEPS } from "../config/checkoutSteps.config";

const iconMap: Record<string, string> = {
  cart: "check",
  shipping: "local_shipping",
  payment: "payments",
  review: "rate_review",
};

export function ShippingSteps() {
  const steps = CHECKOUT_STEPS.map((step) => ({
    label: step.label,
    icon: iconMap[step.id],
    state:
      step.id === "cart"
        ? "done"
        : step.id === "shipping"
          ? "active"
          : "pending",
  }));

  const CheckoutStepper = Stepper as any;

  return <CheckoutStepper steps={steps} progressPercent={33} variant="checkout" />;
}
