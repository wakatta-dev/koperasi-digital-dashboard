/** @format */

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getRATVotingResult } from "@/services/api";
import { Switch } from "@/components/ui/switch";
import type { VotingResult } from "@/types/api";

export function RATVotingResult() {
  const [itemId, setItemId] = useState<string>("");
  const [data, setData] = useState<VotingResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [auto, setAuto] = useState(false);
  const timer = useRef<any>(null);

  async function load() {
    if (!itemId) return;
    setLoading(true);
    try {
      const res = await getRATVotingResult(itemId);
      if (res.success) setData(res.data as VotingResult);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (auto) {
      timer.current = setInterval(load, 10000);
      return () => clearInterval(timer.current);
    } else if (timer.current) {
      clearInterval(timer.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auto, itemId]);

  const entries = useMemo(() => {
    const summary = data?.summary ?? [];
    return summary.map((item) => {
      const total = typeof data?.total_votes === "number" ? data.total_votes : 0;
      const percent = typeof item.percentage === "number"
        ? Math.round(item.percentage)
        : total
          ? Math.round((item.count / total) * 100)
          : 0;
      return {
        option: item.option,
        count: item.count,
        percent,
      };
    });
  }, [data]);

  return (
    <Card id="hasil-voting">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Hasil Voting</CardTitle>
            <CardDescription>Masukkan ID item voting untuk melihat hasil</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={auto} onCheckedChange={setAuto} />
            <span className="text-sm">Auto refresh</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 items-end mb-4">
          <Input placeholder="ID Item Voting" value={itemId} onChange={(e) => setItemId(e.target.value)} />
          <Button onClick={load} disabled={!itemId || loading}>{loading ? 'Memuat...' : 'Muat'}</Button>
        </div>
        <div className="space-y-3">
          {data && (
            <div className="text-sm text-muted-foreground">Total suara: {data.total_votes}</div>
          )}
          {entries.map((e, i) => (
            <div key={i} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <div className="font-medium">{e.option}</div>
                <div className="text-muted-foreground">{e.count} ({e.percent}%)</div>
              </div>
              <div className="h-2 w-full rounded bg-muted overflow-hidden">
                <div className="h-full bg-primary" style={{ width: `${e.percent}%` }} />
              </div>
            </div>
          ))}
          {!entries.length && (
            <div className="text-sm text-muted-foreground italic">Belum ada hasil</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
