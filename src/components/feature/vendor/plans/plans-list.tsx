/** @format */

"use client";

import { useEffect, useMemo, useState } from "react";
import { Package, Search, Edit, Trash2 } from "lucide-react";
import { useVendorPlans, useBillingActions } from "@/hooks/queries/billing";
import { useSession } from "next-auth/react";
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
import { PlanUpsertDialog } from "@/components/feature/vendor/plans/plan-upsert-dialog";
import { useConfirm } from "@/hooks/use-confirm";

import { motion } from "framer-motion";
import { listModules } from "@/services/api";

type Props = {
  initialData?: Plan[];
  limit?: number;
};

export function VendorPlansList({ initialData, limit = 20 }: Props) {
  const { data: session } = useSession();
  const isSuperAdmin = ((session?.user as any)?.role ?? "").includes("admin");
  const [q, setQ] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [moduleFilter, setModuleFilter] = useState<string>("");
  const [modules, setModules] = useState<
    Array<{ id: string; code: string; name: string }>
  >([]);
  const params = useMemo(() => ({ limit }), [limit]);
  const { data: plans = [] } = useVendorPlans(params, initialData);
  const { deletePlan, updatePlanStatus } = useBillingActions();
  const confirm = useConfirm();

  useEffect(() => {
    (async () => {
      try {
        const res = await listModules().catch(() => null);
        setModules(
          ((res?.data as any[]) ?? []).map((m: any) => ({
            id: String(m.id ?? m.code),
            code: m.code,
            name: m.name,
          }))
        );
      } catch {
        setModules([]);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    return (plans ?? []).filter((p: any) => {
      const matchQ =
        !q || (p.name || "").toLowerCase().includes(q.toLowerCase());
      const matchType =
        !typeFilter ||
        String(p.type || "").toLowerCase() === typeFilter.toLowerCase();
      const matchModule =
        !moduleFilter ||
        String(p.module_code || "").toLowerCase() ===
          moduleFilter.toLowerCase();
      return matchQ && matchType && matchModule;
    });
  }, [plans, q, typeFilter, moduleFilter]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Plans</h2>
          <p className="text-muted-foreground">Manage your plans</p>
        </div>
        {isSuperAdmin && <PlanUpsertDialog />}
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search plans..."
                className="pl-10"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
            <select
              className="border rounded px-3 py-2 text-sm"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="">Type (all)</option>
              <option value="package">package</option>
              <option value="addon">addon</option>
            </select>
            <select
              className="border rounded px-3 py-2 text-sm"
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
            >
              <option value="">Module (all)</option>
              {modules.map((m) => (
                <option key={m.id} value={m.code}>
                  {m.name} ({m.code})
                </option>
              ))}
            </select>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                type="button"
                onClick={() => {
                  setQ("");
                  setTypeFilter("");
                  setModuleFilter("");
                }}
              >
                Reset
              </Button>
            </div>
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
            {filtered.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                    <Package className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {(plan as any).type ?? "package"} • module:{" "}
                      {(plan as any).module_code ?? "-"} • duration:{" "}
                      {plan.duration_months ?? 0} months
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
                    {isSuperAdmin && (
                      <select
                        defaultValue={(plan as any).status ?? "active"}
                        className="border rounded px-2 py-1 text-sm"
                        onChange={async (e) => {
                          const next = e.target.value;
                          const ok = await confirm({
                            variant: "edit",
                            title: "Ubah status plan?",
                            description: `Status akan menjadi ${next}.`,
                            confirmText: "Simpan",
                          });
                          if (!ok) return;
                          await updatePlanStatus.mutateAsync({
                            id: plan.id,
                            status: next,
                          });
                        }}
                      >
                        <option value="active">active</option>
                        <option value="inactive">inactive</option>
                      </select>
                    )}
                    {isSuperAdmin && (
                      <PlanUpsertDialog
                        plan={plan}
                        trigger={
                          <Button variant="ghost" size="icon" type="button">
                            <Edit className="h-4 w-4" />
                          </Button>
                        }
                      />
                    )}
                    {isSuperAdmin && (
                      <Button
                        variant="ghost"
                        size="icon"
                        type="button"
                        onClick={async () => {
                          const ok = await confirm({
                            variant: "delete",
                            title: "Hapus plan?",
                            description: `Plan ${plan.name} akan dihapus.`,
                            confirmText: "Hapus",
                          });
                          if (!ok) return;
                          deletePlan.mutate(plan.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
