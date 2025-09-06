/** @format */

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MemberRegisterDialog } from "@/components/feature/koperasi/membership/member-register-dialog";
import { getKoperasiDashboardSummary, listMembers } from "@/services/api";
import { MembersListClient } from "@/components/feature/koperasi/membership/members-list-client";
import { MemberVerifyDialog } from "@/components/feature/koperasi/membership/member-verify-dialog";

export default async function KeanggotaanPage() {
  const [summaryRes, usersRes] = await Promise.all([
    getKoperasiDashboardSummary().catch(() => null),
    listMembers({ limit: 10 }).catch(() => null),
  ]);

  const summary = summaryRes && summaryRes.success ? summaryRes.data : null;
  const members = usersRes && usersRes.success ? (usersRes.data as any[]) : [];
  const nextCursor = (usersRes as any)?.meta?.pagination?.next_cursor as
    | string
    | undefined;

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Anggota</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary?.active_members ?? "-"}
            </div>
            <p className="text-xs text-muted-foreground">Aktif saat ini</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Anggota Aktif</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary?.active_members ?? "-"}
            </div>
            <p className="text-xs text-muted-foreground">Terverifikasi</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Anggota Baru</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">Bulan ini</p>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Gunakan tombol Verifikasi untuk menyetujui/menolak anggota dengan
          memasukkan ID.
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
