/** @format */

import { fireEvent, render, screen, within } from "@testing-library/react";

import {
  AccountingSettingsAnalyticBudgetPage,
  AccountingSettingsCoaPage,
  AccountingSettingsCurrenciesPage,
  AccountingSettingsTaxesPage,
} from "@/modules/accounting";

describe("accounting-settings page composition", () => {
  it("opens add coa modal from coa page", async () => {
    render(<AccountingSettingsCoaPage />);

    fireEvent.click(screen.getByRole("button", { name: "Add New Account" }));

    expect(await screen.findByRole("heading", { name: "Tambah Akun Baru" })).toBeTruthy();
  });

  it("opens create and edit tax modals from taxes page interactions", async () => {
    render(<AccountingSettingsTaxesPage />);

    fireEvent.click(screen.getByRole("button", { name: "Create Tax" }));
    expect(await screen.findByRole("heading", { name: "Tambah Pajak Baru" })).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Batal" }));
    expect(screen.getAllByRole("button", { name: "Open tax actions" }).length).toBeGreaterThan(0);
  });

  it("opens add currency modal and shows success toast after submit", async () => {
    render(<AccountingSettingsCurrenciesPage />);

    fireEvent.click(screen.getByRole("button", { name: "Add Currency" }));
    const dialog = await screen.findByRole("dialog", { name: "Add New Currency" });
    fireEvent.click(within(dialog).getByRole("button", { name: "Add Currency" }));

    expect(await screen.findByText("New currency (GBP) has been added.")).toBeTruthy();
  });

  it("opens budget and analytic account modals on analytic & budget page", async () => {
    render(<AccountingSettingsAnalyticBudgetPage />);

    fireEvent.click(screen.getByRole("button", { name: "Create Budget" }));
    expect(await screen.findByRole("heading", { name: "Create New Budget" })).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    fireEvent.click(screen.getByRole("tab", { name: "Analytic Accounts" }));
    fireEvent.click(screen.getByRole("button", { name: "Add Analytic Account" }));

    expect(await screen.findByRole("heading", { name: "Add Analytic Account" })).toBeTruthy();
  });
});
