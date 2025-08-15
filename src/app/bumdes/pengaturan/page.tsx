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
import { Textarea } from "@/components/ui/textarea";
import { Building, Bell, Shield, Users, DollarSign } from "lucide-react";

export default function PengaturanPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Pengaturan</h2>
        <p className="text-muted-foreground">
          Kelola konfigurasi dan preferensi BUMDes
        </p>
      </div>

      {/* BUMDes Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            <CardTitle>Informasi BUMDes</CardTitle>
          </div>
          <CardDescription>Data dasar Badan Usaha Milik Desa</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bumdes-name">Nama BUMDes</Label>
              <Input id="bumdes-name" defaultValue="BUMDes Maju Bersama" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="village-name">Nama Desa</Label>
              <Input id="village-name" defaultValue="Desa Maju Sejahtera" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="director-name">Nama Direktur</Label>
              <Input id="director-name" defaultValue="Budi Santoso" />
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
                defaultValue="info@bumdes-majubersama.id"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="established">Tahun Berdiri</Label>
              <Input id="established" defaultValue="2020" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Alamat Lengkap</Label>
            <Textarea
              id="address"
              defaultValue="Jl. Desa Raya No. 123, Desa Maju Sejahtera, Kecamatan Maju, Kabupaten Sejahtera, Provinsi Jawa Tengah"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="vision">Visi BUMDes</Label>
            <Textarea
              id="vision"
              defaultValue="Menjadi BUMDes yang mandiri, berkelanjutan, dan memberikan manfaat maksimal bagi kesejahteraan masyarakat desa"
            />
          </div>
          <Button>Simpan Perubahan</Button>
        </CardContent>
      </Card>

      {/* Business Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            <CardTitle>Pengaturan Bisnis</CardTitle>
          </div>
          <CardDescription>Konfigurasi operasional BUMDes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="auto-approval">Persetujuan Otomatis Sewa</Label>
              <p className="text-sm text-muted-foreground">
                Setujui booking aset secara otomatis
              </p>
            </div>
            <Switch id="auto-approval" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="advance-payment">Pembayaran Uang Muka</Label>
              <p className="text-sm text-muted-foreground">
                Wajibkan uang muka untuk booking
              </p>
            </div>
            <Switch id="advance-payment" defaultChecked />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="advance-percentage">
                Persentase Uang Muka (%)
              </Label>
              <Input id="advance-percentage" type="number" defaultValue="30" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cancellation-fee">Biaya Pembatalan (%)</Label>
              <Input id="cancellation-fee" type="number" defaultValue="10" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="booking-limit">Batas Waktu Booking (hari)</Label>
            <Input id="booking-limit" type="number" defaultValue="7" />
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
              <Label htmlFor="booking-notification">
                Notifikasi Booking Baru
              </Label>
              <p className="text-sm text-muted-foreground">
                Terima notifikasi untuk booking baru
              </p>
            </div>
            <Switch id="booking-notification" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="payment-reminder">Pengingat Pembayaran</Label>
              <p className="text-sm text-muted-foreground">
                Kirim pengingat untuk pembayaran tertunggak
              </p>
            </div>
            <Switch id="payment-reminder" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="monthly-report">Laporan Bulanan</Label>
              <p className="text-sm text-muted-foreground">
                Kirim ringkasan kinerja bulanan
              </p>
            </div>
            <Switch id="monthly-report" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="maintenance-alert">Peringatan Maintenance</Label>
              <p className="text-sm text-muted-foreground">
                Notifikasi jadwal maintenance aset
              </p>
            </div>
            <Switch id="maintenance-alert" />
          </div>
        </CardContent>
      </Card>

      {/* User Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            <CardTitle>Manajemen Pengguna</CardTitle>
          </div>
          <CardDescription>Kelola akses dan peran pengguna</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="multi-admin">Multi Admin</Label>
              <p className="text-sm text-muted-foreground">
                Izinkan beberapa admin mengelola sistem
              </p>
            </div>
            <Switch id="multi-admin" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="staff-access">Akses Staff</Label>
              <p className="text-sm text-muted-foreground">
                Berikan akses terbatas untuk staff
              </p>
            </div>
            <Switch id="staff-access" defaultChecked />
          </div>
          <div className="space-y-2">
            <Label htmlFor="session-timeout">Timeout Sesi (menit)</Label>
            <Input id="session-timeout" type="number" defaultValue="60" />
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
          <CardDescription>Pengaturan keamanan sistem</CardDescription>
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
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="two-factor">Autentikasi Dua Faktor</Label>
              <p className="text-sm text-muted-foreground">
                Tambahan keamanan dengan SMS/Email
              </p>
            </div>
            <Switch id="two-factor" />
          </div>
          <Button>Ubah Password</Button>
        </CardContent>
      </Card>
    </div>
  );
}
