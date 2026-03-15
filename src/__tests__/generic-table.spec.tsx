/** @format */

// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import type { ColumnDef } from "@tanstack/react-table";

import { GenericTable } from "@/components/shared/data-display/GenericTable";

type SampleRow = {
  id: string;
  code: string;
  amount: string;
};

const sampleColumns: ColumnDef<SampleRow, unknown>[] = [
  {
    accessorKey: "code",
    header: "Kode",
    meta: {
      headerClassName: "tracking-normal",
      cellClassName: "font-medium",
    },
  },
  {
    accessorKey: "amount",
    header: "Total",
    meta: {
      align: "right",
      width: 160,
    },
  },
];

describe("GenericTable", () => {
  it("renders header and cell content from ColumnDef", () => {
    render(
      <GenericTable
        columns={sampleColumns}
        data={[{ id: "1", code: "INV-001", amount: "Rp 15.000" }]}
        getRowId={(row) => row.id}
      />,
    );

    expect(screen.getByText("Kode")).toBeTruthy();
    expect(screen.getByText("INV-001")).toBeTruthy();
    expect(screen.getByText("Rp 15.000")).toBeTruthy();
  });

  it("renders loading and empty states", () => {
    const { rerender } = render(
      <GenericTable
        columns={sampleColumns}
        data={[]}
        loading
        loadingState="Memuat tabel..."
      />,
    );

    expect(screen.getByText("Memuat tabel...")).toBeTruthy();

    rerender(
      <GenericTable
        columns={sampleColumns}
        data={[]}
        emptyState="Belum ada baris."
      />,
    );

    expect(screen.getByText("Belum ada baris.")).toBeTruthy();
  });

  it("renders footer content", () => {
    render(
      <GenericTable
        columns={sampleColumns}
        data={[{ id: "1", code: "INV-001", amount: "Rp 15.000" }]}
        getRowId={(row) => row.id}
        footer={<div>Pagination Footer</div>}
      />,
    );

    expect(screen.getByText("Pagination Footer")).toBeTruthy();
  });

  it("applies column meta alignment and class names", () => {
    render(
      <GenericTable
        columns={sampleColumns}
        data={[{ id: "1", code: "INV-001", amount: "Rp 15.000" }]}
        getRowId={(row) => row.id}
      />,
    );

    const totalHeader = screen.getByText("Total");
    const codeCell = screen.getByText("INV-001");
    const amountCell = screen.getByText("Rp 15.000");

    expect(totalHeader.className).toContain("text-right");
    expect(codeCell.className).toContain("font-medium");
    expect(amountCell.className).toContain("text-right");
  });

  it("supports declarative colSpan and hidden cells through column meta", () => {
    type SummaryRow = {
      id: string;
      code: string;
      amount: string;
      rowType: "item" | "summary";
    };

    const summaryColumns: ColumnDef<SummaryRow, unknown>[] = [
      {
        id: "code",
        header: "Kode",
        cell: ({ row }) =>
          row.original.rowType === "summary" ? "Subtotal" : row.original.code,
        meta: {
          cellProps: ({ row }) =>
            row.original.rowType === "summary" ? { colSpan: 2 } : undefined,
        },
      },
      {
        id: "detail",
        header: "Detail",
        cell: () => "Item",
        meta: {
          cellProps: ({ row }) =>
            row.original.rowType === "summary" ? { hidden: true } : undefined,
        },
      },
      {
        accessorKey: "amount",
        header: "Total",
        meta: {
          align: "right",
        },
      },
    ];

    const summaryRows: SummaryRow[] = [
      { id: "1", code: "INV-001", amount: "Rp 15.000", rowType: "item" },
      {
        id: "summary",
        code: "",
        amount: "Rp 15.000",
        rowType: "summary",
      },
    ];

    render(<GenericTable columns={summaryColumns} data={summaryRows} />);

    expect(screen.getByText("Subtotal")).toBeTruthy();
    expect(
      screen.getByText("Subtotal").closest("td")?.getAttribute("colspan"),
    ).toBe("2");
  });

  it("propagates row click for default body rendering", () => {
    const handleRowClick = vi.fn();

    render(
      <GenericTable
        columns={sampleColumns}
        data={[{ id: "1", code: "INV-001", amount: "Rp 15.000" }]}
        getRowId={(row) => row.id}
        onRowClick={handleRowClick}
      />,
    );

    fireEvent.click(screen.getByText("INV-001"));

    expect(handleRowClick).toHaveBeenCalledWith({
      id: "1",
      code: "INV-001",
      amount: "Rp 15.000",
    });
  });
});
