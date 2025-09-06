/** @format */

"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { NotificationRow } from "./notification-row";
import { listNotifications, updateNotificationStatus } from "@/services/api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateRangePicker } from "@/components/ui/date-range-picker";

export function NotificationsClient({ initialItems = [], initialCursor, initialHasNext }: { initialItems?: any[]; initialCursor?: string; initialHasNext?: boolean; }) {
  const [items, setItems] = useState<any[]>(initialItems || []);
  const [cursor, setCursor] = useState<string | undefined>(initialCursor);
  const [hasNext, setHasNext] = useState<boolean>(!!initialHasNext);
  const [loading, setLoading] = useState<boolean>(false);
  const [type, setType] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");

  async function loadMore(initial = false) {
    setLoading(true);
    try {
      const params: Record<string, any> = { limit: 20 };
      if (!initial && cursor) params.cursor = cursor;
      if (type) params.type = type;
      if (status) params.status = status;
      if (from) params.from = from;
      if (to) params.to = to;
      const res = await listNotifications(params);
      if (res.success) {
        const next = res.meta?.pagination?.next_cursor;
        setCursor(next);
        setHasNext(!!res.meta?.pagination?.has_next);
        setItems((s) => (initial ? (res.data as any[]) : [...s, ...(res.data as any[])]));
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!items.length) {
      loadMore(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 items-end">
        <Select
          value={type || "__ALL__"}
          onValueChange={(v) => setType(v === "__ALL__" ? "" : v)}
        >
          <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="__ALL__">Semua</SelectItem>
            <SelectItem value="BILLING">BILLING</SelectItem>
            <SelectItem value="RAT">RAT</SelectItem>
            <SelectItem value="LOAN">LOAN</SelectItem>
            <SelectItem value="SAVINGS">SAVINGS</SelectItem>
            <SelectItem value="SYSTEM">SYSTEM</SelectItem>
            <SelectItem value="CUSTOM">CUSTOM</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={status || "__ALL__"}
          onValueChange={(v) => setStatus(v === "__ALL__" ? "" : v)}
        >
          <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="__ALL__">Semua</SelectItem>
            <SelectItem value="DRAFT">DRAFT</SelectItem>
            <SelectItem value="PUBLISHED">PUBLISHED</SelectItem>
            <SelectItem value="SENT">SENT</SelectItem>
            <SelectItem value="READ">READ</SelectItem>
            <SelectItem value="ARCHIVED">ARCHIVED</SelectItem>
          </SelectContent>
        </Select>
        <DateRangePicker
          placeholder="Rentang"
          value={{ start: from || undefined, end: to || undefined }}
          onChange={(s, e) => { setFrom(s || ""); setTo(e || ""); }}
          triggerClassName="w-full"
        />
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => { setCursor(undefined); loadMore(true); }} disabled={loading}>Filter</Button>
          <Button variant="ghost" onClick={() => { setType(""); setStatus(""); setFrom(""); setTo(""); setCursor(undefined); loadMore(true); }} disabled={loading}>Reset</Button>
        </div>
      </div>
      {items.map((n) => (
        <NotificationRow
          key={String(n.id ?? Math.random())}
          item={n}
          onRead={async (id) => {
            await updateNotificationStatus(id, { status: "READ" });
          }}
        />
      ))}
      <div className="flex justify-center pt-2">
        <Button variant="outline" onClick={() => loadMore(false)} disabled={loading || !hasNext}>
          {loading ? "Memuat..." : hasNext ? "Muat Lagi" : "Tidak ada data lagi"}
        </Button>
      </div>
    </div>
  );
}
