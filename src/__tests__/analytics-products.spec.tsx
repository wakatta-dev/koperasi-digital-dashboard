/** @format */

// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TopProductsTable } from "@/modules/dashboard/analytics/components/top-products";
import { analyticsFixture } from "./fixtures/analytics";

describe("TopProductsTable", () => {
  it("renders products sorted by units sold", () => {
    render(<TopProductsTable products={analyticsFixture.top_products} />);
    const rows = screen.getAllByRole("row");
    expect(rows.length).toBeGreaterThan(1);
    const firstRow = rows[1];
    expect(firstRow.textContent || "").toContain("Produk A");
  });

  it("shows empty state when no products", () => {
    render(<TopProductsTable products={[]} />);
    expect(screen.getByText(/Belum ada data/i)).toBeTruthy();
  });
});
