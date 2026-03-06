/** @format */

import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ActivityLogSettingsPage } from "./ActivityLogSettingsPage";
import { EmailCommunicationSettingsPage } from "./EmailCommunicationSettingsPage";

const mockUseSession = vi.fn();
const mockUseSupportEmailTemplates = vi.fn();
const mockUseSupportEmailActions = vi.fn();
const mockUseSupportActivityLogs = vi.fn();

vi.mock("next-auth/react", () => ({
  useSession: () => mockUseSession(),
}));

vi.mock("@/hooks/queries", () => ({
  useSupportEmailTemplates: () => mockUseSupportEmailTemplates(),
  useSupportEmailActions: () => mockUseSupportEmailActions(),
  useSupportActivityLogs: () => mockUseSupportActivityLogs(),
}));

describe("tenant-settings email and activity pages", () => {
  beforeEach(() => {
    mockUseSession.mockReset();
    mockUseSupportEmailTemplates.mockReset();
    mockUseSupportEmailActions.mockReset();
    mockUseSupportActivityLogs.mockReset();

    mockUseSession.mockReturnValue({ data: { user: { role: "admin" } } });
    mockUseSupportEmailTemplates.mockReturnValue({
      data: [
        {
          id: 1,
          code: "email_verification",
          name: "Verifikasi Akun",
          category: "system",
          subject: "Verifikasi Akun Anda di {{tenant_name}}",
          body: "Halo {{name}}",
          placeholders: ["name", "tenant_name"],
          version: 1,
          updated_at: "2026-03-06T00:00:00Z",
        },
      ],
      isLoading: false,
      error: null,
    });
    mockUseSupportEmailActions.mockReturnValue({
      saveTemplate: { isPending: false, mutate: vi.fn() },
      sendTestEmail: { isPending: false, mutate: vi.fn() },
    });
    mockUseSupportActivityLogs.mockReturnValue({
      data: {
        data: {
          items: [
            {
              id: 1,
              timestamp: "2026-03-03T23:59:59Z",
              actor_id: 12,
              actor_label: "user:12",
              module: "tenant",
              action: "update_tenant_config",
              entity_type: "tenant",
              entity_id: 1,
              request_id: "req_8f7d6c5b",
            },
          ],
        },
        meta: { pagination: { next_cursor: "next-1" } },
      },
      isFetching: false,
      error: null,
    });
  });

  it("renders email page with dynamic placeholder inputs for test send", () => {
    render(<EmailCommunicationSettingsPage />);

    expect(screen.getByRole("heading", { name: "Komunikasi Email" })).toBeTruthy();
    expect(screen.getAllByText("{{name}}").length).toBeGreaterThan(0);
    expect(screen.getAllByText("{{tenant_name}}").length).toBeGreaterThan(0);
    expect(screen.getByLabelText("{{name}}")).toBeTruthy();
    expect(screen.queryByDisplayValue("Admin BUMDes")).toBeNull();
  });

  it("renders activity log rows and pagination action", () => {
    render(<ActivityLogSettingsPage />);

    expect(screen.getByRole("heading", { name: "Activity Log" })).toBeTruthy();
    expect(screen.getByText("Filter Aktivitas")).toBeTruthy();
    expect(screen.getByText("update_tenant_config")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Muat Berikutnya" })).toBeTruthy();
  });
});
