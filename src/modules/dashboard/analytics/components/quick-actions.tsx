/** @format */

"use client";

import { useRouter } from "next/navigation";
import { Plus, ShoppingBag, Archive, Wallet2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AnalyticsQuickAction } from "@/types/api";
import { trackAnalyticsEvent } from "../lib/telemetry";

const iconMap: Record<string, React.JSX.Element> = {
  new_sale: <ShoppingBag className="h-4 w-4" />,
  add_product: <Archive className="h-4 w-4" />,
  log_expense: <Wallet2 className="h-4 w-4" />,
};

type Props = {
  actions?: AnalyticsQuickAction[];
};

export function QuickActions({ actions }: Props) {
  const router = useRouter();
  if (!actions?.length) return null;

  return (
    <div className="rounded-lg border border-border/60 bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold">Tindakan Cepat</h3>
          <p className="text-xs text-muted-foreground">
            Mulai penjualan, tambah produk, atau catat pengeluaran.
          </p>
        </div>
        <Plus className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="mt-3 grid gap-2">
        {actions.map((action) => (
          <Button
            key={action.id}
            className="w-full justify-between"
            variant={action.enabled ? "default" : "secondary"}
            disabled={!action.enabled}
            onClick={() => {
              if (action.enabled) {
                trackAnalyticsEvent("quick_action_launch", {
                  id: action.id,
                  target: action.target_path,
                });
                router.push(action.target_path);
              }
            }}
          >
            <span className="flex items-center gap-2">
              {iconMap[action.id] ?? <Plus className="h-4 w-4" />}
              {action.label}
            </span>
            {!action.enabled ? (
              <span className="text-xs text-muted-foreground">Perlu izin</span>
            ) : null}
          </Button>
        ))}
      </div>
    </div>
  );
}
