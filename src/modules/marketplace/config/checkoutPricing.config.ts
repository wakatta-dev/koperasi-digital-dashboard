/** @format */

export const DEFAULT_SHIPPING_OPTION = "JNE_REGULER";
export const DEFAULT_PAYMENT_METHOD = "TRANSFER_BANK";

const SHIPPING_COST_BY_OPTION: Record<string, number> = {
  JNE_REGULER: 9_000,
  GOJEK_SAME_DAY: 25_000,
};

const SERVICE_FEE_BY_PAYMENT_METHOD: Record<string, number> = {
  QRIS: 0,
  TRANSFER_BANK: 1_000,
  EWALLET: 0,
};

export type CheckoutCostBreakdown = {
  shippingCost: number;
  itemDiscount: number;
  serviceFee: number;
};

export function getShippingCost(shippingOption?: string): number {
  if (!shippingOption) {
    return 0;
  }
  return SHIPPING_COST_BY_OPTION[shippingOption] ?? 0;
}

export function getServiceFee(paymentMethod?: string): number {
  if (!paymentMethod) {
    return 0;
  }
  return SERVICE_FEE_BY_PAYMENT_METHOD[paymentMethod] ?? 0;
}

export function getCheckoutCostBreakdown(params: {
  shippingOption?: string;
  paymentMethod?: string;
  itemDiscount?: number;
}): CheckoutCostBreakdown {
  return {
    shippingCost: getShippingCost(params.shippingOption),
    itemDiscount: Math.max(0, params.itemDiscount ?? 0),
    serviceFee: getServiceFee(params.paymentMethod),
  };
}
