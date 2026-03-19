/** @format */

"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CustomerListToolbar } from "./CustomerListToolbar";
import { CustomerTable } from "./CustomerTable";
import { CustomerFilterSheet } from "./CustomerFilterSheet";
import { CustomerCreateModal } from "./CustomerCreateModal";
import {
  useMarketplaceCustomerActions,
  useMarketplaceCustomers,
} from "@/modules/marketplace/hooks/useMarketplaceProducts";
import type { CustomerListItem } from "@/modules/marketplace/types";
import { toast } from "sonner";

const DEFAULT_STATUS = "Active";

const PAGE_SIZE = 5;

const downloadCsv = (rows: string[][], filename: string) => {
  const csvContent = rows.map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export function CustomerListPage() {
  const router = useRouter();
  const { createCustomer } = useMarketplaceCustomerActions();
  const [uiState, setUiState] = useState({
    searchValue: "",
    filterOpen: false,
    createOpen: false,
    statusValue: DEFAULT_STATUS,
    minOrders: "",
    maxOrders: "",
    appliedStatus: "",
    appliedMinOrders: "",
    appliedMaxOrders: "",
    page: 1,
  });
  const {
    searchValue,
    filterOpen,
    createOpen,
    statusValue,
    minOrders,
    maxOrders,
    appliedStatus,
    appliedMinOrders,
    appliedMaxOrders,
    page,
  } = uiState;

  const patchUiState = (
    updates: Partial<typeof uiState> | ((current: typeof uiState) => typeof uiState),
  ) => {
    setUiState((current) =>
      typeof updates === "function" ? updates(current) : { ...current, ...updates },
    );
  };

  const minOrdersValue =
    appliedMinOrders.trim() === "" ? undefined : Number(appliedMinOrders);
  const maxOrdersValue =
    appliedMaxOrders.trim() === "" ? undefined : Number(appliedMaxOrders);

  const { data, isLoading, isError } = useMarketplaceCustomers({
    q: searchValue.trim() ? searchValue.trim() : undefined,
    status: appliedStatus ? appliedStatus.toLowerCase() : undefined,
    min_orders:
      minOrdersValue === undefined || Number.isNaN(minOrdersValue)
        ? undefined
        : minOrdersValue,
    max_orders:
      maxOrdersValue === undefined || Number.isNaN(maxOrdersValue)
        ? undefined
        : maxOrdersValue,
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
    sort: "newest",
  });

  const customers: CustomerListItem[] = useMemo(() => {
    const items = data?.items ?? [];
    return items.map((customer) => ({
      id: customer.id,
      name: customer.name,
      email: customer.email ?? "-",
      phone: customer.phone ?? "-",
      memberSince: customer.member_since ?? "-",
      totalOrders: customer.total_orders,
      totalSpend: customer.total_spend,
      avgSpend: customer.avg_spend,
      status: customer.status === "Inactive" ? "Inactive" : "Active",
      initials: customer.initials,
    }));
  }, [data?.items]);

  const total = data?.total ?? customers.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const paginatedCustomers = customers;

  const handleExport = () => {
    const rows: string[][] = [
      ["Nama Pelanggan", "Email", "Nomor Telepon", "Total Pesanan", "Total Belanja", "Status"],
      ...customers.map((customer) => [
        customer.name,
        customer.email,
        customer.phone,
        String(customer.totalOrders),
        String(customer.totalSpend),
        customer.status,
      ]),
    ];
    downloadCsv(rows, "pelanggan-penjualan.csv");
  };

  const handleApplyFilters = () => {
    patchUiState({
      appliedStatus: statusValue,
      appliedMinOrders: minOrders,
      appliedMaxOrders: maxOrders,
      filterOpen: false,
      page: 1,
    });
  };

  const handleResetFilters = () => {
    patchUiState({
      statusValue: DEFAULT_STATUS,
      minOrders: "",
      maxOrders: "",
      appliedStatus: "",
      appliedMinOrders: "",
      appliedMaxOrders: "",
      page: 1,
    });
  };

  const from = total === 0 ? 0 : start + 1;
  const to = Math.min(start + customers.length, total);

  return (
    <div className="space-y-6" data-testid="marketplace-admin-customer-page-root">
      <CustomerListToolbar
        searchValue={searchValue}
        onSearchChange={(value) => {
          patchUiState({ searchValue: value, page: 1 });
        }}
        onOpenFilter={() => patchUiState({ filterOpen: true })}
        onExport={handleExport}
        onAddCustomer={() => patchUiState({ createOpen: true })}
      />

      <CustomerTable
        customers={paginatedCustomers}
        onRowClick={(customer) => router.push(`/bumdes/marketplace/pelanggan/${customer.id}`)}
        getActions={(customer) => [
          {
            label: "Lihat Detail",
            onSelect: () => router.push(`/bumdes/marketplace/pelanggan/${customer.id}`),
          },
        ]}
        pagination={{
          page,
          pageSize: PAGE_SIZE,
          totalItems: total,
          totalPages,
        }}
        paginationInfo={`Menampilkan ${from}-${to} dari ${total} pelanggan`}
        onPageChange={(nextPage) => patchUiState({ page: nextPage })}
      />

      <CustomerFilterSheet
        open={filterOpen}
        onOpenChange={(open) => patchUiState({ filterOpen: open })}
        statusValue={statusValue}
        onStatusChange={(value) => patchUiState({ statusValue: value })}
        minOrders={minOrders}
        maxOrders={maxOrders}
        onMinOrdersChange={(value) => patchUiState({ minOrders: value })}
        onMaxOrdersChange={(value) => patchUiState({ maxOrders: value })}
        onReset={handleResetFilters}
        onApply={handleApplyFilters}
      />

      <CustomerCreateModal
        open={createOpen}
        onOpenChange={(open) => patchUiState({ createOpen: open })}
        onCancel={() => patchUiState({ createOpen: false })}
        onSubmit={async (payload) => {
          const name = payload.name.trim();
          const email = payload.email.trim();
          const phone = payload.phone.trim();

          if (!name) {
            toast.error("Nama pelanggan wajib diisi.");
            throw new Error("Nama pelanggan wajib diisi.");
          }
          if (!email && !phone) {
            toast.error("Minimal email atau nomor telepon wajib diisi.");
            throw new Error("Kontak pelanggan wajib diisi.");
          }

          try {
            await createCustomer.mutateAsync({
              name,
              customer_type: payload.type === "Perusahaan" ? "PERUSAHAAN" : "INDIVIDU",
              email: email || undefined,
              phone: phone || undefined,
              address: payload.address.trim() || undefined,
              npwp: payload.npwp.trim() || undefined,
              status: "ACTIVE",
            });
            toast.success("Pelanggan berhasil ditambahkan.");
          } catch (error: any) {
            const message =
              error?.message || "Gagal menambahkan pelanggan. Periksa data lalu coba lagi.";
            toast.error(message);
            throw error;
          }
        }}
      />

      {isLoading ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">Memuat pelanggan...</p>
      ) : null}
      {isError ? (
        <p className="text-sm text-red-500">Gagal memuat data pelanggan.</p>
      ) : null}
    </div>
  );
}
