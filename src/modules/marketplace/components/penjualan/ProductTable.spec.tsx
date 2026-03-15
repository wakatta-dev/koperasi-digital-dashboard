/** @format */

import { render, screen } from "@testing-library/react";
import { ProductTable } from "./ProductTable";

describe("ProductTable", () => {
  it("shows seller ownership label when available", () => {
    render(
      <ProductTable
        products={[
          {
            id: "1",
            name: "Kopi Desa",
            sku: "KOPI-001",
            category: "Pangan",
            status: "Tersedia",
            marketplaceLabel: "Tayang di marketplace",
            sellerLabel: "Seller #9",
            stockCount: 7,
            price: 15000,
          },
        ]}
      />
    );

    expect(screen.getByText("Seller #9")).toBeTruthy();
  });
});
