/** @format */

"use client";

import { usePartnerManagementSellers } from "@/hooks/queries/partner-management";

export function PartnerManagementPage() {
  const sellersQuery = usePartnerManagementSellers();

  if (sellersQuery.isLoading) {
    return <div className="p-6 text-sm text-muted-foreground">Memuat seller...</div>;
  }

  if (sellersQuery.isError) {
    return (
      <div className="rounded-md border border-destructive bg-destructive/10 p-4 text-sm text-destructive">
        Gagal memuat data seller partner management.
      </div>
    );
  }

  const items = sellersQuery.data?.items ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Partner Management</h1>
        <p className="text-sm text-muted-foreground">
          Seller kanonik dengan lifecycle yang sama seperti ownership yang digunakan di surface marketplace.
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-muted/40">
            <tr>
              <th className="px-4 py-3 text-left">Seller</th>
              <th className="px-4 py-3 text-left">Business</th>
              <th className="px-4 py-3 text-left">Lifecycle</th>
              <th className="px-4 py-3 text-left">Ownership Ref</th>
            </tr>
          </thead>
          <tbody>
            {items.map((seller) => (
              <tr key={seller.seller_id} className="border-t border-border">
                <td className="px-4 py-3">
                  <div className="font-medium text-foreground">{seller.seller_name}</div>
                  <div className="text-xs text-muted-foreground">{seller.owner_name || "-"}</div>
                </td>
                <td className="px-4 py-3 text-foreground">{seller.business_name || "-"}</td>
                <td className="px-4 py-3 text-foreground">{seller.lifecycle_state}</td>
                <td className="px-4 py-3 text-muted-foreground">Seller #{seller.seller_id}</td>
              </tr>
            ))}
            {items.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-muted-foreground">
                  Belum ada seller terdaftar.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
