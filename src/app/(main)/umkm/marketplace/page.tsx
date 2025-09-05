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
import { Badge } from "@/components/ui/badge";
import { Package, Search, ShoppingBag, ShoppingCart, Store } from "lucide-react";

export default function MarketplacePage() {
  // TODO integrate API: fetch storefront settings, catalog, product detail, and checkout actions
  const sampleProducts = [
    { id: "P001", name: "Kopi Arabica Premium", price: 15000, stock: 25 },
    { id: "P002", name: "Roti Bakar Spesial", price: 12000, stock: 15 },
    { id: "P003", name: "Nasi Gudeg", price: 18000, stock: 20 },
    { id: "P004", name: "Es Teh Manis", price: 5000, stock: 50 },
  ];

  const sampleProduct = {
    id: "P001",
    name: "Kopi Arabica Premium",
    price: 15000,
    description:
      "Kopi arabica pilihan dengan aroma kuat dan rasa seimbang. Dikemas segar untuk kualitas terbaik.",
  };

  return (
    <div className="space-y-6">
      {/* Storefront public preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="h-5 w-5" /> Storefront Publik
          </CardTitle>
          <CardDescription>
            Pratinjau tampilan toko publik Anda
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 items-center md:items-start">
            <div className="h-24 w-24 rounded bg-muted" />
            <div className="flex-1 w-full">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">UMKM Kopi Nusantara</h3>
                  <p className="text-muted-foreground text-sm">Jl. Merdeka No. 123, Jakarta</p>
                </div>
                <Button size="sm" variant="outline">Kelola Tampilan</Button>
              </div>
              <div className="mt-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Cari di katalog..." className="pl-10" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Catalog */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" /> Katalog
          </CardTitle>
          <CardDescription>Produk yang ditampilkan di storefront</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sampleProducts.map((p) => (
              <div key={p.id} className="p-4 border rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="h-12 w-12 bg-muted rounded flex items-center justify-center">
                    <Package className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">{p.name}</h4>
                      <Badge variant={p.stock > 0 ? "default" : "destructive"}>
                        {p.stock > 0 ? "Tersedia" : "Habis"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Rp {p.price.toLocaleString()}</p>
                    <div className="mt-3 flex gap-2">
                      <Button size="sm" variant="outline">Detail</Button>
                      <Button size="sm">
                        <ShoppingCart className="h-4 w-4 mr-2" /> Tambah
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Product detail */}
      <Card>
        <CardHeader>
          <CardTitle>Detail Produk</CardTitle>
          <CardDescription>Informasi lengkap produk terpilih</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="h-32 w-32 bg-muted rounded" />
            <div className="space-y-2">
              <h3 className="font-semibold">{sampleProduct.name}</h3>
              <p className="text-muted-foreground text-sm">{sampleProduct.description}</p>
              <p className="font-bold">Rp {sampleProduct.price.toLocaleString()}</p>
              <div className="flex gap-2">
                <Button size="sm">Tambah ke Keranjang</Button>
                <Button size="sm" variant="outline">Bagikan</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Checkout */}
      <Card>
        <CardHeader>
          <CardTitle>Checkout</CardTitle>
          <CardDescription>Ringkasan pesanan dan pembayaran</CardDescription>
        </CardHeader>
        <CardContent>
          {/* TODO integrate API: create order, choose payment methods, and submit */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Item</p>
              <div className="flex justify-between text-sm">
                <span>{sampleProduct.name} x1</span>
                <span>Rp {sampleProduct.price.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Pajak (10%)</span>
                <span>Rp {(sampleProduct.price * 0.1).toLocaleString()}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-semibold">
                <span>Total</span>
                <span>Rp {(sampleProduct.price * 1.1).toLocaleString()}</span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Metode Pembayaran</p>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">Transfer</Button>
                <Button variant="outline" className="flex-1">E-Wallet</Button>
                <Button variant="outline" className="flex-1">COD</Button>
              </div>
              <Button className="w-full">Bayar Sekarang</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

