/** @format */

import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { JournalEntriesManagementPage } from "@/modules/accounting";

const { createPeriodLockMutateAsync, pushMock, replaceMock } = vi.hoisted(() => ({
  createPeriodLockMutateAsync: vi.fn(),
  pushMock: vi.fn(),
  replaceMock: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
    replace: replaceMock,
  }),
  usePathname: () => "/bumdes/accounting/journal",
  useSearchParams: () => new URLSearchParams("sort=journal_date.desc&page=1&per_page=5"),
}));

vi.mock("@/hooks/queries", () => ({
  useAccountingJournalOverview: () => ({
    data: {
      cards: [
        { key: "draft_entries", label: "Draft Entries", value: "1", helper_text: "Review needed" },
        { key: "posted_entries", label: "Posted Entries", value: "10", helper_text: "this month" },
        { key: "locked_periods", label: "Locked Periods", value: "Oct 2023", helper_text: "Last closed period" },
      ],
      period_lock: { year: 2023, month: 10, status: "Locked" },
    },
    error: null,
    isPending: false,
  }),
  useAccountingJournalEntries: (params?: { q?: string; page?: number; per_page?: number }) => {
    const source = [
      {
        journal_number: "JE/2023/0142",
        journal_date: "2023-11-14",
        journal_name: "Vendor Payment",
        journal_type: "purchase",
        partner: "PT. Supplier Jaya",
        debit_amount: 15000000,
        credit_amount: 15000000,
        status: "Posted",
      },
      {
        journal_number: "JE/2023/0143",
        journal_date: "2023-11-14",
        journal_name: "Customer Invoice",
        journal_type: "sales",
        partner: "CV. Pelanggan Setia",
        debit_amount: 8250000,
        credit_amount: 8250000,
        status: "Draft",
      },
    ] as const;

    const keyword = (params?.q ?? "").toLowerCase();
    const items = source.filter((row) =>
      `${row.journal_number} ${row.journal_name} ${row.partner}`.toLowerCase().includes(keyword)
    );

    return {
      data: {
        items,
        summary: {
          draft_entries: 1,
          posted_entries: 10,
          locked_period_label: "Oct 2023",
        },
        pagination: {
          page: params?.page ?? 1,
          per_page: params?.per_page ?? 5,
          total_items: items.length,
          total_pages: 1,
        },
      },
      error: null,
      isPending: false,
    };
  },
  useAccountingJournalCurrentPeriodLock: () => ({
    data: { year: 2023, month: 10, status: "Locked" },
    error: null,
    isPending: false,
  }),
  useAccountingJournalMutations: () => ({
    createPeriodLock: { isPending: false, mutateAsync: createPeriodLockMutateAsync },
  }),
}));

describe("journal list and modal", () => {
  beforeEach(() => {
    createPeriodLockMutateAsync.mockReset();
    pushMock.mockReset();
    replaceMock.mockReset();
  });

  it("renders list feature blocks with table baseline", () => {
    render(<JournalEntriesManagementPage />);

    expect(screen.getByRole("heading", { name: "Journal Entries" })).toBeTruthy();
    expect(screen.getByText("Draft Entries")).toBeTruthy();
    expect(screen.getByPlaceholderText("Search reference, partner, or amount...")).toBeTruthy();
    expect(screen.getByRole("columnheader", { name: "Reference" })).toBeTruthy();
    expect(screen.getByText("JE/2023/0142")).toBeTruthy();
  });

  it("opens lock period modal from locked period card and supports cancel", () => {
    render(<JournalEntriesManagementPage />);

    fireEvent.click(screen.getByText("Locked Periods"));
    expect(screen.getByRole("heading", { name: "Lock Accounting Period" })).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(screen.queryByRole("heading", { name: "Lock Accounting Period" })).toBeNull();
  });

  it("filters table rows using search input", () => {
    render(<JournalEntriesManagementPage />);

    fireEvent.change(screen.getByPlaceholderText("Search reference, partner, or amount..."), {
      target: { value: "JE/2023/0142" },
    });

    expect(screen.getByText("JE/2023/0142")).toBeTruthy();
    expect(screen.queryByText("JE/2023/0143")).toBeNull();
  });

  it("routes action bar buttons to journal child pages", () => {
    render(<JournalEntriesManagementPage />);

    fireEvent.click(screen.getByRole("button", { name: "Audit Log" }));
    fireEvent.click(screen.getByRole("button", { name: "New Journal Entry" }));

    expect(pushMock).toHaveBeenCalledWith("/bumdes/accounting/journal/audit-log");
    expect(pushMock).toHaveBeenCalledWith("/bumdes/accounting/journal/new");
  });
});
