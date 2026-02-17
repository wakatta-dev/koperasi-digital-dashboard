/** @format */

import { render, screen } from "@testing-library/react";

import {
  AccountingSettingsAnalyticBudgetPage,
  AccountingSettingsCoaPage,
  AccountingSettingsCurrenciesPage,
  AccountingSettingsIndexPage,
  AccountingSettingsTaxesPage,
} from "@/modules/accounting";
import { bumdesNavigation, bumdesTitleMap } from "@/app/(mvp)/bumdes/navigation";

describe("accounting-settings foundation", () => {
  it("renders settings hub and child page containers", () => {
    const hub = render(<AccountingSettingsIndexPage />);
    expect(screen.getByRole("heading", { name: "Pengaturan Akuntansi" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Manage Accounts" }).getAttribute("href")).toBe(
      "/bumdes/accounting/settings/chart-of-accounts"
    );
    hub.unmount();

    const coa = render(<AccountingSettingsCoaPage />);
    expect(screen.getByRole("heading", { name: "Chart of Accounts (COA)" })).toBeTruthy();
    coa.unmount();

    const taxes = render(<AccountingSettingsTaxesPage />);
    expect(screen.getByRole("heading", { name: "Taxes" })).toBeTruthy();
    taxes.unmount();

    const currencies = render(<AccountingSettingsCurrenciesPage />);
    expect(screen.getByRole("heading", { name: "Currencies" })).toBeTruthy();
    currencies.unmount();

    render(<AccountingSettingsAnalyticBudgetPage />);
    expect(screen.getByRole("heading", { name: "Analytic & Budget" })).toBeTruthy();
  });

  it("keeps accounting settings submenu flat with four children", () => {
    const accountingItem = bumdesNavigation.find((item) => item.name === "Accounting");
    expect(accountingItem).toBeTruthy();
    const settingsItem = accountingItem?.items?.find((item) => item.name === "Settings");
    expect(settingsItem).toBeTruthy();

    const childLabels = (settingsItem?.items ?? []).map((item) => item.name);
    expect(childLabels).toEqual([
      "Chart of Accounts",
      "Taxes",
      "Currencies",
      "Analytic & Budget",
    ]);
  });

  it("registers title map entries for settings child routes", () => {
    expect(bumdesTitleMap["/bumdes/accounting/settings"]).toBe("Accounting - Settings");
    expect(bumdesTitleMap["/bumdes/accounting/settings/chart-of-accounts"]).toBe(
      "Accounting - Settings - Chart of Accounts"
    );
    expect(bumdesTitleMap["/bumdes/accounting/settings/taxes"]).toBe(
      "Accounting - Settings - Taxes"
    );
    expect(bumdesTitleMap["/bumdes/accounting/settings/currencies"]).toBe(
      "Accounting - Settings - Currencies"
    );
    expect(bumdesTitleMap["/bumdes/accounting/settings/analytic-budgets"]).toBe(
      "Accounting - Settings - Analytic & Budget"
    );
  });
});
