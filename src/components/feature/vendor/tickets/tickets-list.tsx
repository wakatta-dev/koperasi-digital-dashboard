/** @format */

"use client";

import { useEffect, useMemo, useState } from "react";
import { useTickets } from "@/hooks/queries/ticketing";
import type { Ticket } from "@/types/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Ticket as TicketIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { TicketSlaConfigSheet } from "@/components/feature/vendor/tickets/sla-config-sheet";
import { VendorTicketDetail } from "./ticket-detail";
import { useSearchParams } from "next/navigation";

type Props = { initialData?: Ticket[]; limit?: number };

export function VendorTicketsList({ initialData, limit = 10 }: Props) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [filters, setFilters] = useState<{
    status?: string;
    priority?: string;
    category?: string;
  }>({});
  const searchParams = useSearchParams();
  useEffect(() => {
    const status = searchParams.get("status") || undefined;
    const priority = searchParams.get("priority") || undefined;
    const category = searchParams.get("category") || undefined;
    setFilters((f) => ({
      ...f,
      ...(status ? { status } : {}),
      ...(priority ? { priority } : {}),
      ...(category ? { category } : {}),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const params = useMemo(() => ({ limit, ...filters }), [limit, filters]);
  const { data: tickets = [] } = useTickets(params, initialData, { refetchInterval: 300000 });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Support Tickets</h2>
          <p className="text-muted-foreground">
            Kelola dan pantau tiket dukungan
          </p>
        </div>
        <div className="flex items-center gap-2">
          <TicketSlaConfigSheet />
        </div>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Cari judul (client-side)" className="pl-10" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Select
              value={filters.status ?? ""}
              onValueChange={(v) =>
                setFilters((f) => ({ ...f, status: v || undefined }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Status (semua)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">open</SelectItem>
                <SelectItem value="in_progress">in_progress</SelectItem>
                <SelectItem value="resolved">resolved</SelectItem>
                <SelectItem value="closed">closed</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.priority ?? ""}
              onValueChange={(v) =>
                setFilters((f) => ({ ...f, priority: v || undefined }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Priority (semua)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">low</SelectItem>
                <SelectItem value="medium">medium</SelectItem>
                <SelectItem value="high">high</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.category ?? ""}
              onValueChange={(v) =>
                setFilters((f) => ({ ...f, category: v || undefined }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Category (semua)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="billing">billing</SelectItem>
                <SelectItem value="technical">technical</SelectItem>
                <SelectItem value="access">access</SelectItem>
                <SelectItem value="other">other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setFilters({})}
            >
              Reset Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ticket List</CardTitle>
          <CardDescription>Semua tiket yang masuk</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tickets.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                    <TicketIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium">{t.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t.category} • {t.priority}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge
                    variant={
                      t.status === "open"
                        ? "destructive"
                        : t.status === "in_progress"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {t.status}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setOpenId(String(t.id))}
                  >
                    View
                  </Button>
                </div>
              </div>
            ))}
            {tickets.length === 0 && (
              <div className="text-sm text-muted-foreground italic">
                Tidak ada tiket.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      <Sheet open={!!openId} onOpenChange={(o) => !o && setOpenId(null)}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-2xl p-4 overflow-y-auto"
        >
          {/* Accessibility: provide a title for screen readers */}
          <SheetHeader className="sr-only">
            <SheetTitle>Ticket Detail</SheetTitle>
          </SheetHeader>
          {openId && <VendorTicketDetail id={openId} />}
        </SheetContent>
      </Sheet>
    </div>
  );
}
