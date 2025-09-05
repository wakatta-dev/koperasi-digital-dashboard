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
  ShoppingCart,
  Search,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  Banknote,
} from "lucide-react";

const products = [
  { id: "P001", name: "Kopi Arabica Premium", price: 15000, stock: 25 },
  { id: "P002", name: "Roti Bakar Spesial", price: 12000, stock: 15 },
  { id: "P003", name: "Nasi Gudeg", price: 18000, stock: 20 },
  { id: "P004", name: "Es Teh Manis", price: 5000, stock: 50 },
  { id: "P005", name: "Paket Hemat", price: 40000, stock: 10 },
];

const cartItems = [
  { id: "P001", name: "Kopi Arabica Premium", price: 15000, quantity: 2 },
  { id: "P003", name: "Nasi Gudeg", price: 18000, quantity: 1 },
];

export default function POSPage() {
  // TODO integrate API: product list, cart state, submit payments (cash & non-cash)
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Product Selection */}
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Pilih Produk</CardTitle>
            <CardDescription>
              Klik produk untuk menambahkan ke keranjang
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Cari produk..." className="pl-10" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="p-4 border rounded-lg hover:bg-muted cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Stok: {product.stock}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">
                        Rp {product.price.toLocaleString()}
                      </p>
                      <Badge
                        variant={product.stock > 10 ? "default" : "secondary"}
                      >
                        {product.stock > 10 ? "Tersedia" : "Terbatas"}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cart and Checkout */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Keranjang Belanja</CardTitle>
            <CardDescription>Item yang dipilih</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      Rp {item.price.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {cartItems.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Keranjang kosong</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {cartItems.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Ringkasan Pembayaran</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>Rp {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pajak (10%)</span>
                  <span>Rp {tax.toLocaleString()}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>Rp {total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Button className="w-full" size="lg">
                  <Banknote className="h-4 w-4 mr-2" />
                  Bayar Tunai
                </Button>
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  size="lg"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Bayar Non-Tunai
                </Button>
              </div>

              <Button variant="ghost" className="w-full">
                Simpan sebagai Draft
              </Button>
            </CardContent>
          </Card>
        )}

        {cartItems.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Struk Digital</CardTitle>
              <CardDescription>Kirim struk via email/WhatsApp</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {/* TODO integrate API: generate receipt and send */}
              <div className="text-sm text-muted-foreground">
                Struk akan berisi ringkasan transaksi dan QR code.
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">Pratinjau</Button>
                <Button className="flex-1">Kirim Struk</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
