/** @format */

"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { listMembers, updateMemberStatus } from "@/services/api";
import { MemberProfileDialog } from "./member-profile-dialog";
import { MemberVerifyDialog } from "./member-verify-dialog";
import type { MemberListItem } from "@/types/api";
import { MemberCardDialog } from "./member-card-dialog";

export function MembersListClient({ initialData, initialCursor }: { initialData: MemberListItem[]; initialCursor?: string }) {
  const [rows, setRows] = useState<MemberListItem[]>(initialData || []);
  const [cursor, setCursor] = useState<string | undefined>(initialCursor);
  const [hasNext, setHasNext] = useState<boolean>(!!initialCursor);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState<string>("");
  const [status, setStatus] = useState<string>("all");

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
    const byQuery = rows.filter((m) =>
      String(m.no_anggota || '').toLowerCase().includes(term) ||
      String(m.id || '').includes(term) ||
      String(m.user_id || '').includes(term) ||
      String(m.status || '').toLowerCase().includes(term) ||
      String(m.user?.full_name || '').toLowerCase().includes(term) ||
      String(m.user?.email || '').toLowerCase().includes(term)
    );
    if (status === 'all') return byQuery;
    return byQuery.filter((m) => String(m.status || '').toLowerCase() === status);
  }, [rows, q]);

  const formatDateId = (iso?: string) => {
    if (!iso) return '-';
    try {
      return new Intl.DateTimeFormat('id-ID', { year: 'numeric', month: 'short', day: '2-digit' }).format(new Date(iso));
    } catch {
      return iso;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <Input className="md:w-1/3" placeholder="Cari anggota (nama/email/ID)..." value={q} onChange={(e) => setQ(e.target.value)} />
        <div className="flex items-center gap-2">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger size="sm"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="nonaktif">Nonaktif</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <div className="text-sm text-muted-foreground">Total: {filtered.length}</div>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No. Anggota</TableHead>
            <TableHead>Nama</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Tgl Bergabung</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((member) => (
            <TableRow key={String(member.id)}>
              <TableCell className="font-medium">{member.no_anggota || `AGG-${member.id}`}</TableCell>
              <TableCell>{member.user?.full_name || '-'}</TableCell>
              <TableCell className="text-muted-foreground">{member.user?.email || '-'}</TableCell>
              <TableCell>
                <Badge variant={(String(member.status || '').toLowerCase() === 'active') ? 'default' : 'secondary'}>{String(member.status || '-')}</Badge>
              </TableCell>
              <TableCell>{formatDateId(member.join_date)}</TableCell>
              <TableCell className="text-right space-x-1">
                <MemberProfileDialog memberId={member.id} />
                <MemberVerifyDialog defaultId={member.id} />
                <MemberCardDialog memberId={member.id} />
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
                  >Toggle</Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-center">
        <Button variant="outline" onClick={loadMore} disabled={!hasNext || loading}>{loading ? 'Memuat...' : hasNext ? 'Muat Lagi' : 'Tidak ada data lagi'}</Button>
      </div>
    </div>
  );
}
