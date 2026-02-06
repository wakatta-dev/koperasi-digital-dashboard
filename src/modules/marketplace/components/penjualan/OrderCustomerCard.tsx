/** @format */

"use client";

import { Mail, Phone } from "lucide-react";
import { OrderAddresses } from "./OrderAddresses";

export type OrderCustomerCardProps = Readonly<{
  name: string;
  orderCount: number;
  email: string;
  phone: string;
  shippingAddress: string;
  billingAddress?: string | null;
  billingSameAsShipping?: boolean;
}>;

const getInitials = (name: string) => {
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "-";
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? "-";
  return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
};

export function OrderCustomerCard({
  name,
  orderCount,
  email,
  phone,
  shippingAddress,
  billingAddress,
  billingSameAsShipping,
}: OrderCustomerCardProps) {
  const initials = getInitials(name);

  return (
    <div className="surface-table p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 dark:text-white">Pelanggan</h3>
        <button className="text-sm text-indigo-600 hover:text-indigo-700" type="button">
          Lihat Profil
        </button>
      </div>
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-lg font-bold border border-blue-200 dark:border-blue-800">
          {initials}
        </div>
        <div>
          <div className="text-base font-bold text-gray-900 dark:text-white">{name}</div>
          <div className="text-sm text-gray-500">{orderCount} Pesanan Sebelumnya</div>
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center flex-shrink-0 text-gray-400">
            <Mail className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Email</p>
            <p className="text-sm text-gray-900 dark:text-white">{email}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center flex-shrink-0 text-gray-400">
            <Phone className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Telepon</p>
            <p className="text-sm text-gray-900 dark:text-white">{phone}</p>
          </div>
        </div>
      </div>
      <OrderAddresses
        shippingAddress={shippingAddress}
        billingAddress={billingAddress}
        billingSameAsShipping={billingSameAsShipping}
      />
    </div>
  );
}
