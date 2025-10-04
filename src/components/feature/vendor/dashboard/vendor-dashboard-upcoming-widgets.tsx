/** @format */

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function VendorDashboardUpcomingWidgets() {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle>Widget Mendatang</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-muted-foreground">
        <p>
          Ruang kosong untuk widget lanjutan seperti performa produk, pendapatan, atau
          notifikasi penting lainnya.
        </p>
        <div className="space-y-2">
          <Skeleton className="h-3 w-5/6" />
          <Skeleton className="h-3 w-2/3" />
          <Skeleton className="h-3 w-4/5" />
        </div>
      </CardContent>
    </Card>
  );
}
