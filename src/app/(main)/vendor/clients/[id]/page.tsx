/** @format */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShoppingCart,
  DollarSign,
  Edit,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

// Mock client data - in real app, this would come from API/database
const clients = [
  {
    id: "1",
    name: "PT Maju Jaya",
    email: "contact@majujaya.com",
    phone: "+62 21 1234567",
    address: "Jl. Sudirman No. 123, Jakarta Pusat, DKI Jakarta 10220",
    joinDate: "2023-01-15",
    totalOrders: 15,
    totalSpent: "Rp 12,500,000",
    status: "active",
    contactPerson: "Budi Santoso",
    industry: "Manufacturing",
    notes:
      "Klien premium dengan pembayaran selalu tepat waktu. Sering order dalam jumlah besar.",
  },
  {
    id: "2",
    name: "CV Berkah Sejahtera",
    email: "info@berkahsejahtera.com",
    phone: "+62 22 7654321",
    address: "Jl. Asia Afrika No. 45, Bandung, Jawa Barat 40111",
    joinDate: "2023-03-22",
    totalOrders: 8,
    totalSpent: "Rp 6,750,000",
    status: "active",
    contactPerson: "Siti Nurhaliza",
    industry: "Retail",
    notes: "Klien yang berkembang pesat, potensial untuk menjadi klien besar.",
  },
  {
    id: "3",
    name: "UD Mandiri",
    email: "admin@udmandiri.com",
    phone: "+62 24 9876543",
    address: "Jl. Pemuda No. 67, Semarang, Jawa Tengah 50132",
    joinDate: "2022-11-08",
    totalOrders: 3,
    totalSpent: "Rp 2,100,000",
    status: "inactive",
    contactPerson: "Ahmad Wijaya",
    industry: "Wholesale",
    notes: "Klien tidak aktif sejak 3 bulan terakhir. Perlu follow up.",
  },
];

// Mock recent orders
const recentOrders = [
  {
    id: "ORD-001",
    date: "2024-01-15",
    amount: "Rp 2,500,000",
    status: "completed",
  },
  {
    id: "ORD-002",
    date: "2024-01-10",
    amount: "Rp 1,750,000",
    status: "completed",
  },
  {
    id: "ORD-003",
    date: "2024-01-05",
    amount: "Rp 3,200,000",
    status: "pending",
  },
  {
    id: "ORD-004",
    date: "2023-12-28",
    amount: "Rp 1,900,000",
    status: "completed",
  },
  {
    id: "ORD-005",
    date: "2023-12-20",
    amount: "Rp 2,150,000",
    status: "completed",
  },
];

interface ClientDetailPageProps {
  params: {
    id: string;
  };
}

export default function ClientDetailPage({ params }: ClientDetailPageProps) {
  const client = clients.find((c) => c.id === params.id);

  if (!client) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/vendor/clients">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Clients
            </Button>
          </Link>
          <div>
            <h2 className="text-2xl font-bold">{client.name}</h2>
            <p className="text-muted-foreground">
              Client Details & Order History
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Edit Client
          </Button>
          <Button variant="destructive">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Client Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Client Information</CardTitle>
                <Badge
                  variant={client.status === "active" ? "default" : "secondary"}
                >
                  {client.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{client.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{client.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Join Date</p>
                      <p className="font-medium">
                        {new Date(client.joinDate).toLocaleDateString("id-ID")}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Contact Person
                    </p>
                    <p className="font-medium">{client.contactPerson}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Industry</p>
                    <p className="font-medium">{client.industry}</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-medium">{client.address}</p>
                </div>
              </div>

              {client.notes && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground">Notes</p>
                    <p className="font-medium">{client.notes}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{order.id}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.date).toLocaleDateString("id-ID")}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{order.amount}</p>
                      <Badge
                        variant={
                          order.status === "completed" ? "default" : "secondary"
                        }
                        className="text-xs"
                      >
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4 bg-transparent">
                View All Orders
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Statistics */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <ShoppingCart className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                  <p className="text-2xl font-bold">{client.totalOrders}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <DollarSign className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                  <p className="text-2xl font-bold">{client.totalSpent}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Calendar className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Customer Since
                  </p>
                  <p className="text-lg font-semibold">
                    {new Date(client.joinDate).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "long",
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full">Create New Order</Button>
              <Button variant="outline" className="w-full bg-transparent">
                Send Invoice
              </Button>
              <Button variant="outline" className="w-full bg-transparent">
                Send Message
              </Button>
              <Button variant="outline" className="w-full bg-transparent">
                Schedule Meeting
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
