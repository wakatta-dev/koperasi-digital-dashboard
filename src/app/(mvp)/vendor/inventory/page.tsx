"use client"

import * as React from "react";
import { BookOpenIcon, PlusIcon, SearchIcon, SquarePenIcon, TrashIcon } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { DataTable } from "@/components/shared/data-table";
import Link from "next/link";
import { InventoryItem } from "@/modules/inventory/types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getInventory } from "@/modules/inventory/api";

export default function InventoryPage() {
  const { data: inventoryList, isFetching } = useQuery<InventoryItem[]>({
    queryKey: ['inventory'],
    queryFn: () => getInventory(),
    placeholderData: keepPreviousData,
  })

  const columns = React.useMemo<ColumnDef<InventoryItem>[]>(
    () => [
      {
        accessorFn: (row) => row.product.name,
        header: "Product",
        cell: (info) => info.getValue(),
      },
      {
        accessorFn: (row) => row.sku,
        header: "SKU",
        cell: (info) => info.getValue(),
      },
      {
        accessorFn: (row) => row.stock,
        header: "Stock",
        cell: (info) => info.getValue(),
      },
      {
        accessorFn: (row) => row.product.category,
        header: "Category",
        cell: (info) => info.getValue(),
      },
      {
        accessorFn: (row) => row.price,
        header: "Price",
        cell: (info) => {
          const formatted = new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
          }).format(info.getValue<number>())
          return formatted
        },
      },
      {
        id: 'actions',
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" asChild>
              <Link href={`inventory/${row.original.id}`}>
                <BookOpenIcon />
              </Link>
            </Button>
            <Button variant="default" size="icon">
              <SquarePenIcon />
            </Button>
            <Button variant="destructive" size="icon">
              <TrashIcon />
            </Button>
          </div>
        ),
      },
    ], 
    []
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex-none block w-96">
          <InputGroup className="w-full">
            <InputGroupInput placeholder="Product name or KSU code..." />
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            <InputGroupAddon align="inline-end">
              <InputGroupButton variant="secondary">Search</InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </div>
        <div className="ml-auto">
          <Button variant="default">
            <PlusIcon /> Add Product
          </Button>
        </div>
      </div>
      {!inventoryList || isFetching ? (
        <div>Loading...</div>
      ) : (
        <DataTable columns={columns} data={inventoryList} />
      )}
    </div>
  );
}
