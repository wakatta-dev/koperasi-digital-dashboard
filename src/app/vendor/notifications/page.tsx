/** @format */

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  Users,
  Package,
  FileText,
  Bell,
  Ticket,
  CheckCircle,
  AlertCircle,
  Info,
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

const notifications = [
  {
    id: "1",
    title: "New Order Received",
    message: "PT Maju Jaya placed a new order worth Rp 2,450,000",
    type: "success",
    time: "2 hours ago",
    read: false,
  },
  {
    id: "2",
    title: "Low Stock Alert",
    message: "Wireless Mouse is running low on stock (3 items remaining)",
    type: "warning",
    time: "4 hours ago",
    read: false,
  },
  {
    id: "3",
    title: "Invoice Payment Received",
    message: "Payment received for invoice INV-001 from CV Berkah",
    type: "success",
    time: "1 day ago",
    read: true,
  },
  {
    id: "4",
    title: "System Maintenance",
    message: "Scheduled maintenance will occur tonight from 2-4 AM",
    type: "info",
    time: "2 days ago",
    read: true,
  },
];

export default function NotificationsPage() {
  return (
    <ProtectedRoute requiredRole="vendor">
      <DashboardLayout title="Notifications" navigation={vendorNavigation}>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Notifications</h2>
              <p className="text-muted-foreground">
                Stay updated with your business activities
              </p>
            </div>
            <Button variant="outline">Mark All as Read</Button>
          </div>

          {/* Notifications List */}
          <div className="space-y-4">
            {notifications.map((notification) => (
              <Card
                key={notification.id}
                className={`${!notification.read ? "border-primary/50" : ""}`}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      {notification.type === "success" && (
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        </div>
                      )}
                      {notification.type === "warning" && (
                        <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                          <AlertCircle className="h-5 w-5 text-yellow-600" />
                        </div>
                      )}
                      {notification.type === "info" && (
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Info className="h-5 w-5 text-blue-600" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{notification.title}</h3>
                        <div className="flex items-center gap-2">
                          {!notification.read && (
                            <Badge variant="default" className="text-xs">
                              New
                            </Badge>
                          )}
                          <span className="text-sm text-muted-foreground">
                            {notification.time}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {notification.message}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
