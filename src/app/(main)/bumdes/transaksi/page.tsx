/** @format */

"use client";

import { useMemo, useState } from "react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, Filter } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";

type Tx = {
  id: string;
  date: string;
  unitId: string;
  unitName: string;
  type: "penjualan" | "pembelian" | "sewa";
  total: number;
  status: "draft" | "posted" | "void";
};

const mockTx: Tx[] = [
  { id: "TRX-001", date: "2024-02-01", unitId: "UU001", unitName: "Warung Sembako Desa", type: "penjualan", total: 250000, status: "posted" },
  { id: "TRX-002", date: "2024-02-02", unitId: "UU001", unitName: "Warung Sembako Desa", type: "pembelian", total: 150000, status: "posted" },
  { id: "TRX-003", date: "2024-02-03", unitId: "UU002", unitName: "Rental Alat Pertanian", type: "sewa", total: 500000, status: "draft" },
];

const mockUnits = [
  { id: "all", name: "Semua Unit" },
  { id: "UU001", name: "Warung Sembako Desa" },
  { id: "UU002", name: "Rental Alat Pertanian" },
];

export default function TransaksiPage() {
  const [unit, setUnit] = useState("all");
  const [type, setType] = useState("all");
  const [date, setDate] = useState("");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return mockTx.filter((t) =>
      (unit === "all" || t.unitId === unit) &&
      (type === "all" || t.type === (type as Tx["type"])) &&
      (!date || t.date === date) &&
      (t.id.toLowerCase().includes(search.toLowerCase()) || t.unitName.toLowerCase().includes(search.toLowerCase()))
    );
  }, [unit, type, date, search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">Transaksi</h2>
          <p className="text-muted-foreground">Transaksi per unit, terhubung ke keuangan</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={unit} onValueChange={setUnit}>
            <SelectTrigger className="min-w-[180px]"><SelectValue placeholder="Unit" /></SelectTrigger>
            <SelectContent>
              {mockUnits.map((u) => (
                <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="min-w-[160px]"><SelectValue placeholder="Tipe" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Tipe</SelectItem>
              <SelectItem value="penjualan">Penjualan</SelectItem>
              <SelectItem value="pembelian">Pembelian</SelectItem>
              <SelectItem value="sewa">Sewa</SelectItem>
            </SelectContent>
          </Select>
          <DatePicker value={date || undefined} onChange={(v) => setDate(v || "")} />
          <Input placeholder="Cari ID/unit..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <Button variant="outline"><Filter className="h-4 w-4 mr-2" /> Filter</Button>
          <Button variant="outline"><Download className="h-4 w-4 mr-2" /> Export</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Transaksi</CardTitle>
          <CardDescription>Transaksi terbaru</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Tipe</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell>{t.date}</TableCell>
                    <TableCell className="font-medium">{t.id}</TableCell>
                    <TableCell className="whitespace-nowrap">{t.unitName}</TableCell>
                    <TableCell className="capitalize">{t.type}</TableCell>
                    <TableCell>Rp {t.total.toLocaleString("id-ID")}</TableCell>
                    <TableCell>
                      <Badge variant={t.status === "posted" ? "default" : t.status === "draft" ? "secondary" : "destructive"}>
                        {t.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {/* TODO integrate API: GET /api/bumdes/transaksi with filters */}
        </CardContent>
      </Card>
    </div>
  );
}
