/** @format */

import { fireEvent, render, screen } from "@testing-library/react";

import { AccountingSettingsFeatureDemo } from "@/modules/accounting";

describe("accounting-settings demo", () => {
  it("renders demo wrapper with stitch heading", () => {
    render(<AccountingSettingsFeatureDemo />);

    expect(screen.getAllByRole("heading", { name: "Pengaturan Akuntansi" }).length).toBeGreaterThan(0);
    expect(screen.getAllByText("Konfigurasi modul akuntansi, pajak, mata uang, dan anggaran.").length).toBeGreaterThan(0);
  });

  it("switches between settings views with local state", () => {
    render(<AccountingSettingsFeatureDemo />);

    fireEvent.click(screen.getByRole("button", { name: "Taxes" }));
    expect(screen.getByRole("heading", { name: "Taxes" })).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Currencies" }));
    expect(screen.getByRole("heading", { name: "Currencies" })).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Analytic & Budget" }));
    expect(screen.getByRole("heading", { name: "Analytic & Budget" })).toBeTruthy();
  });
});
