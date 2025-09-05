/** @format */

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

export const dynamic = "force-dynamic";

export default function LaporanIndexPage() {
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
    </div>
  );
}

