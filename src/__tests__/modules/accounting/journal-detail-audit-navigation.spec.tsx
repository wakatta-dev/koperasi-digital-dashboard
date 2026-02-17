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
