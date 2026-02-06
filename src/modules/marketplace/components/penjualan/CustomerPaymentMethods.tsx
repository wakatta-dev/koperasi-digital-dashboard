/** @format */

"use client";

import { CreditCard, Landmark, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { CustomerPaymentMethod } from "@/modules/marketplace/types";

export type CustomerPaymentMethodsProps = Readonly<{
  methods: CustomerPaymentMethod[];
  onAdd?: () => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}>;

const resolveIcon = (type: CustomerPaymentMethod["type"]) => {
  if (type === "bank") return Landmark;
  return CreditCard;
};

export function CustomerPaymentMethods({
  methods,
  onAdd,
  onEdit,
  onDelete,
}: CustomerPaymentMethodsProps) {
  return (
    <div className="surface-card p-6 min-h-[400px]">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Metode Pembayaran Tersimpan
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Kelola opsi pembayaran untuk mempercepat proses checkout.
          </p>
        </div>
        <Button
          type="button"
          onClick={onAdd}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-600/50"
        >
          <Plus className="h-4 w-4" />
          Tambah Metode
        </Button>
      </div>
      <div className="space-y-4">
        {methods.map((method) => {
          const Icon = resolveIcon(method.type);
          const iconClass =
            method.type === "bank"
              ? "text-gray-600 dark:text-gray-300"
              : "text-indigo-600 dark:text-indigo-400";
          return (
            <div
              key={method.id}
              className="group relative flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800/50 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center gap-5">
                <div className="w-14 h-10 bg-gray-50 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600 flex items-center justify-center shadow-sm">
                  <Icon className={`h-6 w-6 ${iconClass}`} />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-gray-900 dark:text-white text-base">
                      {method.label}
                    </span>
                    {method.isDefault ? (
                      <Badge
                        variant="outline"
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800"
                      >
                        Default
                      </Badge>
                    ) : null}
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-sm text-gray-500 dark:text-gray-400">
                    <span>{method.masked}</span>
                    {method.expiry ? (
                      <>
                        <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
                        <span>{method.expiry}</span>
                      </>
                    ) : null}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4 sm:mt-0 sm:opacity-0 group-hover:opacity-100 transition-opacity pl-19 sm:pl-0">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => onEdit?.(method.id)}
                  className="px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                >
                  Edit
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => onDelete?.(method.id)}
                  className="px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                >
                  Hapus
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
