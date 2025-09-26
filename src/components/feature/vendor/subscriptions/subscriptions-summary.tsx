/** @format */

"use client";

import { useVendorSubscriptionsSummary } from "@/hooks/queries/billing";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = { initialData?: Record<string, number> };

export function SubscriptionsSummary({ initialData }: Props) {
  const { data } = useVendorSubscriptionsSummary(initialData);
  const summary = data ?? {};
  const entries = Object.entries(summary);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {entries.map(([label, value]) => (
        <Card key={label}>
          <CardHeader>
            <CardTitle className="text-sm font-medium capitalize">{label.replaceAll("_", " ")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{value}</div>
          </CardContent>
        </Card>
      ))}
      {!entries.length && (
        <Card>
          <CardContent className="py-6 text-sm text-muted-foreground italic">
            Tidak ada ringkasan subscription.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
