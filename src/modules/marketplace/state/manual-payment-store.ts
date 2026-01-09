/** @format */
"use client";

import { create } from "zustand";

type ManualPaymentState = {
  proofFile: File | null;
  setProofFile: (file: File | null) => void;
  reset: () => void;
};

export const useManualPaymentStore = create<ManualPaymentState>((set) => ({
  proofFile: null,
  setProofFile: (file) => set({ proofFile: file }),
  reset: () => set({ proofFile: null }),
}));
