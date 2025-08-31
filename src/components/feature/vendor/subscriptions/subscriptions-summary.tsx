/** @format */

"use client";

import { useVendorSubscriptionsSummary } from "@/hooks/queries/billing";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = { initialData?: { active: number; suspended: number; overdue: number } };

export function SubscriptionsSummary({ initialData }: Props) {
  const { data } = useVendorSubscriptionsSummary(initialData);
  const s = data ?? { active: 0, suspended: 0, overdue: 0 };

  const items = [
    { label: "Active", value: s.active },
    { label: "Suspended", value: s.suspended },
    { label: "Overdue", value: s.overdue },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {items.map((it) => (
        <Card key={it.label}>
          <CardHeader>
            <CardTitle className="text-sm font-medium">{it.label}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{it.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

