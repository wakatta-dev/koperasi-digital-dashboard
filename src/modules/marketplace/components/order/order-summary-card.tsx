/** @format */

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/format";
import { SummaryBlock } from "../shared/summary-block";

type Props = {
  subtotal?: number;
  total?: number;
  itemCount?: number;
};

export function OrderSummaryCard({
  subtotal = 0,
  total = 0,
  itemCount = 0,
}: Props) {
  const rows = [
    { label: "Subtotal", value: formatCurrency(subtotal) ?? "-" },
    { label: "Total Ongkos Kirim", value: "Rp 20.000" },
    {
      label: "Diskon Barang",
      value: "-Rp 5.000",
      valueClassName:
        "rounded bg-green-50 px-1.5 text-sm font-medium text-green-600",
    },
    { label: "Biaya Layanan", value: "Rp 1.000" },
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
        totalValue={formatCurrency(total || subtotal) ?? "-"}
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
