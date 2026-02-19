/** @format */

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import type { CashRegisterItem } from "../../types/bank-cash";

type FeatureCashRegistersGridProps = {
  items?: CashRegisterItem[];
};

export function FeatureCashRegistersGrid({
  items = [],
}: FeatureCashRegistersGridProps) {
  const gridClass =
    items.length >= 2
      ? "grid grid-cols-1 gap-4 md:grid-cols-2"
      : "grid grid-cols-1 gap-4";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Kas / Cash Register</h3>
        <Button
          type="button"
          variant="outline"
          className="border-indigo-200 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-300 dark:hover:bg-indigo-900/20"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Register
        </Button>
      </div>

      <div className={gridClass}>
        {items.length === 0 ? (
          <div className="col-span-full rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center text-sm text-gray-600 dark:border-gray-700 dark:bg-gray-900/20 dark:text-gray-300">
            Belum ada cash register yang tersedia.
          </div>
        ) : null}
        {items.map((item) => (
          <Card key={item.id} className="h-full rounded-xl border border-gray-200 shadow-sm dark:border-gray-700">
            <CardContent className="flex h-full flex-col space-y-2.5 p-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-gray-900 dark:text-white">{item.register_name}</h4>
                <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                  {item.status_label}
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{item.register_type}</p>
              <p className="mt-auto text-xl font-bold text-gray-900 dark:text-white">{item.balance_label}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
