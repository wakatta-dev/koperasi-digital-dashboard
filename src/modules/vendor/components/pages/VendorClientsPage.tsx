/** @format */

"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCursorStack } from "@/hooks/use-cursor-stack";
import { useAdminTenants } from "@/hooks/queries";
import { VendorPageHeader } from "../VendorPageHeader";
import { VendorTenantTable } from "../VendorTenantTable";

export function VendorClientsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [businessType, setBusinessType] = useState("ALL");
  const cursorPagination = useCursorStack<string>();
  const queryParams = useMemo(
    () => ({
      limit: 20,
      search: search.trim() || undefined,
      status: status === "ALL" ? undefined : status,
      cursor: cursorPagination.currentCursor,
    }),
    [cursorPagination.currentCursor, search, status]
  );

  const tenantsQuery = useAdminTenants(queryParams);
  const items = useMemo(() => {
    const tenantItems = tenantsQuery.data?.data?.items ?? [];
    if (businessType === "ALL") return tenantItems;
    return tenantItems.filter((item) => item.business_type === businessType);
  }, [businessType, tenantsQuery.data?.data?.items]);
  const nextCursor = tenantsQuery.data?.meta?.pagination?.next_cursor;

  return (
    <div className="space-y-6">
      <VendorPageHeader
        title="Clients"
        description="Kelola tenant SaaS dari admin console vendor dengan filter status, tipe bisnis, dan akses ke detail tenant."
      />

      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_220px_220px]">
        <Input
          placeholder="Cari tenant berdasarkan nama, kode, atau email..."
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            cursorPagination.reset();
          }}
        />
        <Select
          value={status}
          onValueChange={(value) => {
            setStatus(value);
            cursorPagination.reset();
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Semua Status</SelectItem>
            <SelectItem value="ACTIVE">Aktif</SelectItem>
            <SelectItem value="DEACTIVATED">Nonaktif</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={businessType}
          onValueChange={(value) => {
            setBusinessType(value);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter jenis tenant" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Semua Jenis</SelectItem>
            <SelectItem value="vendor">Vendor</SelectItem>
            <SelectItem value="koperasi">Koperasi</SelectItem>
            <SelectItem value="bumdes">BUMDes</SelectItem>
            <SelectItem value="umkm">UMKM</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {tenantsQuery.error ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {(tenantsQuery.error as Error).message}
        </div>
      ) : null}

      <VendorTenantTable
        items={items}
        loading={tenantsQuery.isLoading}
        canGoBack={cursorPagination.canGoBack}
        canGoNext={Boolean(nextCursor)}
        onPrevious={cursorPagination.goBack}
        onNext={() => {
          if (!nextCursor) return;
          cursorPagination.goNext(nextCursor);
        }}
      />
    </div>
  );
}
