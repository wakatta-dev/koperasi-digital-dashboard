/** @format */

import {
  Breadcrumbs,
  type BreadcrumbItem,
} from "@/components/shared/navigation/breadcrumbs";

type DetailBreadcrumbProps = {
  currentLabel: string;
};

export function DetailBreadcrumb({ currentLabel }: DetailBreadcrumbProps) {
  const items: BreadcrumbItem[] = [
    { label: "Beranda", href: "/" },
    { label: "Penyewaan Aset", href: "/penyewaan-aset" },
    { label: currentLabel, active: true },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Breadcrumbs items={items} />
    </div>
  );
}
