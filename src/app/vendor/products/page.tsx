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
  BarChart3,
  Users,
  Package,
  FileText,
  Bell,
  Ticket,
  Plus,
  Search,
  Edit,
  Trash2,
} from "lucide-react";
import { DashboardLayout } from "@/components/shared/dashboard-layout";
import { ProtectedRoute } from "@/components/shared/protected-route";

const vendorNavigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: <BarChart3 className="h-4 w-4" />,
  },
  {
    name: "Products",
    href: "/products",
    icon: <Package className="h-4 w-4" />,
  },
  { name: "Clients", href: "/clients", icon: <Users className="h-4 w-4" /> },
  {
    name: "Invoices",
    href: "/invoices",
    icon: <FileText className="h-4 w-4" />,
  },
  { name: "Users", href: "/users", icon: <Users className="h-4 w-4" /> },
  {
    name: "Notifications",
    href: "/notifications",
    icon: <Bell className="h-4 w-4" />,
  },
  { name: "Tickets", href: "/tickets", icon: <Ticket className="h-4 w-4" /> },
];

const products = [
  {
    id: "1",
    name: "Office Chair Premium",
    category: "Furniture",
    price: "Rp 1,250,000",
    stock: 45,
    status: "active",
  },
  {
    id: "2",
    name: "Laptop Stand Adjustable",
    category: "Electronics",
    price: "Rp 350,000",
    stock: 23,
    status: "active",
  },
  {
    id: "3",
    name: "Wireless Mouse",
    category: "Electronics",
    price: "Rp 125,000",
    stock: 0,
    status: "out_of_stock",
  },
  {
    id: "4",
    name: "Desk Organizer",
    category: "Office Supplies",
    price: "Rp 85,000",
    stock: 67,
    status: "active",
  },
];

export default function ProductsPage() {
  return (
    <ProtectedRoute requiredRole="vendor">
      <DashboardLayout
        title="Products Management"
        navigation={vendorNavigation}
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Products</h2>
              <p className="text-muted-foreground">
                Manage your product catalog
              </p>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>

          {/* Search and Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search products..." className="pl-10" />
                </div>
                <Button variant="outline">Filter</Button>
              </div>
            </CardContent>
          </Card>

          {/* Products Table */}
          <Card>
            <CardHeader>
              <CardTitle>Product List</CardTitle>
              <CardDescription>All your products in one place</CardDescription>
            </CardHeader>
            <CardContent>
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
                          {product.category}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="font-medium">{product.price}</p>
                        <p className="text-sm text-muted-foreground">
                          Stock: {product.stock}
                        </p>
                      </div>

                      <Badge
                        variant={
                          product.status === "active"
                            ? "default"
                            : "destructive"
                        }
                      >
                        {product.status === "active"
                          ? "Active"
                          : "Out of Stock"}
                      </Badge>

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
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
