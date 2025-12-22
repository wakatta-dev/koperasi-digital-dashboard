/** @format */
"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CheckoutState = {
  fulfillment: "PICKUP" | "DELIVERY";
  name: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
  paymentMethod: string;
};

type CheckoutActions = {
  setField: <K extends keyof CheckoutState>(
    key: K,
    value: CheckoutState[K]
  ) => void;
  reset: () => void;
};

const defaultState: CheckoutState = {
  fulfillment: "PICKUP",
  name: "",
  phone: "",
  email: "",
  address: "",
  notes: "",
  paymentMethod: "",
};

export const useCheckoutStore = create<CheckoutState & CheckoutActions>()(
  persist(
    (set) => ({
      ...defaultState,
      setField: (key, value) => set({ [key]: value } as any),
      reset: () => set(defaultState),
    }),
    { name: "marketplace-checkout" }
  )
);

export const isShippingValid = (state: CheckoutState) => {
  if (!state.name.trim() || !state.phone.trim() || !state.email.includes("@"))
    return false;
  if (state.fulfillment === "DELIVERY" && !state.address.trim()) return false;
  return true;
};

export const isPaymentValid = (state: CheckoutState) =>
  state.paymentMethod.trim().length > 0;
