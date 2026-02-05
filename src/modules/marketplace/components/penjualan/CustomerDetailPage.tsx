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
import {
  MOCK_CUSTOMER_DETAIL,
  MOCK_CUSTOMER_RECENT_ACTIVITY,
  MOCK_CUSTOMERS,
} from "@/modules/marketplace/data/penjualan-mock";

export type CustomerDetailPageProps = Readonly<{
  id: string;
}>;

const DEFAULT_ADDRESS =
  "Jl. Kebon Jeruk No. 42, RT 05/RW 02, Jakarta Barat, DKI Jakarta 11530";

export function CustomerDetailPage({ id }: CustomerDetailPageProps) {
  const [activeTab, setActiveTab] = useState("orders");
  const [orderSearch, setOrderSearch] = useState("");

  const detail = useMemo(() => {
    const customer = MOCK_CUSTOMERS.find((item) => item.id === id);
    return {
      ...MOCK_CUSTOMER_DETAIL,
      customer: customer ?? MOCK_CUSTOMER_DETAIL.customer,
    };
  }, [id]);

  const filteredOrders = useMemo(() => {
    const keyword = orderSearch.trim().toLowerCase();
    if (!keyword) return detail.orders;
    return detail.orders.filter((order) =>
      order.orderId.toLowerCase().includes(keyword)
    );
  }, [detail.orders, orderSearch]);

  return (
    <div className="space-y-6">
      <CustomerDetailHeader onEdit={() => undefined} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <CustomerProfileCard
            customer={detail.customer}
            address={DEFAULT_ADDRESS}
          />
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
              <CustomerRecentActivity activities={MOCK_CUSTOMER_RECENT_ACTIVITY} />
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
