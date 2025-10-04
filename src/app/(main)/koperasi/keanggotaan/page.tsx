/** @format */

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MemberRegisterDialog } from "@/components/feature/koperasi/membership/member-register-dialog";
import { MembersListClient } from "@/components/feature/koperasi/membership/members-list-client";
import { MemberVerifyDialog } from "@/components/feature/koperasi/membership/member-verify-dialog";
import { getKoperasiDashboard, listMembers } from "@/services/api";
import type {
  KoperasiDashboardSummary,
  MemberListItem,
  MemberListResponse,
} from "@/types/api";

export default async function KeanggotaanPage() {
  const [summaryRes, activeChunk, pendingChunk, nonActiveChunk, exitChunk] =
    await Promise.all([
      getKoperasiDashboard().catch(() => null),
      fetchMembersChunk({ limit: 20 }),
      fetchMembersChunk({ status: "pending", limit: 20 }),
      fetchMembersChunk({ status: "nonaktif", limit: 20 }),
      fetchMembersChunk({ status: "keluar", limit: 20 }),
    ]);

  const summary = extractDashboardSummary(summaryRes);

  const pendingCount = formatWithOverflow(
    pendingChunk.items.length,
    pendingChunk.hasNext
  );
  const inactiveRawCount =
    nonActiveChunk.items.length + exitChunk.items.length;
  const inactiveHasMore = nonActiveChunk.hasNext || exitChunk.hasNext;
  const inactiveCount = formatWithOverflow(inactiveRawCount, inactiveHasMore);

  const formatNumber = new Intl.NumberFormat("id-ID");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Keanggotaan</h2>
          <p className="text-muted-foreground">Kelola data anggota koperasi</p>
        </div>
        <MemberRegisterDialog />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Anggota Aktif
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {typeof summary?.active_members === "number"
                ? formatNumber.format(summary.active_members)
                : "-"}
            </div>
            <p className="text-xs text-muted-foreground">
              Berdasarkan ringkasan dashboard
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Pending Verifikasi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
            <p className="text-xs text-muted-foreground">
              Data yang menunggu persetujuan
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Nonaktif / Keluar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inactiveCount}</div>
            <p className="text-xs text-muted-foreground">
              Anggota perlu tindak lanjut
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Gunakan tombol verifikasi untuk menyetujui atau menolak anggota
          berdasarkan status permohonan.
        </div>
        <div className="flex gap-2">
          <MemberVerifyDialog />
          <MemberRegisterDialog />
        </div>
      </div>

      {/* Members Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Anggota</CardTitle>
          <CardDescription>Data lengkap anggota koperasi</CardDescription>
        </CardHeader>
        <CardContent>
          <MembersListClient
            initialData={activeChunk.items}
            initialCursor={activeChunk.nextCursor}
          />
        </CardContent>
      </Card>
    </div>
  );
}

function formatWithOverflow(count: number, hasMore: boolean) {
  if (!count) return hasMore ? "0+" : "0";
  return hasMore ? `${count}+` : String(count);
}

type MemberChunk = {
  items: MemberListItem[];
  nextCursor?: string;
  hasNext: boolean;
};

async function fetchMembersChunk(
  params?: Parameters<typeof listMembers>[0]
): Promise<MemberChunk> {
  try {
    const res: MemberListResponse | null = await listMembers(params).catch(
      () => null
    );
    if (!res || !res.success || !Array.isArray(res.data)) {
      return { items: [], nextCursor: undefined, hasNext: false };
    }
    const pagination = res.meta?.pagination;
    return {
      items: res.data ?? [],
      nextCursor: pagination?.next_cursor || undefined,
      hasNext: Boolean(pagination?.has_next),
    };
  } catch {
    return { items: [], nextCursor: undefined, hasNext: false };
  }
}

function extractDashboardSummary(
  res: Awaited<ReturnType<typeof getKoperasiDashboard>> | null
): KoperasiDashboardSummary | null {
  if (!res || !res.success || !res.data) return null;
  return res.data as KoperasiDashboardSummary;
}
