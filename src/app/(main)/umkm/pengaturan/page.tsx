/** @format */

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ShoppingCart, Store, Bell, CreditCard, Shield } from "lucide-react";

export default function PengaturanPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Pengaturan</h2>
        <p className="text-muted-foreground">
          Kelola konfigurasi dan preferensi UMKM
        </p>
      </div>

      {/* Business Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Store className="h-5 w-5" />
            <CardTitle>Informasi Usaha</CardTitle>
          </div>
          <CardDescription>Data dasar usaha Anda</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="business-name">Nama Usaha</Label>
              <Input id="business-name" defaultValue="Warung Makan Sederhana" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="owner-name">Nama Pemilik</Label>
              <Input id="owner-name" defaultValue="Budi Santoso" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Nomor Telepon</Label>
              <Input id="phone" defaultValue="+62 812-3456-7890" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                defaultValue="budi@warungmakan.com"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Alamat</Label>
            <Input
              id="address"
              defaultValue="Jl. Merdeka No. 123, Jakarta Pusat"
            />
          </div>
          <Button>Simpan Perubahan</Button>
        </CardContent>
      </Card>

      {/* POS Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            <CardTitle>Pengaturan POS</CardTitle>
          </div>
          <CardDescription>Konfigurasi sistem point of sale</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="auto-print">Cetak Struk Otomatis</Label>
              <p className="text-sm text-muted-foreground">
                Cetak struk setelah transaksi selesai
              </p>
            </div>
            <Switch id="auto-print" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="tax-included">Harga Sudah Termasuk Pajak</Label>
              <p className="text-sm text-muted-foreground">
                Tampilkan harga final di POS
              </p>
            </div>
            <Switch id="tax-included" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tax-rate">Tarif Pajak (%)</Label>
              <Input id="tax-rate" type="number" defaultValue="10" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Mata Uang</Label>
              <Input id="currency" defaultValue="IDR" disabled />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <CardTitle>Notifikasi</CardTitle>
          </div>
          <CardDescription>Atur preferensi notifikasi</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="low-stock">Peringatan Stok Rendah</Label>
              <p className="text-sm text-muted-foreground">
                Notifikasi ketika stok produk menipis
              </p>
            </div>
            <Switch id="low-stock" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="daily-report">Laporan Harian</Label>
              <p className="text-sm text-muted-foreground">
                Kirim ringkasan penjualan harian
              </p>
            </div>
            <Switch id="daily-report" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="payment-reminder">Pengingat Pembayaran</Label>
              <p className="text-sm text-muted-foreground">
                Notifikasi untuk tagihan yang belum dibayar
              </p>
            </div>
            <Switch id="payment-reminder" />
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            <CardTitle>Metode Pembayaran</CardTitle>
          </div>
          <CardDescription>
            Konfigurasi opsi pembayaran yang diterima
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="cash">Tunai</Label>
              <p className="text-sm text-muted-foreground">
                Pembayaran dengan uang tunai
              </p>
            </div>
            <Switch id="cash" defaultChecked disabled />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="debit">Kartu Debit</Label>
              <p className="text-sm text-muted-foreground">
                Pembayaran dengan kartu debit
              </p>
            </div>
            <Switch id="debit" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="ewallet">E-Wallet</Label>
              <p className="text-sm text-muted-foreground">
                GoPay, OVO, DANA, dll
              </p>
            </div>
            <Switch id="ewallet" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="qris">QRIS</Label>
              <p className="text-sm text-muted-foreground">
                Pembayaran dengan QR Code
              </p>
            </div>
            <Switch id="qris" defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            <CardTitle>Keamanan</CardTitle>
          </div>
          <CardDescription>Pengaturan keamanan akun</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Password Saat Ini</Label>
            <Input id="current-password" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">Password Baru</Label>
            <Input id="new-password" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Konfirmasi Password Baru</Label>
            <Input id="confirm-password" type="password" />
          </div>
          <Button>Ubah Password</Button>
        </CardContent>
      </Card>
    </div>
  );
}
