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
import { Package, Plus, Search, Edit, Trash2 } from "lucide-react";

const plans = [
  {
    id: "1",
    name: "Basic Plan",
    tier: "Starter",
    price: "Rp 100,000",
    users: 100,
    status: "active",
  },
  {
    id: "2",
    name: "Standard Plan",
    tier: "Business",
    price: "Rp 250,000",
    users: 250,
    status: "active",
  },
  {
    id: "3",
    name: "Premium Plan",
    tier: "Enterprise",
    price: "Rp 500,000",
    users: 0,
    status: "inactive",
  },
  {
    id: "4",
    name: "Custom Plan",
    tier: "Tailored",
    price: "Rp 850,000",
    users: 67,
    status: "active",
  },
];

export default function PlansPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Plans</h2>
          <p className="text-muted-foreground">Manage your plans</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Plan
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search plans..." className="pl-10" />
            </div>
            <Button variant="outline">Filter</Button>
          </div>
        </CardContent>
      </Card>

      {/* Plans Table */}
      <Card>
        <CardHeader>
          <CardTitle>Plan List</CardTitle>
          <CardDescription>All your plans in one place</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                    <Package className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground">{plan.tier}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="font-medium">{plan.price}</p>
                    <p className="text-sm text-muted-foreground">Users: {plan.users}</p>
                  </div>

                  <Badge
                    variant={plan.status === "active" ? "default" : "destructive"}
                  >
                    {plan.status === "active" ? "Active" : "Inactive"}
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
  );
}
