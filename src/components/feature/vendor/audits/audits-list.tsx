/** @format */

"use client";

import { useMemo, useState } from "react";
import { useVendorAudits } from "@/hooks/queries/billing";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HistoryIcon, ArrowRightLeftIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { listVendorAudits } from "@/services/api";

type Props = { initialData?: any[]; limit?: number };

export function VendorAuditsList({ initialData, limit = 50 }: Props) {
  const [lim, setLim] = useState<number>(limit);
  const { data: base = [] } = useVendorAudits({ limit: lim }, initialData);
  const [extra, setExtra] = useState<any[]>([]);
  const [nextCursor, setNextCursor] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const data = useMemo(() => [...base, ...extra], [base, extra]);

  async function loadMore() {
    setLoading(true);
    try {
      const res = await listVendorAudits({ limit: lim, cursor: nextCursor }).catch(() => null);
      if (res?.success) {
        const page = res.data || [];
        const next = (res.meta?.pagination as any)?.next_cursor as string | undefined;
        setNextCursor(next);
        setExtra((prev) => prev.concat(page));
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <HistoryIcon className="w-5 h-5 text-muted-foreground" />
          <CardTitle>Audit Logs</CardTitle>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Limit</span>
          <select className="border rounded px-2 py-1" value={String(lim)} onChange={(e) => setLim(Number(e.target.value || 50))}>
            {[20, 50, 100, 200].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
          <button className="border rounded px-2 py-1" onClick={loadMore} disabled={loading}>{loading ? "Memuat..." : "Muat lagi"}</button>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-3 text-sm">
            {data.length === 0 && (
              <div className="text-muted-foreground italic">No audits</div>
            )}

            {data.map((a: any) => (
              <div
                key={a.id}
                className="group flex items-start gap-3 rounded-md border p-3 transition-all hover:bg-muted/50"
              >
                <div className="mt-1 shrink-0">
                  <ArrowRightLeftIcon className="h-4 w-4 text-muted-foreground" />
                </div>

                <div className="flex-1 space-y-0.5">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">
                      {a.entity} #{a.entity_id}
                    </span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-xs",
                              a.new_status === "approved" &&
                                "border-green-500 text-green-600",
                              a.new_status === "rejected" &&
                                "border-red-500 text-red-600",
                              a.new_status === "pending" &&
                                "border-yellow-500 text-yellow-600"
                            )}
                          >
                            {a.old_status ? `${a.old_status} → ` : ""}
                            {a.new_status}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            Status changed from{" "}
                            <strong>{a.old_status || "N/A"}</strong> to{" "}
                            <strong>{a.new_status}</strong>
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <p className="text-muted-foreground text-xs">
                    Audit ID: {a.id}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
