/** @format */

import {
  Breadcrumbs,
  type BreadcrumbItem,
} from "@/components/shared/navigation/breadcrumbs";

type StatusBreadcrumbProps = {
  currentLabel: string;
};

export function StatusBreadcrumb({ currentLabel }: StatusBreadcrumbProps) {
  const items: BreadcrumbItem[] = [
    { label: "Beranda", href: "/" },
    { label: "Penyewaan Aset", href: "/penyewaan-aset" },
    { label: "Permintaan Saya", href: "/penyewaan-aset/status" },
    { label: currentLabel, active: true },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Breadcrumbs items={items} />
    </div>
  );
}
