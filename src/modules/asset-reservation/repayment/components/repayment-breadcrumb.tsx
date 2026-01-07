/** @format */

import {
  Breadcrumbs,
  type BreadcrumbItem,
} from "@/components/shared/navigation/breadcrumbs";

type RepaymentBreadcrumbProps = {
  listHref?: string;
  detailLabel?: string;
};

export function RepaymentBreadcrumb({
  listHref = "/penyewaan-aset/status",
  detailLabel = "Detail Permintaan",
}: RepaymentBreadcrumbProps) {
  const items: BreadcrumbItem[] = [
    { label: "Permintaan Saya", href: listHref },
    { label: detailLabel },
    { label: "Pembayaran Pelunasan", active: true },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Breadcrumbs items={items} />
    </div>
  );
}
