/** @format */

import { render, screen } from "@testing-library/react";

import { bumdesNavigation, bumdesTitleMap } from "@/app/(mvp)/bumdes/navigation";
import {
  TaxEfakturExportPage,
  TaxExportHistoryPage,
  TaxPphRecordsPage,
  TaxPpnDetailsPage,
  TaxSummaryPeriodPage,
} from "@/modules/accounting";

describe("tax foundation", () => {
  it("renders all tax route page containers", () => {
    const summary = render(<TaxSummaryPeriodPage />);
    expect(screen.getByRole("heading", { name: "Tax Management (PPN & PPh)" })).toBeTruthy();
    summary.unmount();

    const ppn = render(<TaxPpnDetailsPage />);
    expect(screen.getByRole("heading", { name: "Detail Transaksi PPN (VAT)" })).toBeTruthy();
    ppn.unmount();

    const pph = render(<TaxPphRecordsPage />);
    expect(screen.getByRole("heading", { name: "Daftar Rekaman PPh (Income Tax)" })).toBeTruthy();
    pph.unmount();

    const history = render(<TaxExportHistoryPage />);
    expect(screen.getByRole("heading", { name: "Tax Management (PPN & PPh)" })).toBeTruthy();
    history.unmount();

    render(<TaxEfakturExportPage />);
    expect(screen.getByRole("heading", { name: "e-Faktur Export & Tax Reports" })).toBeTruthy();
  });

  it("registers tax submenu entries under accounting", () => {
    const accountingItem = bumdesNavigation.find((item) => item.name === "Accounting");
    expect(accountingItem).toBeTruthy();
    const taxItem = accountingItem?.items?.find((item) => item.name === "Tax");
    expect(taxItem).toBeTruthy();
    expect(taxItem?.items).toEqual([
      { name: "Summary & Period", href: "/bumdes/accounting/tax" },
      { name: "PPN Details", href: "/bumdes/accounting/tax/ppn-details" },
      { name: "PPh Records", href: "/bumdes/accounting/tax/pph-records" },
      { name: "Export History", href: "/bumdes/accounting/tax/export-history" },
      { name: "e-Faktur Export", href: "/bumdes/accounting/tax/e-faktur-export" },
    ]);
  });

  it("registers title map entries for tax child routes", () => {
    expect(bumdesTitleMap["/bumdes/accounting/tax"]).toBe("Accounting - Tax");
    expect(bumdesTitleMap["/bumdes/accounting/tax/ppn-details"]).toBe(
      "Accounting - Tax - PPN Details"
    );
    expect(bumdesTitleMap["/bumdes/accounting/tax/pph-records"]).toBe(
      "Accounting - Tax - PPh Records"
    );
    expect(bumdesTitleMap["/bumdes/accounting/tax/export-history"]).toBe(
      "Accounting - Tax - Export History"
    );
    expect(bumdesTitleMap["/bumdes/accounting/tax/e-faktur-export"]).toBe(
      "Accounting - Tax - e-Faktur Export"
    );
  });
});
