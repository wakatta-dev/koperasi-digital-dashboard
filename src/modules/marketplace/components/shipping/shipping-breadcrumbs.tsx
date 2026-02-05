/** @format */

import { Breadcrumbs, type BreadcrumbItem } from "@/components/shared/navigation/breadcrumbs";

const items: BreadcrumbItem[] = [
  { label: "Beranda", href: "#" },
  { label: "Marketplace", href: "#" },
  { label: "Keranjang", href: "#" },
  { label: "Informasi Pengiriman", active: true },
];

export function ShippingBreadcrumbs() {
  return <Breadcrumbs items={items} />;
}
