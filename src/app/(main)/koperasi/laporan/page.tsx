/** @format */

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { getReportHistory } from "@/services/api";
import { ExportQuickClient } from "@/components/feature/koperasi/report/export-quick-client";
import type { GetReportHistoryResponse, ReportArchive } from "@/types/api";

export const dynamic = "force-dynamic";

export default async function LaporanIndexPage() {
  const res: GetReportHistoryResponse | null = await getReportHistory().catch(
    () => null
  );

  const history: ReportArchive[] = Array.isArray(res?.data) && res?.success
    ? (res.data as ReportArchive[])
    : [];

  const historyError = res && !res.success ? res.message : null;

  const formatDate = (value?: string) => {
    if (!value) return "-";
    try {
      return new Intl.DateTimeFormat("id-ID", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      }).format(new Date(value));
    } catch {
      return value;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Laporan</h2>
          <p className="text-muted-foreground">Ringkasan laporan keuangan koperasi</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/koperasi/laporan/neraca">
          <Card className="hover:bg-muted/40 transition-colors">
            <CardHeader>
              <CardTitle>Neraca</CardTitle>
              <CardDescription>Aktiva, Kewajiban, Ekuitas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <FileText className="h-4 w-4" /> Lihat neraca
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/koperasi/laporan/laba-rugi">
          <Card className="hover:bg-muted/40 transition-colors">
            <CardHeader>
              <CardTitle>Laba Rugi</CardTitle>
              <CardDescription>Pendapatan, Beban, Laba Bersih</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <FileText className="h-4 w-4" /> Lihat laba rugi
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/koperasi/laporan/arus-kas">
          <Card className="hover:bg-muted/40 transition-colors">
            <CardHeader>
              <CardTitle>Arus Kas</CardTitle>
              <CardDescription>Operasional, Investasi, Pendanaan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <FileText className="h-4 w-4" /> Lihat arus kas
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Export gabungan */}
      <ExportQuickClient />

      <Card>
        <CardHeader>
          <CardTitle>Riwayat Export Laporan</CardTitle>
          <CardDescription>File export yang pernah dibuat</CardDescription>
        </CardHeader>
        <CardContent>
          {historyError ? (
            <div className="text-sm text-destructive">{historyError}</div>
          ) : null}
          <div className="space-y-3">
            {history.map((record) => (
              <div
                key={String(record.id)}
                className="flex items-center justify-between rounded border p-3"
              >
                <div>
                  <div className="font-medium">
                    {record.type || "report"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Periode: {formatDate(record.period_start)} s/d {formatDate(record.period_end)}
                  </div>
                </div>
                {record.file_url ? (
                  <a
                    href={record.file_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm underline"
                  >
                    Unduh
                  </a>
                ) : (
                  <span className="text-xs text-muted-foreground">
                    File belum tersedia
                  </span>
                )}
              </div>
            ))}
            {!history.length && !historyError && (
              <div className="text-sm text-muted-foreground italic">
                Belum ada riwayat export
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
