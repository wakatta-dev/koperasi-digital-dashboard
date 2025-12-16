/** @format */

// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { QuickActions } from "@/modules/dashboard/analytics/components/quick-actions";
import { analyticsFixture } from "./fixtures/analytics";

const push = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

describe("QuickActions", () => {
  it("navigates on enabled action click", () => {
    render(<QuickActions actions={analyticsFixture.quick_actions} />);
    fireEvent.click(screen.getByText("Penjualan Baru"));
    expect(push).toHaveBeenCalledWith("/pos/sale");
  });
});
