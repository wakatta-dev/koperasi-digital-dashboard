/** @format */

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getRATVotingResult } from "@/services/api";
import { Switch } from "@/components/ui/switch";

export function RATVotingResult() {
  const [itemId, setItemId] = useState<string>("");
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [auto, setAuto] = useState(false);
  const timer = useRef<any>(null);

  async function load() {
    if (!itemId) return;
    setLoading(true);
    try {
      const res = await getRATVotingResult(itemId);
      if (res.success) setData(res.data);
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
    const counts = (data?.counts ?? {}) as Record<string, number>;
    const total = Number(data?.total ?? 0) || Object.values(counts).reduce((a, b) => a + b, 0);
    return Object.entries(counts).map(([opt, c]) => ({ option: opt, count: c, percent: total ? Math.round((c / total) * 100) : 0 }));
  }, [data]);

  return (
    <Card>
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
        <div className="space-y-2">
          {entries.map((e, i) => (
            <div key={i} className="flex items-center justify-between p-2 border rounded">
              <div className="text-sm">{e.option}</div>
              <div className="text-sm">{e.count} ({e.percent}%)</div>
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

