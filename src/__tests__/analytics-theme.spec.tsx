/** @format */

// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, fireEvent, screen } from "@testing-library/react";
import { SiteHeader } from "@/components/shared/site-header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { LanguageProvider } from "@/contexts/language-context";

const mockSetTheme = vi.fn();
vi.mock("next-themes", () => ({
  useTheme: () => ({ theme: "light", setTheme: mockSetTheme }),
}));

describe("BUMDes Dashboard theme integration", () => {
  beforeEach(() => {
    mockSetTheme.mockReset();
  });

  it("invokes theme toggle from dashboard page", () => {
    render(
      <LanguageProvider>
        <SidebarProvider>
          <SiteHeader />
        </SidebarProvider>
      </LanguageProvider>
    );
    const switchEl = screen.getByRole("switch", { name: /toggle dark mode/i });
    fireEvent.click(switchEl);
    expect(mockSetTheme).toHaveBeenCalledWith("dark");
  });
});
