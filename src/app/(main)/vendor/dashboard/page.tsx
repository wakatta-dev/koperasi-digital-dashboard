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
  BellIcon,
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
    title: "Active Plans",
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
    title: "Open Ticket",
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
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Recent updates from your clients</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div>
              {[
                {
                  client: "PT Maju Jaya",
                  message: "Order for Office Supplies has been completed.",
                  status: "completed",
                },
                {
                  client: "CV Berkah",
                  message: "Order for Cleaning Equipment is pending approval.",
                  status: "pending",
                },
                {
                  client: "UD Sejahtera",
                  message: "Order for Stationery is being processed.",
                  status: "processing",
                },
              ].map((notif, index, arr) => (
                <div
                  key={index}
                  className={`flex items-start gap-4 px-6 py-4 ${
                    index !== arr.length - 1 ? "border-b" : ""
                  }`}
                >
                  {/* Icon or Avatar */}
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    <BellIcon className="h-5 w-5 text-muted-foreground" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-0.5">
                    <p className="text-sm font-medium">{notif.client}</p>
                    <p className="text-sm text-muted-foreground">
                      {notif.message}
                    </p>
                  </div>

                  {/* Optional Status Badge */}
                  <div>
                    <Badge
                      variant={
                        notif.status === "completed"
                          ? "default"
                          : notif.status === "pending"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {notif.status}
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
                href="/vendor/plans"
                className="p-4 border rounded-lg hover:bg-muted transition-colors"
              >
                <Package className="h-6 w-6 mb-2" />
                <p className="font-medium">Add Plan</p>
                <p className="text-sm text-muted-foreground">
                  Create new plan
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
