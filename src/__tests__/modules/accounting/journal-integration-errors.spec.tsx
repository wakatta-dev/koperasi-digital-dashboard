/** @format */

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  JournalEntriesManagementPage,
  JournalEntryDetailPage,
  JournalNewEntryPage,
} from "@/modules/accounting";
import { AccountingJournalApiError } from "@/services/api/accounting-journal";

const state = vi.hoisted(() => ({
  createEntryMutateAsync: vi.fn(),
  createPeriodLockMutateAsync: vi.fn(),
  reverseEntryMutateAsync: vi.fn(),
  exportEntryPdfMutateAsync: vi.fn(),
  pushMock: vi.fn(),
  replaceMock: vi.fn(),
  toastError: vi.fn(),
  entriesMode: "data" as "data" | "loading" | "empty" | "error",
  entriesError: null as unknown,
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: state.toastError,
    info: vi.fn(),
  },
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: state.pushMock,
    replace: state.replaceMock,
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
  useAccountingJournalEntries: () => {
    if (state.entriesMode === "loading") {
      return { data: undefined, error: null, isPending: true };
    }
    if (state.entriesMode === "error") {
      return { data: undefined, error: state.entriesError, isPending: false };
    }
    if (state.entriesMode === "empty") {
      return {
        data: {
          items: [],
          summary: { draft_entries: 0, posted_entries: 0, locked_period_label: "Oct 2023" },
          pagination: { page: 1, per_page: 5, total_items: 0, total_pages: 0 },
        },
        error: null,
        isPending: false,
      };
    }

    return {
      data: {
        items: [
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
        ],
        summary: { draft_entries: 1, posted_entries: 10, locked_period_label: "Oct 2023" },
        pagination: { page: 1, per_page: 5, total_items: 1, total_pages: 1 },
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
      items: [],
      summary_counters: { created: 0, edited: 0, deleted: 0, posted: 0 },
      pagination: { page: 1, per_page: 5, total_items: 0, total_pages: 0 },
    },
    error: null,
    isPending: false,
  }),
  useAccountingJournalEntryDetail: () => ({
    data: {
      header: {
        journal_number: "JE/2023/0142",
        status: "Posted",
        posted_at: "2026-02-17T10:00:00Z",
        posted_by: "System Admin",
      },
      general_information: {
        reference_number: "JE/2023/0142",
        journal_date: "2026-02-17",
        partner_entity: "PT. Supplier Jaya",
        journal_name: "Vendor Payment",
      },
      line_items: [],
      totals: { debit_amount: 0, credit_amount: 0 },
      integrity_flags: {
        balanced_entry: true,
        immutable_record: true,
        last_modified_label: "Last modified: now",
      },
    },
    error: null,
    isPending: false,
  }),
  useAccountingJournalMutations: () => ({
    createEntry: { isPending: false, mutateAsync: state.createEntryMutateAsync },
    reverseEntry: { isPending: false, mutateAsync: state.reverseEntryMutateAsync },
    exportEntryPdf: { isPending: false, mutateAsync: state.exportEntryPdfMutateAsync },
    createPeriodLock: { isPending: false, mutateAsync: state.createPeriodLockMutateAsync },
  }),
}));

describe("journal integration errors and states", () => {
  beforeEach(() => {
    state.entriesMode = "data";
    state.entriesError = null;
    state.createEntryMutateAsync.mockReset();
    state.createPeriodLockMutateAsync.mockReset();
    state.reverseEntryMutateAsync.mockReset();
    state.exportEntryPdfMutateAsync.mockReset();
    state.pushMock.mockReset();
    state.replaceMock.mockReset();
    state.toastError.mockReset();
  });

  it("shows loading and empty states on journal list", () => {
    state.entriesMode = "loading";
    const loading = render(<JournalEntriesManagementPage />);
    expect(screen.getByText("Loading journal entries...")).toBeTruthy();
    loading.unmount();

    state.entriesMode = "empty";
    render(<JournalEntriesManagementPage />);
    expect(screen.getByText("No journal entries found.")).toBeTruthy();
  });

  it("shows API error state on journal list", () => {
    state.entriesMode = "error";
    state.entriesError = new AccountingJournalApiError({
      message: "journal entries fetch failed",
      statusCode: 500,
    });

    render(<JournalEntriesManagementPage />);
    expect(screen.getByText("journal entries fetch failed")).toBeTruthy();
  });

  it("surfaces 409 conflict errors on post journal", async () => {
    state.createEntryMutateAsync.mockRejectedValueOnce(
      new AccountingJournalApiError({
        message: "duplicate journal number",
        statusCode: 409,
      })
    );

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
      expect(state.createEntryMutateAsync).toHaveBeenCalled();
      expect(state.toastError).toHaveBeenCalledWith("duplicate journal number");
    });
  });

  it("surfaces 412 period lock errors from lock modal", async () => {
    state.createPeriodLockMutateAsync.mockRejectedValueOnce(
      new AccountingJournalApiError({
        message: "period already locked",
        statusCode: 412,
      })
    );

    render(<JournalEntriesManagementPage />);

    fireEvent.click(screen.getByText("Locked Periods"));
    fireEvent.click(screen.getByRole("button", { name: "Lock Period" }));

    await waitFor(() => {
      expect(state.createPeriodLockMutateAsync).toHaveBeenCalled();
      expect(state.toastError).toHaveBeenCalledWith("period already locked");
    });
  });

  it("surfaces 422 validation errors on reverse entry", async () => {
    state.reverseEntryMutateAsync.mockRejectedValueOnce(
      new AccountingJournalApiError({
        message: "unbalanced journal cannot be reversed",
        statusCode: 422,
      })
    );

    render(<JournalEntryDetailPage journalNumber="JE/2023/0142" />);
    fireEvent.click(screen.getByRole("button", { name: "Reverse Entry" }));

    await waitFor(() => {
      expect(state.reverseEntryMutateAsync).toHaveBeenCalled();
      expect(state.toastError).toHaveBeenCalledWith("unbalanced journal cannot be reversed");
    });
  });
});
