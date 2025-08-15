/** @format */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Mail,
  Phone,
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

const clients = [
  {
    id: "1",
    name: "PT Maju Jaya",
    email: "contact@majujaya.com",
    phone: "+62 21 1234567",
    totalOrders: 15,
    totalSpent: "Rp 12,500,000",
    status: "active",
  },
  {
    id: "2",
    name: "CV Berkah Sejahtera",
    email: "info@berkahsejahtera.com",
    phone: "+62 22 7654321",
    totalOrders: 8,
    totalSpent: "Rp 6,750,000",
    status: "active",
  },
  {
    id: "3",
    name: "UD Mandiri",
    email: "admin@udmandiri.com",
    phone: "+62 24 9876543",
    totalOrders: 3,
    totalSpent: "Rp 2,100,000",
    status: "inactive",
  },
];

export default function ClientsPage() {
  return (
    <ProtectedRoute requiredRole="vendor">
      <DashboardLayout title="Clients Management" navigation={vendorNavigation}>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Clients</h2>
              <p className="text-muted-foreground">
                Manage your client relationships
              </p>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Client
            </Button>
          </div>

          {/* Search */}
          <Card>
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search clients..." className="pl-10" />
              </div>
            </CardContent>
          </Card>

          {/* Clients Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clients.map((client) => (
              <Card key={client.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{client.name}</CardTitle>
                    <Badge
                      variant={
                        client.status === "active" ? "default" : "secondary"
                      }
                    >
                      {client.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{client.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{client.phone}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Total Orders
                      </p>
                      <p className="font-semibold">{client.totalOrders}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Total Spent
                      </p>
                      <p className="font-semibold">{client.totalSpent}</p>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full bg-transparent">
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
