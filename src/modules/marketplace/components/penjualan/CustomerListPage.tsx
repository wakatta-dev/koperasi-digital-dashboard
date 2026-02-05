/** @format */

"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CustomerListToolbar } from "./CustomerListToolbar";
import { CustomerTable } from "./CustomerTable";
import { CustomerPagination } from "./CustomerPagination";
import { CustomerFilterSheet } from "./CustomerFilterSheet";
import { CustomerCreateModal } from "./CustomerCreateModal";
import { MOCK_CUSTOMERS } from "@/modules/marketplace/data/penjualan-mock";

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
  const [searchValue, setSearchValue] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [statusValue, setStatusValue] = useState("Active");
  const [minOrders, setMinOrders] = useState("");
  const [maxOrders, setMaxOrders] = useState("");
  const [appliedStatus, setAppliedStatus] = useState("");
  const [appliedMinOrders, setAppliedMinOrders] = useState("");
  const [appliedMaxOrders, setAppliedMaxOrders] = useState("");
  const [page, setPage] = useState(1);

  const filteredCustomers = useMemo(() => {
    const keyword = searchValue.trim().toLowerCase();
    return MOCK_CUSTOMERS.filter((customer) => {
      const matchesKeyword = !keyword
        ? true
        : [customer.name, customer.email, customer.phone]
            .join(" ")
            .toLowerCase()
            .includes(keyword);

      const matchesStatus = appliedStatus ? customer.status === appliedStatus : true;

      const min = Number(appliedMinOrders || 0);
      const max = Number(appliedMaxOrders || 0);
      const matchesMin = Number.isNaN(min) ? true : customer.totalOrders >= min;
      const matchesMax = Number.isNaN(max) || max === 0 ? true : customer.totalOrders <= max;

      return matchesKeyword && matchesStatus && matchesMin && matchesMax;
    });
  }, [searchValue, appliedStatus, appliedMinOrders, appliedMaxOrders]);

  const total = filteredCustomers.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const paginatedCustomers = filteredCustomers.slice(start, start + PAGE_SIZE);

  const handleExport = () => {
    const rows: string[][] = [
      ["Nama Pelanggan", "Email", "Nomor Telepon", "Total Pesanan", "Total Belanja", "Status"],
      ...filteredCustomers.map((customer) => [
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
    setAppliedStatus(statusValue);
    setAppliedMinOrders(minOrders);
    setAppliedMaxOrders(maxOrders);
    setFilterOpen(false);
    setPage(1);
  };

  const handleResetFilters = () => {
    setStatusValue("Active");
    setMinOrders("");
    setMaxOrders("");
    setAppliedStatus("");
    setAppliedMinOrders("");
    setAppliedMaxOrders("");
    setPage(1);
  };

  const from = total === 0 ? 0 : start + 1;
  const to = Math.min(start + PAGE_SIZE, total);

  return (
    <div className="space-y-6">
      <CustomerListToolbar
        searchValue={searchValue}
        onSearchChange={(value) => {
          setSearchValue(value);
          setPage(1);
        }}
        onOpenFilter={() => setFilterOpen(true)}
        onExport={handleExport}
        onAddCustomer={() => setCreateOpen(true)}
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
      />

      <CustomerPagination
        page={page}
        totalPages={totalPages}
        from={from}
        to={to}
        total={total}
        onPageChange={setPage}
      />

      <CustomerFilterSheet
        open={filterOpen}
        onOpenChange={setFilterOpen}
        statusValue={statusValue}
        onStatusChange={setStatusValue}
        minOrders={minOrders}
        maxOrders={maxOrders}
        onMinOrdersChange={setMinOrders}
        onMaxOrdersChange={setMaxOrders}
        onReset={handleResetFilters}
        onApply={handleApplyFilters}
      />

      <CustomerCreateModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCancel={() => setCreateOpen(false)}
      />
    </div>
  );
}
