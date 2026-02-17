/** @format */

import { fireEvent, render, screen } from "@testing-library/react";

import {
  AccountingSettingsAnalyticBudgetPage,
  AccountingSettingsCoaPage,
  AccountingSettingsCurrenciesPage,
  AccountingSettingsTaxesPage,
} from "@/modules/accounting";

describe("accounting-settings core features", () => {
  it("renders chart of accounts core table", () => {
    render(<AccountingSettingsCoaPage />);

    expect(screen.getByRole("heading", { name: "Chart of Accounts (COA)" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Add New Account" })).toBeTruthy();
    expect(screen.getByRole("columnheader", { name: "Code" })).toBeTruthy();
  });

  it("toggles tax status switch locally", () => {
    render(<AccountingSettingsTaxesPage />);

    const firstSwitch = screen.getAllByRole("switch")[0];
    expect(firstSwitch.getAttribute("data-state")).toBe("checked");

    fireEvent.click(firstSwitch);
    expect(firstSwitch.getAttribute("data-state")).toBe("unchecked");
  });

  it("shows currencies success toast after add action", async () => {
    render(<AccountingSettingsCurrenciesPage />);

    fireEvent.click(screen.getByRole("button", { name: "Add Currency" }));

    expect(await screen.findByText("New currency (GBP) has been added.")).toBeTruthy();
  });

  it("shows analytic budget success toast after create action", async () => {
    render(<AccountingSettingsAnalyticBudgetPage />);

    fireEvent.click(screen.getByRole("button", { name: "Create Budget" }));

    expect(await screen.findByText('Budget "Q4 Sales Kickoff" has been created.')).toBeTruthy();
    expect(screen.getByPlaceholderText("Search budgets...")).toBeTruthy();
  });
});

