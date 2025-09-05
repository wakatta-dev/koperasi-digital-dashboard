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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Plus, Search, Users } from "lucide-react";

export default function KontakPage() {
  // TODO integrate API: fetch customers list, customer profiles, and tier assignments
  const customers = [
    { id: "C001", name: "Andi Wijaya", email: "andi@example.com", tier: "Gold", spend: 2500000 },
    { id: "C002", name: "Siti Rahma", email: "siti@example.com", tier: "Silver", spend: 950000 },
    { id: "C003", name: "Budi Santoso", email: "budi@example.com", tier: "Regular", spend: 150000 },
  ];

  const selected = customers[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Kontak</h2>
          <p className="text-muted-foreground">Kelola pelanggan dan segmentasi harga</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" /> Tambah Pelanggan
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customers List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" /> Daftar Pelanggan
            </CardTitle>
            <CardDescription>Pelanggan terdaftar beserta tingkat harga</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Cari pelanggan..." className="pl-10" />
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Tingkat</TableHead>
                  <TableHead className="text-right">Total Belanja</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((c) => (
                  <TableRow key={c.id} className="cursor-pointer">
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell className="text-muted-foreground">{c.email}</TableCell>
                    <TableCell>
                      <Badge variant={c.tier === 'Gold' ? 'default' : c.tier === 'Silver' ? 'secondary' : 'outline'}>
                        {c.tier}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">Rp {c.spend.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Profile + pricing segment */}
        <Card>
          <CardHeader>
            <CardTitle>Profil Pelanggan</CardTitle>
            <CardDescription>Detail {selected.name}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Nama</p>
              <p className="font-medium">{selected.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{selected.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tingkat Harga</p>
              <div className="flex items-center gap-2">
                <Badge variant={selected.tier === 'Gold' ? 'default' : selected.tier === 'Silver' ? 'secondary' : 'outline'}>
                  {selected.tier}
                </Badge>
                <Button size="sm" variant="ghost">
                  <Edit className="h-4 w-4 mr-2" /> Ubah
                </Button>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Belanja</p>
              <p className="font-medium">Rp {selected.spend.toLocaleString()}</p>
            </div>

            {/* TODO integrate API: update customer tier assignment */}
            <Button className="w-full" variant="outline">Simpan Perubahan</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

