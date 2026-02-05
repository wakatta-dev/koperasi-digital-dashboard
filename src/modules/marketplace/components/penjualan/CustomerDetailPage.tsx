/** @format */

"use client";

import { useMemo, useState } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { CustomerDetailHeader } from "./CustomerDetailHeader";
import { CustomerProfileCard } from "./CustomerProfileCard";
import { CustomerSpendCard } from "./CustomerSpendCard";
import { CustomerOrdersTable } from "./CustomerOrdersTable";
import { CustomerRecentActivity } from "./CustomerRecentActivity";
import { CustomerActivityTimeline } from "./CustomerActivityTimeline";
import { CustomerPaymentMethods } from "./CustomerPaymentMethods";
import { CustomerTabs } from "./CustomerTabs";
import { useMarketplaceCustomerDetail } from "@/modules/marketplace/hooks/useMarketplaceProducts";
import type {
  CustomerActivity,
  CustomerDetail,
  CustomerOrderSummary,
  CustomerPaymentMethod,
} from "@/modules/marketplace/types";

export type CustomerDetailPageProps = Readonly<{
  id: string;
}>;

const DEFAULT_ADDRESS =
  "Jl. Kebon Jeruk No. 42, RT 05/RW 02, Jakarta Barat, DKI Jakarta 11530";

const formatOrderDate = (timestamp?: number) => {
  if (!timestamp) return "-";
  return new Date(timestamp * 1000).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatActivityTimestamp = (timestamp?: number) => {
  if (!timestamp) return "-";
  return new Date(timestamp * 1000).toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const normalizeOrderStatus = (status?: string): CustomerOrderSummary["status"] => {
  const normalized = (status ?? "").toLowerCase();
  if (normalized.includes("selesai") || normalized.includes("complete")) {
    return "Selesai";
  }
  if (normalized.includes("batal") || normalized.includes("cancel")) {
    return "Dibatalkan";
  }
  return "Pending";
};

const normalizeActivityType = (type?: string): CustomerActivity["type"] => {
  const normalized = (type ?? "").toLowerCase();
  if (
    normalized === "order" ||
    normalized === "support" ||
    normalized === "profile" ||
    normalized === "login"
  ) {
    return normalized as CustomerActivity["type"];
  }
  return "order";
};

const normalizePaymentType = (type?: string): CustomerPaymentMethod["type"] =>
  type === "bank" ? "bank" : "card";

export function CustomerDetailPage({ id }: CustomerDetailPageProps) {
  const [activeTab, setActiveTab] = useState("orders");
  const [orderSearch, setOrderSearch] = useState("");
  const { data, isLoading, isError } = useMarketplaceCustomerDetail(id);

  const detail = useMemo<CustomerDetail | null>(() => {
    if (!data?.customer) return null;
    const customer = data.customer;
    return {
      customer: {
        id: customer.id,
        name: customer.name,
        email: customer.email ?? "-",
        phone: customer.phone ?? "-",
        memberSince: customer.member_since?.trim() ? customer.member_since : "-",
        totalOrders: customer.total_orders,
        totalSpend: customer.total_spend,
        avgSpend: customer.avg_spend,
        status: customer.status === "Inactive" ? "Inactive" : "Active",
        initials: customer.initials ?? "",
      },
      orders: (data.orders ?? []).map((order) => ({
        orderId: order.order_id,
        date: formatOrderDate(order.date),
        status: normalizeOrderStatus(order.status),
        total: order.total,
      })),
      activity: (data.activity ?? []).map((activity) => ({
        id: activity.id,
        title: activity.title,
        timestamp: formatActivityTimestamp(activity.timestamp),
        description: activity.description,
        quote: activity.quote ?? null,
        metadata: activity.metadata ?? null,
        type: normalizeActivityType(activity.type),
      })),
      paymentMethods: (data.payment_methods ?? []).map((method) => ({
        id: method.id,
        type: normalizePaymentType(method.type),
        label: method.label,
        masked: method.masked,
        expiry: method.expiry ?? null,
        isDefault: method.is_default,
      })),
    };
  }, [data]);

  const filteredOrders = useMemo(() => {
    const keyword = orderSearch.trim().toLowerCase();
    const orders = detail?.orders ?? [];
    if (!keyword) return orders;
    return orders.filter((order) => order.orderId.toLowerCase().includes(keyword));
  }, [detail?.orders, orderSearch]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <CustomerDetailHeader onEdit={() => undefined} />
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Memuat detail pelanggan...
        </p>
      </div>
    );
  }

  if (isError || !detail) {
    return (
      <div className="space-y-6">
        <CustomerDetailHeader onEdit={() => undefined} />
        <p className="text-sm text-red-500">Data pelanggan tidak ditemukan.</p>
      </div>
    );
  }

  const recentActivities = detail.activity.slice(0, 3);
  const address = data?.address?.trim() ? data.address : DEFAULT_ADDRESS;

  return (
    <div className="space-y-6">
      <CustomerDetailHeader onEdit={() => undefined} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <CustomerProfileCard customer={detail.customer} address={address} />
          <CustomerSpendCard
            totalSpend={detail.customer.totalSpend}
            totalOrders={detail.customer.totalOrders}
          />
        </div>

        <div className="lg:col-span-2 space-y-6">
          <CustomerTabs value={activeTab} onValueChange={setActiveTab}>
            <TabsContent value="orders" className="space-y-6 mt-6">
              <CustomerOrdersTable
                orders={filteredOrders}
                searchValue={orderSearch}
                onSearchChange={setOrderSearch}
                totalOrders={detail.customer.totalOrders}
              />
              <CustomerRecentActivity activities={recentActivities} />
            </TabsContent>

            <TabsContent value="activity" className="mt-6">
              <CustomerActivityTimeline activities={detail.activity} />
            </TabsContent>

            <TabsContent value="payment" className="mt-6">
              <CustomerPaymentMethods methods={detail.paymentMethods} />
            </TabsContent>
          </CustomerTabs>
        </div>
      </div>
    </div>
  );
}
