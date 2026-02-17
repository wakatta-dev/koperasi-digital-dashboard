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
