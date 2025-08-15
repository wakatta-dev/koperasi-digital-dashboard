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
  Shield,
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

const users = [
  {
    id: "1",
    name: "John Doe",
    email: "john@vendor.com",
    role: "Admin",
    status: "active",
    lastLogin: "2024-01-15",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@vendor.com",
    role: "Manager",
    status: "active",
    lastLogin: "2024-01-14",
  },
  {
    id: "3",
    name: "Bob Wilson",
    email: "bob@vendor.com",
    role: "Staff",
    status: "inactive",
    lastLogin: "2024-01-10",
  },
];

export default function UsersPage() {
  return (
    <ProtectedRoute requiredRole="vendor">
      <DashboardLayout title="Users Management" navigation={vendorNavigation}>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Users</h2>
              <p className="text-muted-foreground">
                Manage team members and permissions
              </p>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>

          {/* Search */}
          <Card>
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search users..." className="pl-10" />
              </div>
            </CardContent>
          </Card>

          {/* Users Table */}
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>
                All users with access to your vendor account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                        <Users className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-medium">{user.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{user.role}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Last login: {user.lastLogin}
                        </p>
                      </div>

                      <Badge
                        variant={
                          user.status === "active" ? "default" : "secondary"
                        }
                      >
                        {user.status}
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
