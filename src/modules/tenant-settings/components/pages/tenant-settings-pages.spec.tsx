/** @format */

import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AccessAuthorizationSettingsPage } from "./AccessAuthorizationSettingsPage";
import { BusinessOperationsSettingsPage } from "./BusinessOperationsSettingsPage";
import { TenantProfileSettingsPage } from "./TenantProfileSettingsPage";

const mockUseSession = vi.fn();
const mockUseSupportProfileSettings = vi.fn();
const mockUseSupportProfileActions = vi.fn();
const mockUseUsers = vi.fn();
const mockUseRoles = vi.fn();
const mockUsePermissionCatalog = vi.fn();
const mockUseRolePermissions = vi.fn();
const mockUseUserActions = vi.fn();
const mockUseRoleActions = vi.fn();
const mockUseSupportEmailTemplates = vi.fn();
const mockUseSupportEmailActions = vi.fn();
const mockUseSupportActivityLogs = vi.fn();
const mockUseSupportOperationalSettings = vi.fn();
const mockUseSupportOperationalActions = vi.fn();

vi.mock("next-auth/react", () => ({
  useSession: () => mockUseSession(),
}));

vi.mock("@/hooks/queries", () => ({
  useSupportProfileSettings: () => mockUseSupportProfileSettings(),
  useSupportProfileActions: () => mockUseSupportProfileActions(),
  useUsers: () => mockUseUsers(),
  useRoles: () => mockUseRoles(),
  usePermissionCatalog: () => mockUsePermissionCatalog(),
  useRolePermissions: () => mockUseRolePermissions(),
  useUserActions: () => mockUseUserActions(),
  useRoleActions: () => mockUseRoleActions(),
  useSupportEmailTemplates: () => mockUseSupportEmailTemplates(),
  useSupportEmailActions: () => mockUseSupportEmailActions(),
  useSupportActivityLogs: () => mockUseSupportActivityLogs(),
  useSupportOperationalSettings: () => mockUseSupportOperationalSettings(),
  useSupportOperationalActions: () => mockUseSupportOperationalActions(),
}));

describe("tenant-settings pages", () => {
  beforeEach(() => {
    mockUseSession.mockReset();
    mockUseSupportProfileSettings.mockReset();
    mockUseSupportProfileActions.mockReset();
    mockUseUsers.mockReset();
    mockUseRoles.mockReset();
    mockUsePermissionCatalog.mockReset();
    mockUseRolePermissions.mockReset();
    mockUseUserActions.mockReset();
    mockUseRoleActions.mockReset();
    mockUseSupportEmailTemplates.mockReset();
    mockUseSupportEmailActions.mockReset();
    mockUseSupportActivityLogs.mockReset();
    mockUseSupportOperationalSettings.mockReset();
    mockUseSupportOperationalActions.mockReset();

    mockUseSession.mockReturnValue({ data: { user: { role: "admin", jenis_tenant: "bumdes" } } });
    mockUseSupportProfileSettings.mockReturnValue({
      data: {
        tenant_id: 1,
        identity: {
          business_name: "Bumdes Maju",
          business_type: "bumdes",
          business_category: "Perdagangan hasil desa",
          description: "Badan Usaha Milik Desa",
          logo_url: "",
          updated_at: "2026-03-06T00:00:00Z",
        },
        contact_domain: {
          contact_email: "kontak@bumdesmaju.id",
          contact_phone: "081234567890",
          address: "Jl. Raya Desa No. 123",
          domain: "localhost:3004",
          custom_domain: "",
          updated_at: "2026-03-06T00:00:00Z",
        },
      },
      isLoading: false,
      error: null,
    });
    mockUseSupportProfileActions.mockReturnValue({
      saveIdentity: { isPending: false, mutate: vi.fn() },
      saveContactDomain: { isPending: false, mutate: vi.fn() },
    });
    mockUseUsers.mockReturnValue({
      data: [
        {
          id: 1,
          tenant_id: 1,
          email: "budi@bumdes.com",
          full_name: "Budi Santoso",
          role: "Admin",
          role_id: 10,
          status: true,
          created_at: "2026-03-06T00:00:00Z",
        },
      ],
      error: null,
    });
    mockUseRoles.mockReturnValue({
      data: [
        {
          id: 10,
          name: "Admin",
          jenis_tenant: "bumdes",
          description: "Akses penuh ke semua fitur reguler.",
          is_protected: true,
          is_editable: false,
          is_deletable: false,
          created_at: "2026-03-06T00:00:00Z",
          updated_at: "2026-03-06T00:00:00Z",
        },
        {
          id: 11,
          name: "Manager",
          jenis_tenant: "bumdes",
          description: "Akses manajerial dan pelaporan tingkat lanjut.",
          is_protected: false,
          is_editable: true,
          is_deletable: true,
          created_at: "2026-03-06T00:00:00Z",
          updated_at: "2026-03-06T00:00:00Z",
        },
      ],
      error: null,
    });
    mockUsePermissionCatalog.mockReturnValue({
      data: [{ alias: "order-list", label: "Order List", description: "Baca daftar order" }],
      error: null,
    });
    mockUseRolePermissions.mockReturnValue({
      data: [{ id: 100, alias: "order-list", label: "Order List", description: "Baca daftar order" }],
      error: null,
    });
    mockUseUserActions.mockReturnValue({
      setPrimaryRole: { isPending: false, mutate: vi.fn() },
      patchStatus: { isPending: false, mutate: vi.fn() },
    });
    mockUseRoleActions.mockReturnValue({
      create: { isPending: false, mutate: vi.fn() },
      update: { isPending: false, mutate: vi.fn() },
      remove: { isPending: false, mutate: vi.fn() },
      addPermission: { isPending: false, mutate: vi.fn() },
      removePermission: { isPending: false, mutate: vi.fn() },
    });
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
      error: null,
      isLoading: false,
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
    mockUseSupportOperationalSettings.mockReturnValue({
      data: {
        tenant_id: 1,
        preferences: {
          timezone: "Asia/Jakarta",
          currency: "IDR",
          locale: "id-ID",
          theme: "default",
          updated_at: "2026-03-06T00:00:00Z",
        },
        modules: {
          feature_flags: {
            asset_rental_enabled: true,
            marketplace_enabled: true,
            inventory_enabled: true,
            reports_enabled: true,
            pos_enabled: false,
          },
          updated_at: "2026-03-06T00:00:00Z",
        },
        asset_rental: {
          approval_required: true,
          default_slot_minutes: 60,
          min_dp_percent: 30,
          grace_period_hours: 2,
          late_fee_per_hour: 50000,
          updated_at: "2026-03-06T00:00:00Z",
        },
        marketplace_accounting: {
          marketplace: {
            manual_payment_window_min: 120,
            auto_cancel_unpaid_hours: 24,
            low_stock_threshold: 5,
            allow_guest_checkout: false,
          },
          accounting: {
            invoice_prefix: "INV",
            fiscal_year_start_month: 1,
            default_payment_terms_days: 15,
            period_lock_after_days: 7,
          },
          updated_at: "2026-03-06T00:00:00Z",
        },
      },
      isLoading: false,
      error: null,
    });
    mockUseSupportOperationalActions.mockReturnValue({
      savePreferences: { isPending: false, mutate: vi.fn() },
      saveModules: { isPending: false, mutate: vi.fn() },
      saveAssetRental: { isPending: false, mutate: vi.fn() },
      saveMarketplaceAccounting: { isPending: false, mutate: vi.fn() },
    });
  });

  it("renders profile page in read-only mode for non-admin roles", () => {
    mockUseSession.mockReturnValue({ data: { user: { role: "viewer" } } });

    render(<TenantProfileSettingsPage />);

    expect(screen.getByRole("heading", { name: "Profil Tenant" })).toBeTruthy();
    expect(
      screen.getByText(
        "Anda tidak memiliki izin untuk mengedit profil tenant. Hubungi administrator sistem untuk meminta akses."
      )
    ).toBeTruthy();
    expect(screen.getByDisplayValue("Bumdes Maju").getAttribute("disabled")).not.toBeNull();
  });

  it("renders access workspace with alias-safe permissions only", async () => {
    render(<AccessAuthorizationSettingsPage />);

    expect(screen.getByRole("heading", { name: "Akses & Otorisasi" })).toBeTruthy();
    expect(await screen.findByText("order-list")).toBeTruthy();
    expect(screen.queryByText("/api/orders")).toBeNull();
    expect(screen.getByText("Sistem Terproteksi")).toBeTruthy();
  });

  it("renders operational page section headings from the extracted module", () => {
    render(<BusinessOperationsSettingsPage />);

    expect(screen.getByRole("heading", { name: "Operasional Usaha" })).toBeTruthy();
    expect(screen.getByText("Preferensi Tenant")).toBeTruthy();
    expect(screen.getByText("Aktivasi Modul")).toBeTruthy();
    expect(screen.getByText("Kebijakan Asset & Rental")).toBeTruthy();
  });
});
