/** @format */

"use client";

import { useState } from "react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Plus, Edit, Trash2 } from "lucide-react";

type Unit = {
  id: string;
  name: string;
  type: string;
  manager: string;
  status: "aktif" | "berkembang" | "nonaktif";
};

const mockUnits: Unit[] = [
  { id: "UU001", name: "Warung Sembako Desa", type: "Perdagangan", manager: "Ibu Sari", status: "aktif" },
  { id: "UU002", name: "Rental Alat Pertanian", type: "Jasa", manager: "Pak Budi", status: "aktif" },
  { id: "UU003", name: "Pengolahan Hasil Tani", type: "Produksi", manager: "Ibu Dewi", status: "berkembang" },
];

export default function UnitsPage() {
  const [open, setOpen] = useState(false);
  const [units, setUnits] = useState<Unit[]>(mockUnits);
  const [form, setForm] = useState<Partial<Unit>>({});
  const [editingId, setEditingId] = useState<string | null>(null);

  function resetForm() {
    setForm({});
    setEditingId(null);
  }

  function onSubmit() {
    if (editingId) {
      setUnits((prev) => prev.map((u) => (u.id === editingId ? { ...u, ...(form as Unit) } : u)));
    } else {
      setUnits((prev) => [
        ...prev,
        { id: `UU${(prev.length + 1).toString().padStart(3, "0")}`, name: form.name || "", type: form.type || "", manager: form.manager || "", status: (form.status as Unit["status"]) || "aktif" },
      ]);
    }
    setOpen(false);
    resetForm();
  }

  function onEdit(unit: Unit) {
    setEditingId(unit.id);
    setForm(unit);
    setOpen(true);
  }

  function onDelete(id: string) {
    // TODO integrate API: DELETE /api/bumdes/units/:id
    setUnits((prev) => prev.filter((u) => u.id !== id));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Unit Usaha</h2>
          <p className="text-muted-foreground">Kelola unit usaha BUMDes</p>
        </div>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm(); }}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); }}>
              <Plus className="h-4 w-4 mr-2" /> Tambah Unit
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[520px]">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Unit" : "Tambah Unit"}</DialogTitle>
              <DialogDescription>Lengkapi data unit usaha.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Nama Unit</label>
                <Input value={form.name || ""} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="cth. Warung Sembako Desa" />
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Tipe</label>
                  <Input value={form.type || ""} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))} placeholder="Perdagangan / Jasa / Produksi" />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Pengelola</label>
                  <Input value={form.manager || ""} onChange={(e) => setForm((f) => ({ ...f, manager: e.target.value }))} placeholder="cth. Ibu Sari" />
                </div>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={form.status || "aktif"} onValueChange={(v) => setForm((f) => ({ ...f, status: v as Unit["status"] }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aktif">Aktif</SelectItem>
                    <SelectItem value="berkembang">Berkembang</SelectItem>
                    <SelectItem value="nonaktif">Nonaktif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Batal</Button>
              <Button onClick={onSubmit}>{editingId ? "Simpan" : "Tambah"}</Button>
            </DialogFooter>
            {/* TODO integrate API: POST/PUT /api/bumdes/units */}
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Unit</CardTitle>
          <CardDescription>Table unit usaha BUMDes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Tipe</TableHead>
                  <TableHead>Pengelola</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {units.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="whitespace-nowrap">{u.id}</TableCell>
                    <TableCell>{u.name}</TableCell>
                    <TableCell>{u.type}</TableCell>
                    <TableCell>{u.manager}</TableCell>
                    <TableCell>
                      <Badge variant={u.status === "aktif" ? "default" : u.status === "berkembang" ? "secondary" : "outline"}>
                        {u.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button size="sm" variant="outline" onClick={() => onEdit(u)}>
                        <Edit className="h-4 w-4 mr-1" /> Edit
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => onDelete(u.id)}>
                        <Trash2 className="h-4 w-4 mr-1" /> Hapus
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

