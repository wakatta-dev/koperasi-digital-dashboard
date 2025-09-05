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
  Package,
  Plus,
  Search,
  Edit,
  Trash2,
  AlertTriangle,
} from "lucide-react";

const products = [
  {
    id: "P001",
    name: "Kopi Arabica Premium",
    category: "Minuman",
    stock: 25,
    minStock: 10,
    price: "Rp 15,000",
    cost: "Rp 8,000",
    status: "tersedia",
  },
  {
    id: "P002",
    name: "Roti Bakar Spesial",
    category: "Makanan",
    stock: 3,
    minStock: 15,
    price: "Rp 12,000",
    cost: "Rp 6,000",
    status: "stok_rendah",
  },
  {
    id: "P003",
    name: "Nasi Gudeg",
    category: "Makanan",
    stock: 0,
    minStock: 20,
    price: "Rp 18,000",
    cost: "Rp 10,000",
    status: "habis",
  },
  {
    id: "P004",
    name: "Es Teh Manis",
    category: "Minuman",
    stock: 50,
    minStock: 20,
    price: "Rp 5,000",
    cost: "Rp 2,000",
    status: "tersedia",
  },
];

export default function InventarisPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Inventaris</h2>
          <p className="text-muted-foreground">Kelola stok dan produk UMKM</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Tambah Produk
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Produk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">+8 produk baru</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Stok Tersedia</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142</div>
            <p className="text-xs text-muted-foreground">91% dari total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Stok Rendah</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">9</div>
            <p className="text-xs text-muted-foreground">Perlu restok</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Stok Habis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">5</div>
            <p className="text-xs text-muted-foreground">Segera restok</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Cari produk..." className="pl-10" />
            </div>
            <Button variant="outline">Filter Kategori</Button>
            <Button variant="outline">Filter Status</Button>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Produk</CardTitle>
          <CardDescription>Kelola inventaris dan stok produk</CardDescription>
        </CardHeader>
        <CardContent>
          {/* TODO integrate API: list products, edit, and live stock sync */}
          <div className="space-y-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                    <Package className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {product.id} • {product.category}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="font-medium">Stok: {product.stock}</p>
                    <p className="text-sm text-muted-foreground">
                      Min: {product.minStock}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-medium">{product.price}</p>
                    <p className="text-sm text-muted-foreground">
                      HPP: {product.cost}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {product.status === "stok_rendah" && (
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    )}
                    <Badge
                      variant={
                        product.status === "tersedia"
                          ? "default"
                          : product.status === "stok_rendah"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {product.status === "tersedia"
                        ? "Tersedia"
                        : product.status === "stok_rendah"
                          ? "Stok Rendah"
                          : "Habis"}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Realtime Stock & History */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Stok Realtime</CardTitle>
            <CardDescription>Status sinkronisasi stok</CardDescription>
          </CardHeader>
          <CardContent>
            {/* TODO integrate API: websocket or SSE for live stock updates */}
            <div className="flex items-center gap-2 text-sm">
              <span className="size-2 rounded-full bg-green-500" />
              <span>Tersambung ke kanal realtime</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Riwayat Stok</CardTitle>
            <CardDescription>Masuk/keluar stok terakhir</CardDescription>
          </CardHeader>
          <CardContent>
            {/* TODO integrate API: stock ledger */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>+10 Kopi Arabica</span>
                <span className="text-muted-foreground">Hari ini 09:12</span>
              </div>
              <div className="flex justify-between">
                <span>-3 Roti Bakar</span>
                <span className="text-muted-foreground">Kemarin 16:40</span>
              </div>
              <div className="flex justify-between">
                <span>+20 Es Teh Manis</span>
                <span className="text-muted-foreground">2 hari lalu 11:05</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
