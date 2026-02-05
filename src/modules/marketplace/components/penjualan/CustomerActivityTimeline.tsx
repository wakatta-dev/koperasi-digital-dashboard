/** @format */

"use client";

import {
  CheckCircle,
  ChevronDown,
  Filter,
  MapPin,
  MoreVertical,
  ShoppingCart,
  Smartphone,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { CustomerActivity } from "@/modules/marketplace/types";

export type CustomerActivityTimelineProps = Readonly<{
  activities: CustomerActivity[];
}>;

const ACTIVITY_STYLE: Record<
  CustomerActivity["type"],
  { icon: typeof ShoppingCart; bgClass: string; textClass: string }
> = {
  order: {
    icon: ShoppingCart,
    bgClass: "bg-blue-100 dark:bg-blue-900",
    textClass: "text-blue-600 dark:text-blue-300",
  },
  support: {
    icon: CheckCircle,
    bgClass: "bg-green-100 dark:bg-green-900",
    textClass: "text-green-600 dark:text-green-300",
  },
  profile: {
    icon: MapPin,
    bgClass: "bg-orange-100 dark:bg-orange-900",
    textClass: "text-orange-600 dark:text-orange-300",
  },
  login: {
    icon: Smartphone,
    bgClass: "bg-purple-100 dark:bg-purple-900",
    textClass: "text-purple-600 dark:text-purple-300",
  },
};

export function CustomerActivityTimeline({ activities }: CustomerActivityTimelineProps) {
  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 lg:p-8">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Timeline Aktivitas
          </h3>
          <div className="flex gap-2">
            <button
              type="button"
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <Filter className="h-4 w-4" />
              <span className="sr-only">Filter</span>
            </button>
            <button
              type="button"
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">More</span>
            </button>
          </div>
        </div>
      <ol className="relative border-l border-gray-200 dark:border-gray-700 ml-3 space-y-8">
        {activities.map((activity) => {
          const style = ACTIVITY_STYLE[activity.type];
          const Icon = style.icon;
          const metaParts = activity.metadata
            ? activity.metadata.split("->").map((part) => part.trim())
            : [];
          return (
            <li key={activity.id} className="ml-6">
              <span
                className={cn(
                  "absolute flex items-center justify-center w-8 h-8 rounded-full -left-4 ring-8 ring-white dark:ring-surface-dark",
                  style.bgClass
                )}
              >
                <Icon className={cn("h-4 w-4", style.textClass)} />
              </span>
              <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {activity.title}
                  </span>
                  <time className="text-xs text-gray-500 font-medium">
                    {activity.timestamp}
                  </time>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  {activity.description}
                </p>
                {activity.quote ? (
                  <div className="p-3 text-sm italic text-gray-600 bg-gray-50 border border-gray-200 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">
                    "{activity.quote}"
                  </div>
                ) : null}
                {activity.type === "profile" && metaParts.length === 2 ? (
                  <div className="flex flex-wrap gap-2 text-xs items-center mt-3">
                    <span className="px-2.5 py-1.5 bg-gray-100 dark:bg-gray-700 rounded text-gray-500 line-through">
                      {metaParts[0]}
                    </span>
                    <span className="text-gray-400">→</span>
                    <span className="px-2.5 py-1.5 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded border border-green-200 dark:border-green-800">
                      {metaParts[1]}
                    </span>
                  </div>
                ) : null}
                {activity.type !== "profile" && activity.metadata ? (
                  <div className="mt-3 inline-flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 p-2.5 rounded border border-gray-100 dark:border-gray-700">
                    {activity.metadata}
                  </div>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>
      <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700 flex justify-center">
        <button
          type="button"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors flex items-center gap-2"
        >
          Muat lebih banyak
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
