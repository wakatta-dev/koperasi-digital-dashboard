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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarDays, Plus, DollarSign } from "lucide-react";
import { DateRangePicker } from "@/components/ui/date-range-picker";

type Asset = {
  id: string;
  name: string;
  type: string;
  pricePerHour?: number;
  pricePerDay?: number;
  status: "tersedia" | "disewa" | "maintenance";
};

type Booking = {
  id: string;
  assetId: string;
  assetName: string;
  tenant: string;
  start: string; // ISO date
  end: string;   // ISO date
  total: number;
  status: "pending" | "confirmed" | "cancelled";
};

const mockAssets: Asset[] = [
  { id: "A001", name: "Aula Desa", type: "Ruangan", pricePerHour: 150000, pricePerDay: 1000000, status: "tersedia" },
  { id: "A002", name: "Lapangan Futsal", type: "Olahraga", pricePerHour: 75000, pricePerDay: 500000, status: "disewa" },
  { id: "A003", name: "Sound System", type: "Peralatan", pricePerHour: 50000, pricePerDay: 300000, status: "tersedia" },
];

const mockBookings: Booking[] = [
  { id: "B001", assetId: "A001", assetName: "Aula Desa", tenant: "Karang Taruna", start: "2024-02-18", end: "2024-02-18", total: 600000, status: "confirmed" },
  { id: "B002", assetId: "A002", assetName: "Lapangan Futsal", tenant: "Komunitas Futsal", start: "2024-02-18", end: "2024-02-18", total: 150000, status: "pending" },
];

export default function AsetPage() {
  const [assets, setAssets] = useState<Asset[]>(mockAssets);
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [openAsset, setOpenAsset] = useState(false);
  const [openBooking, setOpenBooking] = useState(false);
  const [assetForm, setAssetForm] = useState<Partial<Asset>>({});
  const [bookingForm, setBookingForm] = useState<Partial<Booking>>({});

  const selectedAsset = useMemo(() => assets.find((a) => a.id === bookingForm.assetId), [assets, bookingForm.assetId]);
  const autoPrice = useMemo(() => {
    if (!selectedAsset || !bookingForm.start || !bookingForm.end) return 0;
    // naive calc: if same day -> hourly price * 4, else daily price * days
    const start = new Date(bookingForm.start);
    const end = new Date(bookingForm.end);
    const diff = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
    if (diff <= 1 && selectedAsset.pricePerHour) return selectedAsset.pricePerHour * 4;
    if (selectedAsset.pricePerDay) return selectedAsset.pricePerDay * diff;
    return 0;
  }, [selectedAsset, bookingForm.start, bookingForm.end]);

  function submitAsset() {
    // TODO integrate API: POST /api/bumdes/aset
    setAssets((prev) => [
      ...prev,
      {
        id: `A${(prev.length + 1).toString().padStart(3, "0")}`,
        name: assetForm.name || "",
        type: assetForm.type || "",
        pricePerHour: Number(assetForm.pricePerHour || 0) || undefined,
        pricePerDay: Number(assetForm.pricePerDay || 0) || undefined,
        status: (assetForm.status as Asset["status"]) || "tersedia",
      },
    ]);
    setOpenAsset(false);
    setAssetForm({});
  }

  function submitBooking() {
    // TODO integrate API: POST /api/bumdes/aset/bookings
    setBookings((prev) => [
      ...prev,
      {
        id: `B${(prev.length + 1).toString().padStart(3, "0")}`,
        assetId: bookingForm.assetId || "",
        assetName: selectedAsset?.name || "",
        tenant: bookingForm.tenant || "",
        start: bookingForm.start || "",
        end: bookingForm.end || "",
        total: autoPrice,
        status: "pending",
      },
    ]);
    setOpenBooking(false);
    setBookingForm({});
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">Aset & Jadwal Sewa</h2>
          <p className="text-muted-foreground">Katalog aset, kalender, dan pemesanan</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={openAsset} onOpenChange={setOpenAsset}>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4 mr-2" /> Tambah Aset</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tambah Aset</DialogTitle>
                <DialogDescription>Daftarkan aset yang dapat disewakan.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-3">
                <div className="grid gap-2">
                  <label className="text-sm">Nama Aset</label>
                  <Input value={assetForm.name || ""} onChange={(e) => setAssetForm((f) => ({ ...f, name: e.target.value }))} />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm">Tipe</label>
                  <Input value={assetForm.type || ""} onChange={(e) => setAssetForm((f) => ({ ...f, type: e.target.value }))} placeholder="Ruangan / Peralatan / Lainnya" />
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <label className="text-sm">Harga per Jam</label>
                    <Input type="number" value={assetForm.pricePerHour as number | undefined || ""} onChange={(e) => setAssetForm((f) => ({ ...f, pricePerHour: Number(e.target.value) }))} />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm">Harga per Hari</label>
                    <Input type="number" value={assetForm.pricePerDay as number | undefined || ""} onChange={(e) => setAssetForm((f) => ({ ...f, pricePerDay: Number(e.target.value) }))} />
                  </div>
                </div>
                <div className="grid gap-2">
                  <label className="text-sm">Status</label>
                  <Select value={(assetForm.status as string) || "tersedia"} onValueChange={(v) => setAssetForm((f) => ({ ...f, status: v as Asset["status"] }))}>
                    <SelectTrigger><SelectValue placeholder="Pilih status" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tersedia">Tersedia</SelectItem>
                      <SelectItem value="disewa">Disewa</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpenAsset(false)}>Batal</Button>
                <Button onClick={submitAsset}>Simpan</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={openBooking} onOpenChange={setOpenBooking}>
            <DialogTrigger asChild>
              <Button variant="outline"><CalendarDays className="h-4 w-4 mr-2" /> Booking</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Form Booking</DialogTitle>
                <DialogDescription>Pilih aset, tenant, dan tanggal.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-3">
                <div className="grid gap-2">
                  <label className="text-sm">Aset</label>
                  <Select value={bookingForm.assetId || ""} onValueChange={(v) => setBookingForm((f) => ({ ...f, assetId: v }))}>
                    <SelectTrigger><SelectValue placeholder="Pilih aset" /></SelectTrigger>
                    <SelectContent>
                      {assets.map((a) => (
                        <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <label className="text-sm">Tenant</label>
                  <Input value={bookingForm.tenant || ""} onChange={(e) => setBookingForm((f) => ({ ...f, tenant: e.target.value }))} placeholder="Nama penyewa" />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm">Rentang</label>
                  <DateRangePicker
                    value={{ start: bookingForm.start || undefined, end: bookingForm.end || undefined }}
                    onChange={(s, e) => setBookingForm((f) => ({ ...f, start: s || "", end: e || "" }))}
                    triggerClassName="w-full"
                  />
                </div>
                <div className="flex items-center justify-between rounded-md border p-3 text-sm">
                  <span className="text-muted-foreground">Perkiraan Biaya</span>
                  <span className="inline-flex items-center font-semibold"> <DollarSign className="h-4 w-4 mr-1" /> {autoPrice.toLocaleString("id-ID")} </span>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpenBooking(false)}>Batal</Button>
                <Button onClick={submitBooking}>Simpan</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Katalog Aset */}
      <Card>
        <CardHeader>
          <CardTitle>Katalog Aset</CardTitle>
          <CardDescription>Daftar aset yang tersedia</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assets.map((a) => (
              <div key={a.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{a.name}</div>
                    <div className="text-sm text-muted-foreground">{a.type}</div>
                  </div>
                  <Badge variant={a.status === "tersedia" ? "default" : a.status === "disewa" ? "secondary" : "destructive"}>{a.status}</Badge>
                </div>
                <div className="mt-3 text-sm text-muted-foreground">
                  {a.pricePerHour ? (<div>Harga/Jam: Rp {a.pricePerHour.toLocaleString("id-ID")}</div>) : null}
                  {a.pricePerDay ? (<div>Harga/Hari: Rp {a.pricePerDay.toLocaleString("id-ID")}</div>) : null}
                </div>
              </div>
            ))}
          </div>
          {/* TODO integrate API: GET/POST/PUT /api/bumdes/aset */}
        </CardContent>
      </Card>

      {/* Kalender Visual (placeholder) + Pemesanan & Tagihan */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Kalender Sewa</CardTitle>
            <CardDescription>Visualisasi jadwal sewa</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 rounded-md border flex items-center justify-center text-muted-foreground">
              Kalender akan ditambahkan
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pemesanan & Tagihan</CardTitle>
            <CardDescription>Daftar pemesanan terbaru</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              {bookings.map((b) => (
                <div key={b.id} className="p-3 rounded-md border">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{b.assetName} — {b.tenant}</div>
                    <Badge variant={b.status === "confirmed" ? "default" : b.status === "pending" ? "secondary" : "destructive"}>{b.status}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-muted-foreground mt-1">
                    <span>{b.start} → {b.end}</span>
                    <span className="inline-flex items-center"><DollarSign className="h-3 w-3 mr-1" /> {b.total.toLocaleString("id-ID")}</span>
                  </div>
                </div>
              ))}
            </div>
            {/* TODO integrate API: GET /api/bumdes/aset/bookings, invoices */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
