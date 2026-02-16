/** @format */

import { Stepper } from "@/components/shared/navigation/stepper";
import { CHECKOUT_STEPS } from "../../config/checkoutSteps.config";

const iconMap: Record<string, string> = {
  cart: "shopping_cart",
  payment: "payments",
  confirmation: "task_alt",
};

export function CheckoutSteps() {
  const steps = CHECKOUT_STEPS.map((step) => ({
    label: step.label,
    icon: iconMap[step.id],
    state: step.id === "cart" ? "active" : "pending",
  }));

  const CheckoutStepper = Stepper as any;

  return <CheckoutStepper steps={steps} activeLabelTone="primary" variant="checkout" />;
}
