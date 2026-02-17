/** @format */

import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { JournalNewEntryPage } from "@/modules/accounting";

const { pushMock } = vi.hoisted(() => ({
  pushMock: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

describe("journal new entry flow", () => {
  beforeEach(() => {
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
    const balancedTotals = screen.getAllByText("Rp 2,000,000");
    expect(balancedTotals.length).toBeGreaterThanOrEqual(2);
    expect(screen.getByRole("button", { name: "Post Journal" }).hasAttribute("disabled")).toBe(
      false
    );

    fireEvent.click(screen.getByRole("button", { name: "Remove line 3" }));
    expect(screen.queryByRole("button", { name: "Remove line 3" })).toBeNull();
  });

  it("redirects to detail route after posting journal", () => {
    render(<JournalNewEntryPage />);

    fireEvent.click(screen.getByRole("button", { name: "Post Journal" }));

    expect(pushMock).toHaveBeenCalledWith("/bumdes/accounting/journal/JE%2F2023%2F0089");
  });

  it("passes active journal context to full audit history", () => {
    render(<JournalNewEntryPage />);

    fireEvent.click(screen.getByRole("button", { name: "View Full History" }));

    expect(pushMock).toHaveBeenCalledWith(
      "/bumdes/accounting/journal/audit-log?journalNumber=JE%2F2023%2F0089"
    );
  });
});
