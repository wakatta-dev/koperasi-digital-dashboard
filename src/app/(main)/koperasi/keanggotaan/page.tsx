/** @format */

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MemberRegisterDialog } from "@/components/feature/koperasi/membership/member-register-dialog";
import { getKoperasiDashboard, listMembers } from "@/services/api";
import { MembersListClient } from "@/components/feature/koperasi/membership/members-list-client";
import { MemberVerifyDialog } from "@/components/feature/koperasi/membership/member-verify-dialog";

export default async function KeanggotaanPage() {
  const [summaryRes, membersRes, pendingRes, nonActiveRes, exitRes] =
    await Promise.all([
      getKoperasiDashboard().catch(() => null),
      listMembers({ limit: 10 }).catch(() => null),
      listMembers({ status: "pending", limit: 20 }).catch(() => null),
      listMembers({ status: "nonaktif", limit: 20 }).catch(() => null),
      listMembers({ status: "keluar", limit: 20 }).catch(() => null),
    ]);

  const summary =
    summaryRes && summaryRes.success ? summaryRes.data : null;

  const members =
    membersRes && membersRes.success ? ((membersRes.data as any[]) ?? []) : [];
  const nextCursor = (membersRes as any)?.meta?.pagination?.next_cursor as
    | string
    | undefined;

  const pendingMembers =
    pendingRes && pendingRes.success
      ? ((pendingRes.data as any[]) ?? [])
      : [];
  const nonActiveMembers =
    nonActiveRes && nonActiveRes.success
      ? ((nonActiveRes.data as any[]) ?? [])
      : [];
  const exitedMembers =
    exitRes && exitRes.success ? ((exitRes.data as any[]) ?? []) : [];

  const pendingCount = formatWithOverflow(
    pendingMembers.length,
    Boolean((pendingRes as any)?.meta?.pagination?.has_next)
  );
  const inactiveCount = formatWithOverflow(
    nonActiveMembers.length + exitedMembers.length,
    Boolean(
      (nonActiveRes as any)?.meta?.pagination?.has_next ||
        (exitRes as any)?.meta?.pagination?.has_next
    )
  );

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
          <MembersListClient initialData={members} initialCursor={nextCursor} />
        </CardContent>
      </Card>
    </div>
  );
}

function formatWithOverflow(count: number, hasMore: boolean) {
  if (!count) return hasMore ? "0+" : "0";
  return hasMore ? `${count}+` : String(count);
}
