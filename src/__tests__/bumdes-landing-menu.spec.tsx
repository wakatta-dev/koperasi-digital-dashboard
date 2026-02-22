/** @format */

// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";

vi.mock("next/navigation", () => ({
  usePathname: () => "/bumdes/landing-page",
}));

vi.mock("@/components/shared/protected-route", () => ({
  ProtectedRoute: ({ children, requiredRole }: { children: ReactNode; requiredRole?: string }) => (
    <div data-testid="protected-route" data-required-role={requiredRole}>
      {children}
    </div>
  ),
}));

vi.mock("@/components/shared/dashboard-layout", () => ({
  DashboardLayout: ({ children }: { children: ReactNode }) => (
    <div data-testid="dashboard-layout">{children}</div>
  ),
}));

import BumdesLayout from "@/app/(mvp)/bumdes/layout";
import { bumdesNavigation } from "@/app/(mvp)/bumdes/navigation";

describe("BUMDes Landing Page menu", () => {
  it("uses a single landing page entry without submenu", () => {
    const landingMenu = bumdesNavigation.find(
      (item) => item.name === "Landing Page"
    );

    expect(landingMenu).toBeDefined();
    expect(landingMenu?.href).toBe("/bumdes/landing-page");
    expect(landingMenu?.items).toBeUndefined();
  });

  it("keeps the BUMDes role protection on the layout", () => {
    render(
      <BumdesLayout>
        <div>content</div>
      </BumdesLayout>
    );

    const guard = screen.getByTestId("protected-route");
    expect(guard.getAttribute("data-required-role")).toBe("bumdes");
  });
});
