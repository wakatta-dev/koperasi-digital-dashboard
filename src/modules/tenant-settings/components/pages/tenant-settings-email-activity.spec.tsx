/** @format */

import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ActivityLogSettingsPage } from "./ActivityLogSettingsPage";
import { EmailCommunicationSettingsPage } from "./EmailCommunicationSettingsPage";

const mockUseSession = vi.fn();
const mockUsePathname = vi.fn();
const mockUseRouter = vi.fn();
const mockUseSearchParams = vi.fn();
const mockUseSupportEmailTemplates = vi.fn();
const mockUseSupportEmailActions = vi.fn();
const mockUseSupportActivityLogs = vi.fn();

const replaceMock = vi.fn();

function setNavigation(pathname: string, query = "") {
  mockUsePathname.mockReturnValue(pathname);
  mockUseSearchParams.mockReturnValue(new URLSearchParams(query));
}

vi.mock("next-auth/react", () => ({
  useSession: () => mockUseSession(),
}));

vi.mock("next/navigation", () => ({
  usePathname: () => mockUsePathname(),
  useRouter: () => mockUseRouter(),
  useSearchParams: () => mockUseSearchParams(),
}));

vi.mock("@/hooks/queries", () => ({
  useSupportEmailTemplates: () => mockUseSupportEmailTemplates(),
  useSupportEmailActions: () => mockUseSupportEmailActions(),
  useSupportActivityLogs: () => mockUseSupportActivityLogs(),
}));

describe("tenant-settings email and activity pages", () => {
  beforeEach(() => {
    replaceMock.mockReset();
    mockUseSession.mockReset();
    mockUsePathname.mockReset();
    mockUseRouter.mockReset();
    mockUseSearchParams.mockReset();
    mockUseSupportEmailTemplates.mockReset();
    mockUseSupportEmailActions.mockReset();
    mockUseSupportActivityLogs.mockReset();

    mockUseRouter.mockReturnValue({ replace: replaceMock });
    mockUseSession.mockReturnValue({ data: { user: { role: "admin" } } });

    setNavigation("/bumdes/settings/komunikasi-email");
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
        {
          id: 2,
          code: "payment_reminder",
          name: "Reminder Pembayaran",
          category: "transactional",
          subject: "Tagihan {{invoice_number}} jatuh tempo",
          body: "Halo {{customer_name}}",
          placeholders: ["invoice_number", "customer_name"],
          version: 2,
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

  it("reads selected email template from query params", () => {
    setNavigation("/bumdes/settings/komunikasi-email", "template=2");

    render(<EmailCommunicationSettingsPage />);

    expect(screen.getByText("Pilih Template")).toBeTruthy();
    expect(
      screen.getByRole("combobox", { name: "Template Aktif" }).textContent
    ).toContain("Reminder Pembayaran");
    expect(screen.getByLabelText("{{invoice_number}}")).toBeTruthy();
  });

  it("renders email page with dynamic placeholder inputs for test send", () => {
    render(<EmailCommunicationSettingsPage />);

    expect(screen.getAllByText("{{name}}").length).toBeGreaterThan(0);
    expect(screen.getAllByText("{{tenant_name}}").length).toBeGreaterThan(0);
    expect(screen.getByLabelText("{{name}}")).toBeTruthy();
    expect(screen.queryByDisplayValue("Admin BUMDes")).toBeNull();
  });

  it("initializes activity log filters from query params and resets them", () => {
    setNavigation(
      "/bumdes/settings/activity-log",
      "module=access&action=create_user&actorId=user%3A12&fromDate=2026-03-01&toDate=2026-03-10&cursor=next-2"
    );

    render(<ActivityLogSettingsPage />);

    expect(screen.getByDisplayValue("user:12")).toBeTruthy();
    expect(screen.getByDisplayValue("2026-03-01")).toBeTruthy();
    expect(screen.getByDisplayValue("2026-03-10")).toBeTruthy();
    expect(screen.getByText("Modul: access")).toBeTruthy();
    expect(screen.getByText("Action: create_user")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Reset Filter" }));

    expect(replaceMock).toHaveBeenCalledWith("/bumdes/settings/activity-log", {
      scroll: false,
    });
  });

  it("renders activity log rows and pagination action", () => {
    setNavigation("/bumdes/settings/activity-log");

    render(<ActivityLogSettingsPage />);

    expect(screen.getByText("Filter Aktivitas")).toBeTruthy();
    expect(screen.getByText("update_tenant_config")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Muat Berikutnya" })).toBeTruthy();
  });
});
