/** @format */

import { ProtectedRoute } from "@/components/shared/protected-route";
import { DashboardLayout } from "@/components/shared/dashboard-layout";
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
  BarChart3,
  Package,
  ShoppingCart,
  Settings,
  FileText,
  Calculator,
  Plus,
  Search,
  Edit,
  Crown,
  Star,
  User,
} from "lucide-react";

const umkmNavigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: <BarChart3 className="h-4 w-4" />,
  },
  {
    name: "Inventaris",
    href: "/inventaris",
    icon: <Package className="h-4 w-4" />,
  },
  {
    name: "Harga Bertingkat",
    href: "/harga-bertingkat",
    icon: <Calculator className="h-4 w-4" />,
  },
  { name: "POS", href: "/pos", icon: <ShoppingCart className="h-4 w-4" /> },
  { name: "Laporan", href: "/laporan", icon: <FileText className="h-4 w-4" /> },
  {
    name: "Pengaturan",
    href: "/pengaturan",
    icon: <Settings className="h-4 w-4" />,
  },
];

const customerTiers = [
  {
    id: "regular",
    name: "Pelanggan Reguler",
    icon: <User className="h-5 w-5" />,
    minPurchase: "Rp 0",
    discount: "0%",
    color: "bg-gray-100",
    members: 245,
  },
  {
    id: "silver",
    name: "Pelanggan Silver",
    icon: <Star className="h-5 w-5" />,
    minPurchase: "Rp 500,000",
    discount: "5%",
    color: "bg-gray-200",
    members: 89,
  },
  {
    id: "gold",
    name: "Pelanggan Gold",
    icon: <Crown className="h-5 w-5" />,
    minPurchase: "Rp 1,500,000",
    discount: "10%",
    color: "bg-yellow-200",
    members: 34,
  },
  {
    id: "vip",
    name: "Pelanggan VIP",
    icon: <Crown className="h-5 w-5" />,
    minPurchase: "Rp 5,000,000",
    discount: "15%",
    color: "bg-purple-200",
    members: 12,
  },
];

const productPricing = [
  {
    id: "P001",
    name: "Kopi Arabica Premium",
    category: "Minuman",
    basePrice: "Rp 15,000",
    prices: {
      regular: "Rp 15,000",
      silver: "Rp 14,250",
      gold: "Rp 13,500",
      vip: "Rp 12,750",
    },
  },
  {
    id: "P002",
    name: "Nasi Gudeg",
    category: "Makanan",
    basePrice: "Rp 18,000",
    prices: {
      regular: "Rp 18,000",
      silver: "Rp 17,100",
      gold: "Rp 16,200",
      vip: "Rp 15,300",
    },
  },
  {
    id: "P003",
    name: "Paket Hemat",
    category: "Paket",
    basePrice: "Rp 40,000",
    prices: {
      regular: "Rp 40,000",
      silver: "Rp 38,000",
      gold: "Rp 36,000",
      vip: "Rp 34,000",
    },
  },
];

export default function HargaBertingkatPage() {
  return (
    <ProtectedRoute requiredRole="umkm">
      <DashboardLayout title="Harga Bertingkat" navigation={umkmNavigation}>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Harga Bertingkat</h2>
              <p className="text-muted-foreground">
                Kelola harga berdasarkan tingkat pelanggan
              </p>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Tingkat
            </Button>
          </div>

          {/* Customer Tiers */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {customerTiers.map((tier) => (
              <Card key={tier.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-lg ${tier.color}`}>
                        {tier.icon}
                      </div>
                      <CardTitle className="text-sm">{tier.name}</CardTitle>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Min. Pembelian
                    </p>
                    <p className="font-medium">{tier.minPurchase}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Diskon</p>
                    <p className="font-medium">{tier.discount}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Anggota</p>
                    <p className="font-medium">{tier.members} orang</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Search */}
          <Card>
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Cari produk..." className="pl-10" />
              </div>
            </CardContent>
          </Card>

          {/* Product Pricing Table */}
          <Card>
            <CardHeader>
              <CardTitle>Daftar Harga Produk</CardTitle>
              <CardDescription>
                Harga produk berdasarkan tingkat pelanggan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {productPricing.map((product) => (
                  <div key={product.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-4">
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
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          Harga Dasar: {product.basePrice}
                        </Badge>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {customerTiers.map((tier) => (
                        <div key={tier.id} className="p-3 bg-muted rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <div className={`p-1 rounded ${tier.color}`}>
                              {tier.icon}
                            </div>
                            <p className="text-sm font-medium">{tier.name}</p>
                          </div>
                          <p className="text-lg font-bold">
                            {
                              product.prices[
                                tier.id as keyof typeof product.prices
                              ]
                            }
                          </p>
                          {tier.discount !== "0%" && (
                            <p className="text-sm text-green-600">
                              Hemat {tier.discount}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
