/** @format */

"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useVendorSupportQueue } from "@/hooks/queries";
import { VendorPageHeader } from "../VendorPageHeader";
import { VENDOR_ROUTES } from "../../constants/routes";
import { formatVendorDateTime } from "../../utils/format";

type VendorTicketDetailPageProps = {
  ticketId: string;
};

export function VendorTicketDetailPage({
  ticketId,
}: VendorTicketDetailPageProps) {
  const queueQuery = useVendorSupportQueue();
  const item = queueQuery.data?.items.find((entry) => entry.id === ticketId);

  if (!item) {
    return (
      <div className="space-y-6">
        <VendorPageHeader
          title="Case Not Found"
          description="Case support tidak ditemukan pada queue agregat saat ini."
          actions={
            <Button asChild variant="outline">
              <Link href={VENDOR_ROUTES.tickets}>Kembali ke Tickets</Link>
            </Button>
          }
        />
      </div>
    );
  }

  const relatedHref =
    item.source === "overdue_invoice"
      ? VENDOR_ROUTES.invoiceDetail(item.reference)
      : item.tenant_id
        ? VENDOR_ROUTES.clientOverview(item.tenant_id)
        : VENDOR_ROUTES.tickets;

  return (
    <div className="space-y-6">
      <VendorPageHeader
        title={item.title}
        description={item.summary}
        actions={
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href={VENDOR_ROUTES.tickets}>Kembali ke Queue</Link>
            </Button>
            <Button asChild>
              <Link href={relatedHref}>Buka Referensi</Link>
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,1fr)]">
        <Card className="border-border/70">
          <CardHeader>
            <CardTitle>Case Detail</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border px-4 py-3">
                <div className="text-xs uppercase tracking-wide text-muted-foreground">
                  Source
                </div>
                <div className="mt-1 font-medium">{item.source}</div>
              </div>
              <div className="rounded-lg border px-4 py-3">
                <div className="text-xs uppercase tracking-wide text-muted-foreground">
                  Reference
                </div>
                <div className="mt-1 font-medium">{item.reference}</div>
              </div>
              <div className="rounded-lg border px-4 py-3">
                <div className="text-xs uppercase tracking-wide text-muted-foreground">
                  Tenant
                </div>
                <div className="mt-1 font-medium">{item.tenant_label}</div>
              </div>
              <div className="rounded-lg border px-4 py-3">
                <div className="text-xs uppercase tracking-wide text-muted-foreground">
                  Occurred At
                </div>
                <div className="mt-1 font-medium">{formatVendorDateTime(item.occurred_at)}</div>
              </div>
            </div>

            <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs">
              {JSON.stringify(item.metadata ?? {}, null, 2)}
            </pre>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="border-border/70">
            <CardHeader>
              <CardTitle>Operational Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border px-4 py-3">
                <span className="text-sm text-muted-foreground">Priority</span>
                <Badge variant="secondary">{item.priority.toUpperCase()}</Badge>
              </div>
              <div className="flex items-center justify-between rounded-lg border px-4 py-3">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge variant="secondary">{item.status.toUpperCase()}</Badge>
              </div>
              <div className="flex items-center justify-between rounded-lg border px-4 py-3">
                <span className="text-sm text-muted-foreground">Working SLA</span>
                <span className="text-sm font-medium">{item.sla_target_hours} jam</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border px-4 py-3">
                <span className="text-sm text-muted-foreground">Age</span>
                <span className="text-sm font-medium">{item.age_hours} jam</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/70">
            <CardHeader>
              <CardTitle>Implementation Note</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Detail ini masih berasal dari support queue agregat, bukan dari entity ticket backend.
              Begitu endpoint `/tickets*` tersedia, route yang sama bisa digeser ke workflow assignment,
              reply, dan SLA yang sebenarnya tanpa mengubah struktur navigasinya.
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
