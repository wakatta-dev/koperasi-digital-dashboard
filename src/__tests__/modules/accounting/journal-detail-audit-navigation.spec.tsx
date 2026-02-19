/** @format */

import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  JournalAuditLogPage,
  JournalEntriesManagementPage,
  JournalEntryDetailPage,
} from "@/modules/accounting";

let mockSearchQuery = "sort=journal_date.desc&page=1&per_page=5";

const { pushMock, replaceMock } = vi.hoisted(() => ({
  pushMock: vi.fn(),
  replaceMock: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
    replace: replaceMock,
  }),
  usePathname: () => "/bumdes/accounting/journal",
  useSearchParams: () => new URLSearchParams(mockSearchQuery),
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
    ];
    const keyword = (params?.q ?? "").toLowerCase();
    const items = source.filter((row) =>
      `${row.journal_number} ${row.partner}`.toLowerCase().includes(keyword)
    );

    return {
      data: {
        items,
        summary: { draft_entries: 1, posted_entries: 10, locked_period_label: "Oct 2023" },
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
  useAccountingJournalEntryDetail: (journalNumber?: string) => ({
    data: {
      header: {
        journal_number: journalNumber ?? "JE/2023/0142",
        status: "Posted",
        posted_at: "2026-02-17T10:00:00Z",
        posted_by: "System Admin",
      },
      general_information: {
        reference_number: journalNumber ?? "JE/2023/0142",
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
  useAccountingJournalAuditLogs: (params?: { journal_number?: string; page?: number; per_page?: number }) => {
    const source = [
      {
        timestamp: "2026-02-17T10:45:00Z",
        user: "Shadcn",
        module: "Journal",
        action: "Posted",
        reference_no: "JE/2023/0142",
        change_details: "Posted journal entry",
      },
      {
        timestamp: "2026-02-17T11:00:00Z",
        user: "System",
        module: "Invoice",
        action: "Created",
        reference_no: "INV/2023/1024",
        change_details: "Created invoice",
      },
    ];

    const filtered = source.filter((row) =>
      params?.journal_number ? row.reference_no === params.journal_number : true
    );

    return {
      data: {
        items: filtered,
        summary_counters: { created: 1, edited: 0, deleted: 0, posted: 1 },
        pagination: {
          page: params?.page ?? 1,
          per_page: params?.per_page ?? 5,
          total_items: filtered.length,
          total_pages: 1,
        },
      },
      error: null,
      isPending: false,
    };
  },
  useAccountingJournalMutations: () => ({
    createEntry: { isPending: false, mutateAsync: vi.fn() },
    reverseEntry: { isPending: false, mutateAsync: vi.fn() },
    exportEntryPdf: { isPending: false, mutateAsync: vi.fn() },
    createPeriodLock: { isPending: false, mutateAsync: vi.fn() },
  }),
}));

describe("journal detail and audit navigation", () => {
  beforeEach(() => {
    mockSearchQuery = "sort=journal_date.desc&page=1&per_page=5";
    pushMock.mockReset();
    replaceMock.mockReset();
  });

  it("restores list state in back link from detail page", () => {
    render(
      <JournalEntryDetailPage
        journalNumber="JE/2023/0142"
        returnToQuery="q=vendor&status=posted&sort=journal_date.desc&page=2&per_page=10"
      />
    );

    expect(screen.getByLabelText("Back to journal list").getAttribute("href")).toBe(
      "/bumdes/accounting/journal?q=vendor&status=posted&sort=journal_date.desc&page=2&per_page=10"
    );
  });

  it("forces audit back action to return to journal list", () => {
    render(<JournalAuditLogPage journalNumber="JE/2023/0142" />);

    fireEvent.click(screen.getByRole("button", { name: "Kembali ke Journal" }));
    expect(pushMock).toHaveBeenCalledWith("/bumdes/accounting/journal");
  });

  it("applies pre-filter context for audit log when journal number is provided", () => {
    render(<JournalAuditLogPage journalNumber="JE/2023/0142" />);

    expect(screen.getAllByText("JE/2023/0142").length).toBeGreaterThan(0);
    expect(screen.queryByText("INV/2023/1024")).toBeNull();
  });

  it("forwards list query state when opening detail from list page", () => {
    mockSearchQuery = "q=supplier&status=posted&sort=journal_date.desc&page=2&per_page=10";
    render(<JournalEntriesManagementPage />);

    fireEvent.click(screen.getByRole("button", { name: "JE/2023/0142" }));

    expect(pushMock).toHaveBeenCalledWith(
      "/bumdes/accounting/journal/JE%2F2023%2F0142?from=q%3Dsupplier%26status%3Dposted%26sort%3Djournal_date.desc%26page%3D2%26per_page%3D10"
    );
  });

  it("persists list filter changes into URL query", () => {
    render(<JournalEntriesManagementPage />);

    fireEvent.change(screen.getByPlaceholderText("Search reference, partner, or amount..."), {
      target: { value: "vendor" },
    });

    expect(replaceMock).toHaveBeenCalledWith(
      "/bumdes/accounting/journal?q=vendor&sort=journal_date.desc&page=1&per_page=5",
      { scroll: false }
    );
  });
});
