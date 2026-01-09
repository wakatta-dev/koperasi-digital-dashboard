/** @format */

import {
  Breadcrumbs,
  type BreadcrumbItem,
} from "@/components/shared/navigation/breadcrumbs";

type PaymentBreadcrumbProps = {
  listHref?: string;
  detailHref?: string;
};

export function PaymentBreadcrumb({
  listHref = "/penyewaan-aset/status",
  detailHref,
}: PaymentBreadcrumbProps) {
  const items: BreadcrumbItem[] = [
    { label: "Permintaan Saya", href: listHref },
    { label: "Detail Permintaan", href: detailHref },
    { label: "Pembayaran", active: true },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Breadcrumbs items={items} />
    </div>
  );
}
