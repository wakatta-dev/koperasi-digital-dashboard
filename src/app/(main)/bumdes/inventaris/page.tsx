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
import { Plus, Tag, MinusCircle, PlusCircle } from "lucide-react";

type Item = {
  id: string;
  sku: string;
  name: string;
  unitId: string;
  unitName: string;
  stock: number;
  tags: string[];
};

const mockItems: Item[] = [
  { id: "P001", sku: "SKU-001", name: "Beras 5kg", unitId: "UU001", unitName: "Warung Sembako Desa", stock: 42, tags: ["sembako", "primer"] },
  { id: "P002", sku: "SKU-002", name: "Gula 1kg", unitId: "UU001", unitName: "Warung Sembako Desa", stock: 18, tags: ["sembako"] },
  { id: "P003", sku: "SKU-010", name: "Sewa Lapangan (Jam)", unitId: "UU002", unitName: "Rental Alat Pertanian", stock: 999, tags: ["jasa", "non-stock"] },
];

const mockUnits = [
  { id: "all", name: "Semua Unit" },
  { id: "UU001", name: "Warung Sembako Desa" },
  { id: "UU002", name: "Rental Alat Pertanian" },
];

export default function InventarisPage() {
  const [unit, setUnit] = useState<string>("all");
  const [items, setItems] = useState<Item[]>(mockItems);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return items.filter((i) =>
      (unit === "all" || i.unitId === unit) &&
      (i.name.toLowerCase().includes(search.toLowerCase()) || i.sku.toLowerCase().includes(search.toLowerCase()))
    );
  }, [items, unit, search]);

  function adjustStock(id: string, delta: number) {
    // TODO integrate API: PATCH /api/bumdes/inventaris/:id { stockDelta }
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, stock: Math.max(0, i.stock + delta) } : i)));
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">Inventaris</h2>
          <p className="text-muted-foreground">Produk per unit, tagging, dan stok</p>
        </div>
        <div className="flex gap-2">
          <Select value={unit} onValueChange={setUnit}>
            <SelectTrigger className="min-w-[200px]">
              <SelectValue placeholder="Pilih unit" />
            </SelectTrigger>
            <SelectContent>
              {mockUnits.map((u) => (
                <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button>
            <Plus className="h-4 w-4 mr-2" /> Tambah Produk
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Produk</CardTitle>
          <CardDescription>Kelola produk dan ketersediaan stok</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari nama atau SKU..." />
          </div>
          <div className="w-full overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SKU</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Tag</TableHead>
                  <TableHead>Stok</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="whitespace-nowrap">{item.sku}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell className="whitespace-nowrap">{item.unitName}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {item.tags.map((t) => (
                          <Badge key={t} variant="outline" className="text-xs">
                            <Tag className="h-3 w-3 mr-1" /> {t}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">{item.stock}</TableCell>
                    <TableCell className="text-right space-x-2 whitespace-nowrap">
                      <Button variant="outline" size="sm" onClick={() => adjustStock(item.id, -1)}>
                        <MinusCircle className="h-4 w-4 mr-1" /> Kurangi
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => adjustStock(item.id, +1)}>
                        <PlusCircle className="h-4 w-4 mr-1" /> Tambah
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {/* TODO integrate API: GET/POST/PUT for inventaris items and tags */}
        </CardContent>
      </Card>
    </div>
  );
}

