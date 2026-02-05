/** @format */

import { Breadcrumbs, type BreadcrumbItem } from "@/components/shared/navigation/breadcrumbs";

type BreadcrumbProps = {
  category: string;
  title: string;
};

export function ProductBreadcrumbs({ category, title }: BreadcrumbProps) {
  const items: BreadcrumbItem[] = [
    { label: "Beranda", href: "#" },
    { label: "Marketplace", href: "#" },
    { label: category, href: "#" },
    { label: title, active: true },
  ];
  return <Breadcrumbs items={items} />;
}
