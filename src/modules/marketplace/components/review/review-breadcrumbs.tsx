/** @format */

import { Breadcrumbs, type BreadcrumbItem } from "@/components/shared/navigation/breadcrumbs";

const items: BreadcrumbItem[] = [
  { label: "Beranda", href: "#" },
  { label: "Marketplace", href: "#" },
  { label: "Keranjang", href: "#" },
  { label: "Pengiriman", href: "#" },
  { label: "Pembayaran", href: "#" },
  { label: "Ulasan", active: true },
];

export function ReviewBreadcrumbs() {
  return <Breadcrumbs items={items} />;
}
