/** @format */

// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, fireEvent, screen } from "@testing-library/react";
import DashboardPage from "@/app/(mvp)/bumdes/dashboard/page";
import { analyticsFixture } from "./fixtures/analytics";

const mockSetTheme = vi.fn();
vi.mock("next-themes", () => ({
  useTheme: () => ({ theme: "light", setTheme: mockSetTheme }),
}));

vi.mock("@/modules/dashboard/analytics/hooks/use-analytics", () => ({
  useAnalytics: () => ({
    data: analyticsFixture,
    isLoading: false,
    isError: false,
    refetch: vi.fn(),
    isFetching: false,
  }),
  formatKpiValue: vi.fn(),
}));

vi.mock("@/hooks/queries/notifications", () => ({
  useNotificationActions: () => ({
    markRead: { mutate: vi.fn() },
    markAll: { mutate: vi.fn() },
  }),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

describe("BUMDes Dashboard theme integration", () => {
  beforeEach(() => {
    mockSetTheme.mockReset();
  });

  it("invokes theme toggle from dashboard page", () => {
    render(<DashboardPage />);
    const switchEl = screen.getByRole("switch", { name: /toggle dark mode/i });
    fireEvent.click(switchEl);
    expect(mockSetTheme).toHaveBeenCalledWith("dark");
  });
});
