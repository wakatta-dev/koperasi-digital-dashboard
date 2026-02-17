/** @format */

import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { JournalEntriesManagementPage } from "@/modules/accounting";

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
  useSearchParams: () => new URLSearchParams("sort=journal_date.desc&page=1&per_page=5"),
}));

describe("journal list and modal", () => {
  beforeEach(() => {
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
