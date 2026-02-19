/** @format */

// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import { DateRangeField } from "@/components/shared/inputs/date-range-field";
import { SelectField } from "@/components/shared/inputs/select-field";
import { FilterToolbar } from "@/components/shared/filters/FilterToolbar";
import {
  SummaryMetricsGrid,
  type SummaryMetricItem,
} from "@/components/shared/data-display/SummaryMetricsGrid";
import {
  PaginatedTableShell,
} from "@/components/shared/data-display/PaginatedTableShell";

describe("shared accounting primitives", () => {
  it("renders select field with label and error state", () => {
    render(
      <SelectField
        id="branch"
        label="Cabang"
        options={[
          { value: "all", label: "Semua Cabang" },
          { value: "main", label: "Cabang Utama" },
        ]}
        errorText="Cabang wajib dipilih"
      />
    );

    expect(screen.getByText("Cabang")).toBeTruthy();
    expect(screen.getByRole("combobox").getAttribute("aria-invalid")).toBe("true");
    expect(screen.getByText("Cabang wajib dipilih")).toBeTruthy();
  });

  it("updates date range values through callback", () => {
    const onValueChange = vi.fn();
    render(
      <DateRangeField
        label="Periode"
        value={{ start: "2026-01-01", end: "2026-01-31" }}
        onValueChange={onValueChange}
      />
    );

    const startDateInput = screen.getByLabelText("Periode");
    fireEvent.change(startDateInput, { target: { value: "2026-02-01" } });

    expect(onValueChange).toHaveBeenCalledWith({
      start: "2026-02-01",
      end: "2026-01-31",
    });
  });

  it("renders filter toolbar and propagates query changes", () => {
    const onQueryChange = vi.fn();
    render(
      <FilterToolbar
        query=""
        onQueryChange={onQueryChange}
        endSlot={<button type="button">Reset</button>}
      />
    );

    const input = screen.getByLabelText("Filter pencarian");
    fireEvent.change(input, { target: { value: "INV-2026" } });

    expect(onQueryChange).toHaveBeenCalledWith("INV-2026");
    expect(screen.getByRole("button", { name: "Reset" })).toBeTruthy();
  });

  it("renders summary metrics grid labels", () => {
    const metrics: SummaryMetricItem[] = [
      { id: "open-invoices", label: "Invoice Terbuka", displayValue: "12" },
      { id: "overdue", label: "Jatuh Tempo", displayValue: "3" },
    ];

    render(<SummaryMetricsGrid metrics={metrics} />);

    expect(screen.getByText("Invoice Terbuka")).toBeTruthy();
    expect(screen.getByText("Jatuh Tempo")).toBeTruthy();
  });

  it("renders paginated table shell with pagination controls", () => {
    render(
      <PaginatedTableShell
        columns={[
          {
            id: "code",
            header: "Kode",
            render: (row: { code: string }) => row.code,
          },
        ]}
        rows={[{ code: "INV-0001" }]}
        getRowKey={(row) => row.code}
        pagination={{ page: 1, pageSize: 10, totalItems: 1, totalPages: 1 }}
      />
    );

    expect(screen.getByText("INV-0001")).toBeTruthy();
    expect(screen.getByText(/Halaman 1 dari 1/i)).toBeTruthy();
    expect(screen.getByRole("button", { name: "Sebelumnya" }).getAttribute("disabled")).not.toBeNull();
    expect(screen.getByRole("button", { name: "Berikutnya" }).getAttribute("disabled")).not.toBeNull();
  });
});
