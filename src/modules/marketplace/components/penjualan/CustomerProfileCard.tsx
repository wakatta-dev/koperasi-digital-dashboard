/** @format */

"use client";

import { Calendar, Mail, MapPin, Phone, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { CustomerListItem } from "@/modules/marketplace/types";
import {
  getCustomerStatusBadgeClass,
  getCustomerStatusDotClass,
} from "@/modules/marketplace/utils/status";

export type CustomerProfileCardProps = Readonly<{
  customer: CustomerListItem;
  address: string;
  accountType?: string;
  membershipLabel?: string;
}>;

export function CustomerProfileCard({
  customer,
  address,
  accountType = "Personal Account",
  membershipLabel = "Gold Member",
}: CustomerProfileCardProps) {
  return (
    <div className="surface-card p-6">
      <div className="flex flex-col items-center text-center">
        <div className="w-24 h-24 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-3xl font-bold mb-4 shadow-sm border-4 border-white dark:border-surface-dark">
          {customer.initials}
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          {customer.name}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">{accountType}</p>
        <div className="mt-4 flex gap-2">
          <Badge
            variant="outline"
            className={cn(
              "inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium",
              getCustomerStatusBadgeClass(customer.status)
            )}
          >
            <span
              className={cn(
                "w-1.5 h-1.5 rounded-full",
                getCustomerStatusDotClass(customer.status)
              )}
            />
            {customer.status}
          </Badge>
          <Badge
            variant="outline"
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
          >
            <Star className="h-3 w-3" />
            {membershipLabel}
          </Badge>
        </div>
      </div>

      <div className="mt-8 border-t border-gray-100 dark:border-gray-700 pt-6 space-y-4">
        <div>
          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide block mb-1">
            Kontak Info
          </label>
          <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300 mb-2">
            <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-400">
              <Mail className="h-4 w-4" />
            </div>
            <span className="break-all">{customer.email}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
            <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-400">
              <Phone className="h-4 w-4" />
            </div>
            <span>{customer.phone}</span>
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide block mb-1">
            Alamat
          </label>
          <div className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300">
            <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-400 flex-shrink-0">
              <MapPin className="h-4 w-4" />
            </div>
            <span className="leading-relaxed">{address}</span>
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide block mb-1">
            Bergabung Sejak
          </label>
          <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
            <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-400">
              <Calendar className="h-4 w-4" />
            </div>
            <span>{customer.memberSince}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
