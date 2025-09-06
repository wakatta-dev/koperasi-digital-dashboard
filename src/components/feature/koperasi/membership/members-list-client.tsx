/** @format */

"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { listMembers, updateMemberStatus } from "@/services/api";
import { Users } from "lucide-react";
import { MemberProfileDialog } from "./member-profile-dialog";
import { MemberVerifyDialog } from "./member-verify-dialog";
import type { MemberListItem } from "@/types/api";

export function MembersListClient({ initialData, initialCursor }: { initialData: MemberListItem[]; initialCursor?: string }) {
  const [rows, setRows] = useState<MemberListItem[]>(initialData || []);
  const [cursor, setCursor] = useState<string | undefined>(initialCursor);
  const [hasNext, setHasNext] = useState<boolean>(!!initialCursor);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState<string>("");

  async function loadMore() {
    if (!cursor) return;
    setLoading(true);
    try {
      const res = await listMembers({ limit: 20, cursor }).catch(() => null);
      if (res && res.success) {
        setRows((s) => [...s, ...(res.data as any[])]);
        const next = (res.meta as any)?.pagination?.next_cursor;
        setCursor(next);
        setHasNext(!!(res.meta as any)?.pagination?.has_next);
      }
    } finally {
      setLoading(false);
    }
  }

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return rows;
    return rows.filter((m) =>
      String(m.no_anggota || '').toLowerCase().includes(term) ||
      String(m.id || '').includes(term) ||
      String(m.user_id || '').includes(term) ||
      String(m.status || '').toLowerCase().includes(term) ||
      String(m.user?.full_name || '').toLowerCase().includes(term) ||
      String(m.user?.email || '').toLowerCase().includes(term)
    );
  }, [rows, q]);

  return (
    <div className="space-y-4">
      <div className="relative">
        {/* Search */}
        <Input placeholder="Cari anggota (nama/email/ID)..." value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      {filtered.map((member) => (
        <div key={String(member.id)} className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-medium">{member.user?.full_name || member.no_anggota || `Anggota #${member.id}`}</h3>
              <p className="text-sm text-muted-foreground">
                {member.user?.email ? `${member.user.email} • ` : ""}ID: {member.id} • User ID: {member.user_id}
              </p>
              <p className="text-xs text-muted-foreground">Bergabung: {member.join_date ? new Date(member.join_date).toLocaleDateString('id-ID') : '-'}</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <Badge variant={(String(member.status || '').toLowerCase() === 'active') ? 'default' : 'secondary'}>{String(member.status || '-')}</Badge>
            <div className="flex items-center gap-2">
              <MemberProfileDialog memberId={member.id} />
              <MemberVerifyDialog defaultId={member.id} />
              {['active', 'inactive', 'nonaktif'].includes(String(member.status || '').toLowerCase()) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={async () => {
                    const current = String(member.status || '').toLowerCase();
                    const next = current === 'active' ? 'nonaktif' : 'active';
                    await updateMemberStatus(member.id, { status: next });
                    setRows((s) => s.map((m) => m.id === member.id ? { ...m, status: next } : m));
                  }}
                >Toggle Status</Button>
              )}
            </div>
          </div>
        </div>
      ))}
      <div className="flex justify-center">
        <Button variant="outline" onClick={loadMore} disabled={!hasNext || loading}>{loading ? 'Memuat...' : hasNext ? 'Muat Lagi' : 'Tidak ada data lagi'}</Button>
      </div>
    </div>
  );
}
