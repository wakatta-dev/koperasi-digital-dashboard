/** @format */

"use client";

import { Clock, CreditCard, Receipt } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ReactNode } from "react";

export type CustomerTabsProps = Readonly<{
  value: string;
  onValueChange: (value: string) => void;
  children: ReactNode;
}>;

export function CustomerTabs({ value, onValueChange, children }: CustomerTabsProps) {
  return (
    <Tabs value={value} onValueChange={onValueChange}>
      <TabsList className="border-b border-gray-200 dark:border-gray-700 -mb-px flex space-x-8 bg-transparent p-0 h-auto">
        <TabsTrigger
          value="orders"
          className="border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 font-medium text-sm flex items-center gap-2 data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600"
        >
          <Receipt className="h-4 w-4" />
          Riwayat Pesanan
        </TabsTrigger>
        <TabsTrigger
          value="activity"
          className="border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 font-medium text-sm flex items-center gap-2 data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600"
        >
          <Clock className="h-4 w-4" />
          Aktivitas
        </TabsTrigger>
        <TabsTrigger
          value="payment"
          className="border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 font-medium text-sm flex items-center gap-2 data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600"
        >
          <CreditCard className="h-4 w-4" />
          Metode Pembayaran
        </TabsTrigger>
      </TabsList>
      {children}
    </Tabs>
  );
}
