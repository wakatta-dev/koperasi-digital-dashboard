/** @format */

"use client";

import { Check, Mail, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CustomerActivity } from "@/modules/marketplace/types";

export type CustomerRecentActivityProps = Readonly<{
  activities: CustomerActivity[];
}>;

const ACTIVITY_STYLE: Record<CustomerActivity["type"], { icon: typeof ShoppingCart; iconClass: string; bgClass: string }> = {
  order: {
    icon: ShoppingCart,
    iconClass: "text-blue-600 dark:text-blue-300",
    bgClass: "bg-blue-100 dark:bg-blue-900",
  },
  support: {
    icon: Mail,
    iconClass: "text-gray-600 dark:text-gray-300",
    bgClass: "bg-gray-100 dark:bg-gray-700",
  },
  profile: {
    icon: Check,
    iconClass: "text-green-600 dark:text-green-300",
    bgClass: "bg-green-100 dark:bg-green-900",
  },
  login: {
    icon: Check,
    iconClass: "text-green-600 dark:text-green-300",
    bgClass: "bg-green-100 dark:bg-green-900",
  },
};

export function CustomerRecentActivity({ activities }: CustomerRecentActivityProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold text-gray-900 dark:text-white px-1">
        Aktivitas Terkini
      </h3>
      <div className="surface-card p-6">
        <ol className="relative border-l border-gray-200 dark:border-gray-700 ml-3">
          {activities.map((activity) => {
            const style = ACTIVITY_STYLE[activity.type];
            const Icon = style.icon;
            return (
              <li key={activity.id} className="mb-10 ml-6 last:mb-0">
                <span
                  className={cn(
                    "absolute flex items-center justify-center w-6 h-6 rounded-full -left-3 ring-8 ring-white dark:ring-surface-dark",
                    style.bgClass
                  )}
                >
                  <Icon className={cn("h-3.5 w-3.5", style.iconClass)} />
                </span>
                <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
                  <div className="items-center justify-between mb-3 sm:flex">
                    <time className="mb-1 text-xs font-normal text-gray-400 sm:order-last sm:mb-0">
                      {activity.timestamp}
                    </time>
                    <div className="text-sm font-normal text-gray-500 dark:text-gray-300">
                      {activity.description}
                    </div>
                  </div>
                  {activity.quote ? (
                    <div className="p-3 text-xs italic font-normal text-gray-500 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400">
                      &ldquo;{activity.quote}&rdquo;
                    </div>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
