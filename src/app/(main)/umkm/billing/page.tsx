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
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle2, CreditCard, Download, Puzzle, XCircle } from "lucide-react";

export default function BillingPage() {
  // TODO integrate API: fetch available modules, subscription status, invoices, and payments history
  const modules = [
    { key: "pos", name: "POS", desc: "Point-of-Sale untuk transaksi kasir", active: true },
    { key: "inventory", name: "Inventaris", desc: "Manajemen stok & produk", active: true },
    { key: "marketplace", name: "Marketplace", desc: "Toko online publik", active: false },
    { key: "reporting", name: "Pelaporan", desc: "Laporan keuangan & penjualan", active: true },
  ];

  const invoices = [
    { id: "INV-1001", date: "2025-08-01", total: 150000, status: "Paid" },
    { id: "INV-1002", date: "2025-09-01", total: 150000, status: "Pending" },
  ];

  const payments = [
    { id: "PMT-2001", date: "2025-08-01", amount: 150000, method: "Credit Card" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Billing & Langganan</h2>
          <p className="text-muted-foreground">Kelola modul langganan & pembayaran</p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" /> Unduh Tagihan Terbaru
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Modules catalog */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Puzzle className="h-5 w-5" /> Katalog Modul
            </CardTitle>
            <CardDescription>Aktifkan/nonaktifkan modul sesuai kebutuhan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {modules.map((m) => (
                <div key={m.key} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">{m.name}</p>
                    <p className="text-sm text-muted-foreground">{m.desc}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {/* TODO integrate API: toggle module activation */}
                    <Switch defaultChecked={m.active} />
                    {m.active ? (
                      <Badge className="gap-1" variant="default"><CheckCircle2 className="h-3 w-3" /> Aktif</Badge>
                    ) : (
                      <Badge className="gap-1" variant="secondary"><XCircle className="h-3 w-3" /> Nonaktif</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Current plan summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" /> Ringkasan Paket
            </CardTitle>
            <CardDescription>Status langganan saat ini</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Paket</span>
              <span>Standard</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Jatuh Tempo</span>
              <span>01 Okt 2025</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tagihan Berikutnya</span>
              <span>Rp 150.000</span>
            </div>
            <Button className="w-full mt-2">Perbarui Paket</Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Invoices */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Tagihan</CardTitle>
            <CardDescription>Tagihan aktif & terdahulu</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell className="font-medium">{inv.id}</TableCell>
                    <TableCell>{inv.date}</TableCell>
                    <TableCell>
                      <Badge variant={inv.status === 'Paid' ? 'default' : 'secondary'}>{inv.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">Rp {inv.total.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Payments history */}
        <Card>
          <CardHeader>
            <CardTitle>Riwayat Pembayaran</CardTitle>
            <CardDescription>Transaksi yang telah dibayar</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Metode</TableHead>
                  <TableHead className="text-right">Jumlah</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.id}</TableCell>
                    <TableCell>{p.date}</TableCell>
                    <TableCell>{p.method}</TableCell>
                    <TableCell className="text-right">Rp {p.amount.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

