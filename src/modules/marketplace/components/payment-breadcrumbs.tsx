/** @format */

import { Breadcrumbs, type BreadcrumbItem } from "@/components/shared/navigation/breadcrumbs";

const items: BreadcrumbItem[] = [
  { label: "Beranda", href: "#" },
  { label: "Marketplace", href: "#" },
  { label: "Keranjang", href: "#" },
  { label: "Pengiriman", href: "#" },
  { label: "Pembayaran", active: true },
];

export function PaymentBreadcrumbs() {
  return <Breadcrumbs items={items} />;
}
