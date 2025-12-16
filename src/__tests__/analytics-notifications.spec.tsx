/** @format */

// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { NotificationsPanel } from "@/modules/dashboard/analytics/components/notifications";
import { analyticsFixture } from "./fixtures/analytics";

const markRead = { mutate: vi.fn() };
const markAll = { mutate: vi.fn() };

vi.mock("@/hooks/queries/notifications", () => ({
  useNotificationActions: () => ({ markRead, markAll }),
}));

describe("NotificationsPanel", () => {
  it("renders notifications and calls markRead", () => {
    render(<NotificationsPanel notifications={analyticsFixture.notifications} />);
    expect(screen.getByText("Notifikasi")).toBeTruthy();
    const button = screen.getByLabelText(/Tandai selesai/i);
    fireEvent.click(button);
    expect(markRead.mutate).toHaveBeenCalled();
  });

  it("calls markAll when clicking all button", () => {
    render(<NotificationsPanel notifications={analyticsFixture.notifications} />);
    fireEvent.click(screen.getByText(/Tandai semua/i));
    expect(markAll.mutate).toHaveBeenCalled();
  });
});
