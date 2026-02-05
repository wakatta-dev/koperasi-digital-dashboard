/** @format */

export type MarketplaceFilters = {
  categories: string[];
  priceMin?: number;
  priceMax?: number;
  producer?: string;
};

export const DEFAULT_MARKETPLACE_FILTERS: MarketplaceFilters = {
  categories: ["all"],
  producer: "all",
};

export type ProductStatus = "Tersedia" | "Menipis" | "Habis";
export type OrderStatus = "Completed" | "Processing" | "Shipped" | "Cancelled";
export type CustomerStatus = "Active" | "Inactive";
export type PaymentStatus = "Lunas" | "Pending" | "Gagal";
export type PaymentMethodType = "card" | "bank";
export type InventoryEventType = "increase" | "decrease";

export type ProductListItem = {
  id: string;
  name: string;
  sku: string;
  category: string;
  status: ProductStatus;
  stockCount: number;
  price: number;
  thumbnailUrl?: string | null;
};

export type ProductVariant = {
  name: string;
  sku: string;
  stock: number;
  price: number;
};

export type InventoryEvent = {
  id: string;
  title: string;
  timestamp: string;
  delta: number;
  remainingStock: number;
  type: InventoryEventType;
};

export type ProductDetail = {
  productId: string;
  name: string;
  sku: string;
  status: ProductStatus;
  images: string[];
  category: string;
  brand: string;
  description: string;
  weightKg: number;
  price: number;
  stockCount: number;
  minStockAlert: number;
  totalSold: number;
  variants: ProductVariant[];
  inventoryHistory: InventoryEvent[];
};

export type OrderListItem = {
  id: string;
  orderCode: string;
  customerName: string;
  customerEmail: string;
  date: string;
  total: number;
  status: OrderStatus;
};

export type OrderItem = {
  productName: string;
  sku: string;
  unitPrice: number;
  qty: number;
  totalPrice: number;
};

export type CustomerSummary = {
  name: string;
  email: string;
  phone: string;
  orderCount: number;
};

export type Address = {
  label: string;
  line1: string;
  line2?: string | null;
  city: string;
  province: string;
  postalCode: string;
  country: string;
};

export type PaymentMethod = {
  id: string;
  type: PaymentMethodType;
  label: string;
  masked: string;
  expiry?: string | null;
  isDefault: boolean;
};

export type OrderDetail = {
  orderId: string;
  orderCode: string;
  status: OrderStatus;
  createdAt: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  shippingCourier: string;
  trackingNumber?: string | null;
  customer: CustomerSummary;
  shippingAddress: Address;
  billingAddress: Address;
  internalNotes?: string | null;
};

export type CustomerListItem = {
  id: string;
  name: string;
  email: string;
  phone: string;
  memberSince: string;
  totalOrders: number;
  totalSpend: number;
  avgSpend: number;
  status: CustomerStatus;
  initials: string;
};

export type CustomerOrderSummary = {
  orderId: string;
  date: string;
  status: "Selesai" | "Pending" | "Dibatalkan";
  total: number;
};

export type CustomerActivity = {
  id: string;
  title: string;
  timestamp: string;
  description: string;
  quote?: string | null;
  metadata?: string | null;
  type: "order" | "support" | "profile" | "login";
};

export type CustomerPaymentMethod = {
  id: string;
  type: PaymentMethodType;
  label: string;
  masked: string;
  expiry?: string | null;
  isDefault: boolean;
};

export type CustomerDetail = {
  customer: CustomerListItem;
  orders: CustomerOrderSummary[];
  activity: CustomerActivity[];
  paymentMethods: CustomerPaymentMethod[];
};
