/** @format */

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Package,
  FileText,
  Ticket,
  TrendingUp,
  DollarSign,
} from "lucide-react";

const dashboardStats = [
  {
    title: "Total Revenue",
    value: "Rp 2,450,000",
    change: "+12.5%",
    trend: "up" as const,
    icon: <DollarSign className="h-4 w-4" />,
  },
  {
    title: "Active Products",
    value: "156",
    change: "+3",
    trend: "up" as const,
    icon: <Package className="h-4 w-4" />,
  },
  {
    title: "Total Clients",
    value: "89",
    change: "+7",
    trend: "up" as const,
    icon: <Users className="h-4 w-4" />,
  },
  {
    title: "Pending Invoices",
    value: "12",
    change: "-2",
    trend: "down" as const,
    icon: <FileText className="h-4 w-4" />,
  },
];

export default function VendorDashboard() {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <TrendingUp
                  className={`h-3 w-3 ${
                    stat.trend === "up" ? "text-green-500" : "text-red-500"
                  }`}
                />
                <span
                  className={
                    stat.trend === "up" ? "text-green-500" : "text-red-500"
                  }
                >
                  {stat.change}
                </span>
                <span>from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest orders from your clients</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  client: "PT Maju Jaya",
                  product: "Office Supplies",
                  amount: "Rp 450,000",
                  status: "completed",
                },
                {
                  client: "CV Berkah",
                  product: "Cleaning Equipment",
                  amount: "Rp 320,000",
                  status: "pending",
                },
                {
                  client: "UD Sejahtera",
                  product: "Stationery",
                  amount: "Rp 180,000",
                  status: "processing",
                },
              ].map((order, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{order.client}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.product}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{order.amount}</p>
                    <Badge
                      variant={
                        order.status === "completed"
                          ? "default"
                          : order.status === "pending"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <a
                href="/products"
                className="p-4 border rounded-lg hover:bg-muted transition-colors"
              >
                <Package className="h-6 w-6 mb-2" />
                <p className="font-medium">Add Product</p>
                <p className="text-sm text-muted-foreground">
                  Create new product
                </p>
              </a>
              <a
                href="/invoices"
                className="p-4 border rounded-lg hover:bg-muted transition-colors"
              >
                <FileText className="h-6 w-6 mb-2" />
                <p className="font-medium">New Invoice</p>
                <p className="text-sm text-muted-foreground">
                  Generate invoice
                </p>
              </a>
              <a
                href="/clients"
                className="p-4 border rounded-lg hover:bg-muted transition-colors"
              >
                <Users className="h-6 w-6 mb-2" />
                <p className="font-medium">Add Client</p>
                <p className="text-sm text-muted-foreground">
                  Register new client
                </p>
              </a>
              <a
                href="/tickets"
                className="p-4 border rounded-lg hover:bg-muted transition-colors"
              >
                <Ticket className="h-6 w-6 mb-2" />
                <p className="font-medium">Support</p>
                <p className="text-sm text-muted-foreground">Create ticket</p>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
