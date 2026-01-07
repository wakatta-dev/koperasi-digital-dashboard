/** @format */

import {
  Breadcrumbs,
  type BreadcrumbItem,
} from "@/components/shared/navigation/breadcrumbs";

type ConfirmationBreadcrumbProps = {
  detailHref?: string;
  paymentHref?: string;
};

export function ConfirmationBreadcrumb({
  detailHref,
  paymentHref,
}: ConfirmationBreadcrumbProps) {
  const items: BreadcrumbItem[] = [
    { label: "Detail Permintaan", href: detailHref },
    { label: "Pembayaran", href: paymentHref },
    { label: "Konfirmasi", active: true },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Breadcrumbs items={items} />
    </div>
  );
}
