/** @format */

import type { ComponentType } from "react";
import { Clock3, FileSpreadsheet, IdCard, Receipt, TrendingUp } from "lucide-react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import type { TaxTabKey } from "../../types/tax";

type FeatureTaxTabNavigationProps = {
  value: TaxTabKey;
  onChange?: (next: TaxTabKey) => void;
};

const TAB_ITEMS: ReadonlyArray<{ key: TaxTabKey; label: string; icon: ComponentType<{ className?: string }> }> = [
  { key: "summary", label: "Summary & Period", icon: TrendingUp },
  { key: "ppn-details", label: "PPN (VAT) Details", icon: Receipt },
  { key: "pph-records", label: "PPh Records", icon: IdCard },
  { key: "export-history", label: "Export History", icon: Clock3 },
  { key: "e-faktur-export", label: "e-Faktur Export", icon: FileSpreadsheet },
];

export function FeatureTaxTabNavigation({
  value,
  onChange,
}: FeatureTaxTabNavigationProps) {
  return (
    <Tabs value={value} className="w-full">
      <TabsList className="h-auto w-full justify-start rounded-none border-b border-gray-200 bg-transparent p-0 dark:border-gray-700">
        {TAB_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <TabsTrigger
              key={item.key}
              value={item.key}
              onClick={() => onChange?.(item.key)}
              className="data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 mr-6 h-12 rounded-none border-b-2 border-transparent px-1 py-0 text-sm font-medium text-gray-500 shadow-none hover:text-gray-700 data-[state=active]:shadow-none dark:text-gray-400 dark:hover:text-gray-200"
            >
              <Icon className="mr-2 h-4 w-4" />
              {item.label}
            </TabsTrigger>
          );
        })}
      </TabsList>
    </Tabs>
  );
}
