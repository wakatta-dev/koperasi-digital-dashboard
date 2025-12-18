/** @format */

import Link from "next/link";

import { CartItemCard } from "./cart-item-card";

export function CartItemsSection() {
  return (
    <div className="lg:col-span-8 space-y-6">
      <CartItemCard />
      <Link
        href="/marketplace"
        className="inline-flex items-center gap-2 text-[#4338ca] dark:text-indigo-400 font-bold hover:underline transition group"
      >
        <span className="material-icons-outlined text-lg group-hover:-translate-x-1 transition-transform">arrow_back</span>
        Lanjutkan Belanja
      </Link>
    </div>
  );
}
