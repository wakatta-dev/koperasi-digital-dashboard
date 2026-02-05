/** @format */

import { Breadcrumbs, type BreadcrumbItem } from "@/components/shared/navigation/breadcrumbs";

const items: BreadcrumbItem[] = [
  { label: "Beranda", href: "#" },
  { label: "Marketplace", href: "#" },
  { label: "Keranjang Belanja", active: true },
];

export function CartBreadcrumbs() {
  return <Breadcrumbs items={items} />;
}
