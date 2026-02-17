/** @format */

import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

import { bumdesNavigation, bumdesTitleMap } from "@/app/(mvp)/bumdes/navigation";
import { resolveBumdesTitle } from "@/app/(mvp)/bumdes/title-resolver";
import {
  ACCOUNTING_JOURNAL_FLOW_ORDER,
  JournalAuditLogPage,
  JournalEntriesManagementPage,
  JournalEntryDetailPage,
  JournalNewEntryPage,
} from "@/modules/accounting";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
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
  useAccountingJournalEntries: () => ({
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
  }),
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
      ],
      pagination: { page: 1, per_page: 200, total_items: 1, total_pages: 1 },
    },
    error: null,
    isPending: false,
  }),
  useAccountingJournalAuditLogs: () => ({
    data: {
      items: [
        {
          timestamp: "2026-02-17T10:45:00Z",
          user: "Shadcn",
          module: "Journal",
          action: "Posted",
          reference_no: "JE/2023/0142",
          change_details: "Posted journal entry",
        },
      ],
      summary_counters: { created: 1, edited: 0, deleted: 0, posted: 1 },
      pagination: { page: 1, per_page: 5, total_items: 1, total_pages: 1 },
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
    createEntry: { isPending: false, mutateAsync: vi.fn() },
    reverseEntry: { isPending: false, mutateAsync: vi.fn() },
    exportEntryPdf: { isPending: false, mutateAsync: vi.fn() },
    createPeriodLock: { isPending: false, mutateAsync: vi.fn() },
  }),
}));

describe("journal foundation", () => {
  it("renders all journal route page containers", () => {
    const list = render(<JournalEntriesManagementPage />);
    expect(screen.getByRole("heading", { name: "Journal Entries" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Audit Log" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "New Journal Entry" })).toBeTruthy();
    list.unmount();

    const create = render(<JournalNewEntryPage />);
    expect(screen.getByRole("heading", { name: "New Journal Entry" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Save Draft" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Post Journal" })).toBeTruthy();
    create.unmount();

    const detail = render(<JournalEntryDetailPage journalNumber="JE/2023/0142" />);
    expect(screen.getByRole("heading", { name: "JE/2023/0142" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Reverse Entry" })).toBeTruthy();
    detail.unmount();

    render(<JournalAuditLogPage journalNumber="JE-2023-0089" />);
    expect(screen.getByRole("heading", { name: "Riwayat Lengkap Audit Log" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Kembali ke Journal" })).toBeTruthy();
  });

  it("keeps accounting journal menu as a single sidebar entry without journal submenu", () => {
    const accountingItem = bumdesNavigation.find((item) => item.name === "Accounting");
    expect(accountingItem).toBeTruthy();
    const journalItem = accountingItem?.items?.find((item) => item.name === "Journal");
    expect(journalItem).toBeTruthy();
    expect(journalItem?.items).toBeUndefined();
  });

  it("registers title map entries for journal child routes", () => {
    expect(bumdesTitleMap["/bumdes/accounting/journal"]).toBe("Accounting - Journal");
    expect(bumdesTitleMap["/bumdes/accounting/journal/new"]).toBe(
      "Accounting - Journal - New Entry"
    );
    expect(bumdesTitleMap["/bumdes/accounting/journal/[journalNumber]"]).toBe(
      "Accounting - Journal - Entry Detail"
    );
    expect(bumdesTitleMap["/bumdes/accounting/journal/audit-log"]).toBe(
      "Accounting - Journal - Audit Log"
    );
  });

  it("resolves dynamic journal detail title fallback from layout", () => {
    expect(resolveBumdesTitle("/bumdes/accounting/journal/JE-2023-0142")).toBe(
      "Accounting - Journal - Entry Detail"
    );
  });

  it("documents the primary journal flow order", () => {
    expect(ACCOUNTING_JOURNAL_FLOW_ORDER).toEqual([
      "Journal List",
      "New Journal",
      "Journal Detail",
      "Audit Log",
    ]);
  });
});
