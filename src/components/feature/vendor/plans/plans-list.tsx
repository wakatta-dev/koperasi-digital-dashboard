/** @format */

"use client";

import { useMemo } from "react";
import { Package, Plus, Search, Edit, Trash2 } from "lucide-react";
import { useVendorPlans, useBillingActions } from "@/hooks/queries/billing";
import type { Plan } from "@/types/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  initialData?: Plan[];
  limit?: number;
};

export function VendorPlansList({ initialData, limit = 20 }: Props) {
  const params = useMemo(() => ({ limit }), [limit]);
  const { data: plans = [] } = useVendorPlans(params, initialData);
  const { deletePlan } = useBillingActions();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Plans</h2>
          <p className="text-muted-foreground">Manage your plans</p>
        </div>
        <form>
          <Button type="submit">
            <Plus className="h-4 w-4 mr-2" />
            Add Plan
          </Button>
        </form>
      </div>

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
                    <p className="text-sm text-muted-foreground">
                      Duration: {plan.duration_months ?? 0} months
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="font-medium">
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 0,
                      }).format(plan.price)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" type="button">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      type="button"
                      onClick={() => deletePlan.mutate(plan.id)}
                    >
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
