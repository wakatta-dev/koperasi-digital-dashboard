/** @format */

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/format";
import { SummaryBlock } from "../shared/summary-block";

type Props = {
  subtotal?: number;
  total?: number;
  shippingCost?: number;
  itemDiscount?: number;
  serviceFee?: number;
  itemCount?: number;
};

export function OrderSummaryCard({
  subtotal = 0,
  total,
  shippingCost = 0,
  itemDiscount = 0,
  serviceFee = 0,
  itemCount = 0,
}: Props) {
  const normalizedItemDiscount = Math.max(0, itemDiscount);
  const computedTotal =
    subtotal + shippingCost + serviceFee - normalizedItemDiscount;
  const resolvedTotal = typeof total === "number" ? total : computedTotal;

  const rows = [
    { label: "Subtotal", value: formatCurrency(subtotal) ?? "-" },
    {
      label: "Total Ongkos Kirim",
      value: formatCurrency(shippingCost) ?? "-",
    },
    {
      label: "Diskon Barang",
      value:
        normalizedItemDiscount > 0
          ? `-${formatCurrency(normalizedItemDiscount)}`
          : (formatCurrency(0) ?? "-"),
      valueClassName:
        normalizedItemDiscount > 0
          ? "rounded bg-green-50 px-1.5 text-sm font-medium text-green-600"
          : undefined,
    },
    {
      label: "Biaya Layanan",
      value: formatCurrency(serviceFee) ?? "-",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Masukkan kode promo"
          className="h-10 rounded-lg text-sm"
        />
        <Button
          type="button"
          className="h-10 rounded-lg bg-indigo-600 px-4 text-sm font-bold text-white hover:bg-indigo-700"
        >
          Gunakan
        </Button>
      </div>

      <SummaryBlock
        title="Ringkasan Belanja"
        rows={rows}
        totalLabel="Total Tagihan"
        totalValue={formatCurrency(resolvedTotal) ?? "-"}
        footer="Termasuk PPN jika berlaku"
      />

      <p className="text-right text-xs text-muted-foreground">
        {itemCount > 0 ? `${itemCount} item` : "0 item"}
      </p>
      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground bg-muted/40 p-3 rounded-lg border border-border">
        <span className="material-icons-outlined text-base text-emerald-500">
          verified_user
        </span>
        Pesanan Anda diasuransikan. Jika barang rusak/hilang, kami ganti 100%.
      </div>
    </div>
  );
}
