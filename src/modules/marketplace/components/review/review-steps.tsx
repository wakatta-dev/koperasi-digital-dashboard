/** @format */

import { Stepper } from "@/components/shared/navigation/stepper";
import { CHECKOUT_STEPS } from "../../config/checkoutSteps.config";

const iconMap: Record<string, string> = {
  cart: "check",
  shipping: "check",
  payment: "check",
  review: "rate_review",
};

export function ReviewSteps() {
  const steps = CHECKOUT_STEPS.map((step) => ({
    label: step.label,
    icon: iconMap[step.id],
    state: step.id === "review" ? "active" : "done",
  }));

  const CheckoutStepper = Stepper as any;

  return <CheckoutStepper steps={steps} progressPercent={100} variant="checkout" />;
}
