/** @format */

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { JournalNewEntryPage } from "@/modules/accounting";

const { createEntryMutateAsync, pushMock } = vi.hoisted(() => ({
  createEntryMutateAsync: vi.fn(),
  pushMock: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

vi.mock("@/hooks/queries", () => ({
  useAccountingSettingsCoa: () => ({
    data: {
      items: [
        {
          account_code: "6001",
          account_name: "Office Expenses",
          account_type: "Expense",
          balance: 0,
          level: 1,
          is_active: true,
        },
        {
          account_code: "1001",
          account_name: "Cash on Hand",
          account_type: "Asset",
          balance: 0,
          level: 1,
          is_active: true,
        },
      ],
      pagination: { page: 1, per_page: 200, total_items: 2, total_pages: 1 },
    },
    error: null,
    isPending: false,
  }),
  useAccountingJournalAuditLogs: () => ({
    data: {
      items: [
        {
          timestamp: "2026-02-17T10:45:00Z",
          user: "Admin Staff",
          module: "Journal",
          action: "Edited",
          reference_no: "JE/2023/0089",
          change_details: "Changed amount",
        },
      ],
      summary_counters: { created: 0, edited: 1, deleted: 0, posted: 0 },
      pagination: { page: 1, per_page: 5, total_items: 1, total_pages: 1 },
    },
    error: null,
    isPending: false,
  }),
  useAccountingJournalMutations: () => ({
    createEntry: { isPending: false, mutateAsync: createEntryMutateAsync },
  }),
}));

describe("journal new entry flow", () => {
  beforeEach(() => {
    createEntryMutateAsync.mockReset();
    createEntryMutateAsync.mockResolvedValue({
      journal_number: "JE/2026/0001",
      status: "Posted",
      total_debit_amount: 2000000,
      total_credit_amount: 2000000,
    });
    pushMock.mockReset();
  });

  it("renders manual journal form and inline audit panel", () => {
    render(<JournalNewEntryPage />);

    expect(screen.getByRole("heading", { name: "New Journal Entry" })).toBeTruthy();
    expect(screen.getByLabelText("Reference #")).toBeTruthy();
    expect(screen.getByRole("columnheader", { name: "Account" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Audit Log" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "View Full History" })).toBeTruthy();
  });

  it("supports line interactions and keeps totals consistent", () => {
    render(<JournalNewEntryPage />);

    fireEvent.click(screen.getByRole("button", { name: "Add Line" }));
    expect(screen.getByRole("button", { name: "Remove line 3" })).toBeTruthy();

    fireEvent.change(screen.getByLabelText("Debit line 1"), {
      target: { value: "2000000" },
    });
    expect(screen.getByRole("button", { name: "Post Journal" }).hasAttribute("disabled")).toBe(
      true
    );

    fireEvent.change(screen.getByLabelText("Credit line 2"), {
      target: { value: "2000000" },
    });
    fireEvent.change(screen.getByLabelText("Journal Reference"), {
      target: { value: "Adjustment for Nov Expenses" },
    });
    fireEvent.change(screen.getByLabelText("Date"), {
      target: { value: "2026-02-17" },
    });
    const balancedTotals = screen.getAllByText("Rp 2,000,000");
    expect(balancedTotals.length).toBeGreaterThanOrEqual(2);
    expect(screen.getByRole("button", { name: "Post Journal" }).hasAttribute("disabled")).toBe(
      false
    );

    fireEvent.click(screen.getByRole("button", { name: "Remove line 3" }));
    expect(screen.queryByRole("button", { name: "Remove line 3" })).toBeNull();
  });

  it("redirects to detail route after posting journal", async () => {
    render(<JournalNewEntryPage />);

    fireEvent.change(screen.getByLabelText("Journal Reference"), {
      target: { value: "Adjustment for Nov Expenses" },
    });
    fireEvent.change(screen.getByLabelText("Date"), {
      target: { value: "2026-02-17" },
    });
    fireEvent.change(screen.getByLabelText("Debit line 1"), {
      target: { value: "2000000" },
    });
    fireEvent.change(screen.getByLabelText("Credit line 2"), {
      target: { value: "2000000" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Post Journal" }));

    await waitFor(() => {
      expect(createEntryMutateAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: expect.objectContaining({
            save_mode: "post",
          }),
        })
      );
      expect(pushMock).toHaveBeenCalledWith("/bumdes/accounting/journal/JE%2F2026%2F0001");
    });
  });

  it("passes active journal context to full audit history", () => {
    render(<JournalNewEntryPage />);

    fireEvent.click(screen.getByRole("button", { name: "View Full History" }));

    expect(pushMock).toHaveBeenCalledWith(
      "/bumdes/accounting/journal/audit-log?journalNumber=JE%2F2023%2F0089"
    );
  });
});
