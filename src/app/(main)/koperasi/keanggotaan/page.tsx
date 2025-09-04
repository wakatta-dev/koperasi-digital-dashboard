/** @format */

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Users, Search, Edit, Eye } from "lucide-react";
import { MemberRegisterDialog } from "@/components/feature/koperasi/membership/member-register-dialog";
import { getKoperasiDashboardSummary, listUsers } from "@/services/api";

export default async function KeanggotaanPage() {
  const [summaryRes, usersRes] = await Promise.all([
    getKoperasiDashboardSummary().catch(() => null),
    listUsers().catch(() => null),
  ]);
  const summary = summaryRes && summaryRes.success ? summaryRes.data : null;
  const members = usersRes && usersRes.success ? (usersRes.data as any[]) : [];

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
            <div className="text-2xl font-bold">{summary?.active_members ?? "-"}</div>
            <p className="text-xs text-muted-foreground">Aktif saat ini</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Anggota Aktif</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.active_members ?? "-"}</div>
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

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Cari anggota..." className="pl-10" />
          </div>
        </CardContent>
      </Card>

      {/* Members Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Anggota</CardTitle>
          <CardDescription>Data lengkap anggota koperasi</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {members.map((member: any) => (
              <div
                key={String(member.id)}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium">{member.full_name ?? member.name ?? member.email}</h3>
                    <p className="text-sm text-muted-foreground">ID: {member.id} • {member.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <Badge variant={member.status ? "default" : "secondary"}>{member.status ? "aktif" : "non-aktif"}</Badge>

                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {!members?.length && (
              <div className="text-sm text-muted-foreground italic">Belum ada anggota</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
