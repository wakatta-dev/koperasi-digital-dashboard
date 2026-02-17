/** @format */

import { FileText, Send, CircleCheckBig, AlertCircle } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

type SummaryCardItem = {
  title: string;
  amount: string;
  detail: string;
  icon: typeof FileText;
  iconClassName: string;
  hoverClassName: string;
};

const SUMMARY_ITEMS: SummaryCardItem[] = [
  {
    title: "Total Drafts",
    amount: "Rp 45.2M",
    detail: "5 Invoices",
    icon: FileText,
    iconClassName: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
    hoverClassName: "hover:border-gray-300 dark:hover:border-gray-600",
  },
  {
    title: "Total Sent",
    amount: "Rp 128.5M",
    detail: "12 Invoices",
    icon: Send,
    iconClassName: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    hoverClassName: "hover:border-blue-300 dark:hover:border-blue-800",
  },
  {
    title: "Total Paid",
    amount: "Rp 850.0M",
    detail: "This Month",
    icon: CircleCheckBig,
    iconClassName:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
    hoverClassName: "hover:border-emerald-300 dark:hover:border-emerald-800",
  },
  {
    title: "Total Overdue",
    amount: "Rp 32.4M",
    detail: "3 Invoices",
    icon: AlertCircle,
    iconClassName: "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400",
    hoverClassName: "hover:border-red-300 dark:hover:border-red-800",
  },
];

export function FeatureInvoiceSummaryCards() {
  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {SUMMARY_ITEMS.map((item) => {
        const Icon = item.icon;
        return (
          <Card
            key={item.title}
            className={`h-28 border-gray-200 shadow-sm transition-colors dark:border-gray-700 ${item.hoverClassName}`}
          >
            <CardContent className="flex h-full flex-col justify-between p-4">
              <div className="flex items-start justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  {item.title}
                </span>
                <div className={`rounded-md p-1.5 ${item.iconClassName}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <div>
                <span className="block text-xl font-bold text-gray-900 dark:text-white">
                  {item.amount}
                </span>
                <span className="mt-1 block text-[11px] font-medium text-gray-500 dark:text-gray-400">
                  {item.detail}
                </span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </section>
  );
}
