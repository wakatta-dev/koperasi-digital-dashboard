/** @format */

import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AccessAuthorizationSettingsPage } from "./AccessAuthorizationSettingsPage";
import { BusinessOperationsSettingsPage } from "./BusinessOperationsSettingsPage";
import { TenantProfileSettingsPage } from "./TenantProfileSettingsPage";

const mockUseSession = vi.fn();
const mockUsePathname = vi.fn();
const mockUseRouter = vi.fn();
const mockUseSearchParams = vi.fn();
const mockUseSupportProfileSettings = vi.fn();
const mockUseSupportProfileActions = vi.fn();
const mockUseUsers = vi.fn();
const mockUseRoles = vi.fn();
const mockUsePermissionCatalog = vi.fn();
const mockUseRolePermissions = vi.fn();
const mockUseUserActions = vi.fn();
const mockUseRoleActions = vi.fn();
const mockUseSupportOperationalSettings = vi.fn();
const mockUseSupportOperationalActions = vi.fn();
const mockUseSupportSystemReadiness = vi.fn();
const mockUseSupportDiagnostics = vi.fn();
const mockUseSupportPolicyDefinitions = vi.fn();

const replaceMock = vi.fn();
const saveIdentityMutate = vi.fn();
const saveContactDomainMutate = vi.fn();
const removeRoleMutate = vi.fn();

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
  useSupportProfileSettings: () => mockUseSupportProfileSettings(),
  useSupportProfileActions: () => mockUseSupportProfileActions(),
  useUsers: () => mockUseUsers(),
  useRoles: () => mockUseRoles(),
  usePermissionCatalog: () => mockUsePermissionCatalog(),
  useRolePermissions: () => mockUseRolePermissions(),
  useUserActions: () => mockUseUserActions(),
  useRoleActions: () => mockUseRoleActions(),
  useSupportOperationalSettings: () => mockUseSupportOperationalSettings(),
  useSupportOperationalActions: () => mockUseSupportOperationalActions(),
  useSupportSystemReadiness: () => mockUseSupportSystemReadiness(),
  useSupportDiagnostics: () => mockUseSupportDiagnostics(),
  useSupportPolicyDefinitions: () => mockUseSupportPolicyDefinitions(),
}));

describe("tenant-settings pages", () => {
  beforeEach(() => {
    replaceMock.mockReset();
    saveIdentityMutate.mockReset();
    saveContactDomainMutate.mockReset();
    removeRoleMutate.mockReset();

    mockUseSession.mockReset();
    mockUsePathname.mockReset();
    mockUseRouter.mockReset();
    mockUseSearchParams.mockReset();
    mockUseSupportProfileSettings.mockReset();
    mockUseSupportProfileActions.mockReset();
    mockUseUsers.mockReset();
    mockUseRoles.mockReset();
    mockUsePermissionCatalog.mockReset();
    mockUseRolePermissions.mockReset();
    mockUseUserActions.mockReset();
    mockUseRoleActions.mockReset();
    mockUseSupportOperationalSettings.mockReset();
    mockUseSupportOperationalActions.mockReset();
    mockUseSupportSystemReadiness.mockReset();
    mockUseSupportDiagnostics.mockReset();
    mockUseSupportPolicyDefinitions.mockReset();

    mockUseRouter.mockReturnValue({ replace: replaceMock });
    setNavigation("/bumdes/settings/profil-tenant");

    mockUseSession.mockReturnValue({ data: { user: { role: "admin", jenis_tenant: "bumdes" } } });
    mockUseSupportProfileSettings.mockReturnValue({
      data: {
        tenant_id: 1,
        identity: {
          business_name: "Bumdes Maju",
          business_type: "bumdes",
          business_category: "Perdagangan hasil desa",
          description: "Badan Usaha Milik Desa",
          logo_url: "https://cdn.example.com/logo.png",
          updated_at: "2026-03-06T00:00:00Z",
        },
        contact_domain: {
          contact_email: "kontak@bumdesmaju.id",
          contact_phone: "081234567890",
          address: "Jl. Raya Desa No. 123",
          domain: "localhost:3004",
          custom_domain: "bumdesmaju.id",
          updated_at: "2026-03-06T00:00:00Z",
        },
      },
      isLoading: false,
      error: null,
    });
    mockUseSupportProfileActions.mockReturnValue({
      saveIdentity: { isPending: false, mutate: saveIdentityMutate },
      saveContactDomain: { isPending: false, mutate: saveContactDomainMutate },
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
      remove: { isPending: false, mutate: removeRoleMutate },
      addPermission: { isPending: false, mutate: vi.fn() },
      removePermission: { isPending: false, mutate: vi.fn() },
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
    mockUseSupportSystemReadiness.mockReturnValue({
      data: {
        tenant_id: 1,
        status: "missing",
        checked_at: "2026-03-06T00:00:00Z",
        foundation_items: [
          {
            key: "business_name",
            label: "Nama bisnis tenant",
            status: "ready",
          },
        ],
        domains: [
          {
            domain: "marketplace",
            label: "Marketplace",
            status: "missing",
            ready_count: 2,
            missing_count: 1,
            items: [
              {
                key: "inventory_categories",
                label: "Kategori inventory tersedia",
                status: "missing",
                message: "Tambahkan minimal satu kategori inventory agar produk marketplace dapat dikelompokkan.",
              },
            ],
          },
          {
            domain: "rental",
            label: "Rental",
            status: "ready",
            ready_count: 4,
            missing_count: 0,
            items: [],
          },
          {
            domain: "accounting",
            label: "Accounting",
            status: "ready",
            ready_count: 4,
            missing_count: 0,
            items: [],
          },
        ],
        critical_flows: [
          {
            key: "marketplace_public_truth",
            label: "Marketplace Public Checkout",
            domain: "marketplace",
            status: "blocked",
            blocker_count: 2,
            gates: [
              {
                key: "marketplace_dependency",
                label: "Marketplace dependency ready",
                requirement_codes: ["NFR13"],
                evidence_type: "domain-readiness",
                owner: "QA Lead",
                status: "passed",
                blocker: false,
              },
              {
                key: "public_negative_path",
                label: "Negative-path auth/authz",
                requirement_codes: ["FR27", "NFR5", "NFR6"],
                evidence_type: "acceptance-test",
                owner: "Security-aware QA",
                status: "blocker",
                blocker: true,
                message: "Evidence negatif auth/authz untuk flow publik marketplace belum direkam.",
              },
            ],
          },
        ],
      },
      isLoading: false,
      error: null,
    });
    mockUseSupportPolicyDefinitions.mockReturnValue({
      data: {
        tenant_id: 1,
        items: [
          {
            policy_key: "manual_payment_window_hours",
            policy_name: "Manual Payment Window",
            policy_class: "bounded_override",
            default_source: "tenant_type",
            value_type: "integer",
            allowed_scopes: ["platform", "tenant_type", "tenant", "module"],
            validation_rules: { min: 1, max: 48 },
          },
        ],
      },
      isLoading: false,
      error: null,
    });
    mockUseSupportDiagnostics.mockReturnValue({
      data: {
        tenant_id: 1,
        status: "missing",
        state: "blocked",
        checked_at: "2026-03-06T00:00:00Z",
        bootstrap_run: {
          run_id: 91,
          status: "succeeded",
          trigger_type: "provision",
          preset_key: "bumdes-default",
        },
        modules: [
          {
            module_key: "marketplace",
            label: "Marketplace",
            enabled: true,
            status: "missing",
            state: "blocked",
            blocker_reasons: ["Lengkapi output baseline starter:marketplace_categories agar module siap operasional."],
            missing_outputs: ["starter:marketplace_categories"],
            effective_policies: [
              {
                policy_key: "manual_payment_window_hours",
                policy_name: "Manual Payment Window",
                effective_value: 24,
                source_scope: "tenant",
                source_label: "tenant config",
                enforcement_state: "active",
                resolution_chain: [
                  { scope: "platform", label: "platform default", has_value: false, selected: false },
                  { scope: "tenant", label: "tenant config", has_value: true, selected: true, enforcement_state: "active" },
                ],
              },
            ],
          },
        ],
      },
      isLoading: false,
      error: null,
    });
  });

  it("renders profile page in read-only mode and shows local settings navigation", () => {
    mockUseSession.mockReturnValue({ data: { user: { role: "viewer" } } });

    render(<TenantProfileSettingsPage />);

    expect(screen.getByRole("heading", { name: "Profil Tenant" })).toBeTruthy();
    expect(
      screen.getByText(
        "Anda tidak memiliki izin untuk mengedit profil tenant. Hubungi administrator sistem untuk meminta akses."
      )
    ).toBeTruthy();
    expect(screen.getByRole("link", { name: /Operasional Usaha/i })).toBeTruthy();
    expect(
      screen
        .getAllByRole("link", { current: "page" })
        .some((node) => node.getAttribute("href") === "/bumdes/settings/profil-tenant")
    ).toBe(true);
    expect(screen.getByDisplayValue("Bumdes Maju").getAttribute("disabled")).not.toBeNull();
  });

  it("shows dirty state in sticky action bar after profile changes", () => {
    render(<TenantProfileSettingsPage />);

    fireEvent.change(screen.getByLabelText("Nama Usaha"), {
      target: { value: "Bumdes Lebih Maju" },
    });

    expect(screen.getByText("Perubahan belum disimpan.")).toBeTruthy();
  });

  it("renders sticky action bar saving copy with ellipsis", () => {
    mockUseSupportProfileActions.mockReturnValue({
      saveIdentity: { isPending: true, mutate: saveIdentityMutate },
      saveContactDomain: { isPending: false, mutate: saveContactDomainMutate },
    });

    render(<TenantProfileSettingsPage />);

    expect(screen.getAllByText("Menyimpan…").length).toBeGreaterThan(0);
  });

  it("renders access workspace with alias-safe permissions and accessible role buttons", async () => {
    setNavigation("/bumdes/settings/akses-otorisasi", "role=11");

    render(<AccessAuthorizationSettingsPage />);

    expect(screen.getByRole("heading", { name: "Akses & Otorisasi" })).toBeTruthy();
    expect(await screen.findByText("order-list")).toBeTruthy();
    expect(screen.queryByText("/api/orders")).toBeNull();
    expect(screen.getByRole("button", { name: /Manager/i })).toBeTruthy();
    expect(screen.getByText("Role aktif: Manager")).toBeTruthy();
  });

  it("keeps the newly selected role active while the URL query catches up", async () => {
    setNavigation("/bumdes/settings/akses-otorisasi", "role=10");

    render(<AccessAuthorizationSettingsPage />);

    const adminButton = await screen.findByRole("button", { name: /Admin/i });
    const managerButton = screen.getByRole("button", { name: /Manager/i });

    expect(adminButton.getAttribute("aria-pressed")).toBe("true");
    expect(managerButton.getAttribute("aria-pressed")).toBe("false");

    fireEvent.click(managerButton);

    expect(replaceMock).toHaveBeenCalledWith("/bumdes/settings/akses-otorisasi?role=11", {
      scroll: false,
    });
    expect(managerButton.getAttribute("aria-pressed")).toBe("true");
    expect(adminButton.getAttribute("aria-pressed")).toBe("false");
    expect(screen.getByRole("heading", { name: "Manager" })).toBeTruthy();
  });

  it("requires confirmation before deleting a custom role", async () => {
    setNavigation("/bumdes/settings/akses-otorisasi", "role=11");

    render(<AccessAuthorizationSettingsPage />);

    await act(async () => {
      fireEvent.click(await screen.findByRole("button", { name: "Hapus Role" }));
    });

    expect(screen.getByText("Role kustom ini akan dihapus permanen. Pastikan tidak ada workflow penting yang masih bergantung padanya.")).toBeTruthy();

    const dialog = screen.getByRole("dialog");
    await act(async () => {
      fireEvent.click(within(dialog).getAllByRole("button")[1]);
    });

    expect(removeRoleMutate).toHaveBeenCalledWith(11);
  });

  it("renders operational page section headings from the extracted module", () => {
    setNavigation("/bumdes/settings/operasional-usaha");

    render(<BusinessOperationsSettingsPage />);

    expect(screen.getByRole("heading", { name: "Operasional Usaha" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Kesiapan Sistem" })).toBeTruthy();
    expect(screen.getByText("Flow inti belum siap sepenuhnya")).toBeTruthy();
    expect(screen.getByText("Kategori inventory tersedia")).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Readiness Matrix Flow Kritis" })).toBeTruthy();
    expect(screen.getByText("Marketplace Public Checkout")).toBeTruthy();
    expect(screen.getByText("Negative-path auth/authz")).toBeTruthy();
    expect(screen.getByText("Preferensi Tenant")).toBeTruthy();
    expect(screen.getByText("Aktivasi Modul")).toBeTruthy();
    expect(screen.getByText("Kebijakan Asset & Rental")).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Katalog Policy Canonical" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Readiness & Diagnostics" })).toBeTruthy();
    expect(screen.getByText("Manual Payment Window")).toBeTruthy();
    expect(screen.getByText("Output baseline yang belum terbukti")).toBeTruthy();
  });

  it("renders readiness success state when all dependencies are complete", () => {
    setNavigation("/bumdes/settings/operasional-usaha");
    mockUseSupportSystemReadiness.mockReturnValue({
      data: {
        tenant_id: 1,
        status: "ready",
        checked_at: "2026-03-06T00:00:00Z",
        foundation_items: [
          {
            key: "business_name",
            label: "Nama bisnis tenant",
            status: "ready",
          },
        ],
        domains: [
          {
            domain: "marketplace",
            label: "Marketplace",
            status: "ready",
            ready_count: 4,
            missing_count: 0,
            items: [],
          },
          {
            domain: "rental",
            label: "Rental",
            status: "ready",
            ready_count: 5,
            missing_count: 0,
            items: [],
          },
          {
            domain: "accounting",
            label: "Accounting",
            status: "ready",
            ready_count: 4,
            missing_count: 0,
            items: [],
          },
        ],
        critical_flows: [
          {
            key: "marketplace_public_truth",
            label: "Marketplace Public Checkout",
            domain: "marketplace",
            status: "ready",
            blocker_count: 0,
            gates: [
              {
                key: "marketplace_dependency",
                label: "Marketplace dependency ready",
                requirement_codes: ["NFR13"],
                evidence_type: "domain-readiness",
                owner: "QA Lead",
                status: "passed",
                blocker: false,
              },
            ],
          },
        ],
      },
      isLoading: false,
      error: null,
    });

    render(<BusinessOperationsSettingsPage />);

    expect(screen.getByText("Semua dependency inti sudah siap")).toBeTruthy();
  });

  it("keeps blocker alert visible when domains are ready but critical flow evidence is still blocked", () => {
    setNavigation("/bumdes/settings/operasional-usaha");
    mockUseSupportSystemReadiness.mockReturnValue({
      data: {
        tenant_id: 1,
        status: "missing",
        checked_at: "2026-03-06T00:00:00Z",
        foundation_items: [
          {
            key: "business_name",
            label: "Nama bisnis tenant",
            status: "ready",
          },
        ],
        domains: [
          {
            domain: "marketplace",
            label: "Marketplace",
            status: "ready",
            ready_count: 4,
            missing_count: 0,
            items: [],
          },
          {
            domain: "rental",
            label: "Rental",
            status: "ready",
            ready_count: 5,
            missing_count: 0,
            items: [],
          },
          {
            domain: "accounting",
            label: "Accounting",
            status: "ready",
            ready_count: 4,
            missing_count: 0,
            items: [],
          },
        ],
        critical_flows: [
          {
            key: "accounting_handoff_minimum",
            label: "Accounting Handoff Minimum",
            domain: "accounting",
            status: "blocked",
            blocker_count: 1,
            gates: [
              {
                key: "period_lock_coa",
                label: "Period lock dan COA mapping failure",
                requirement_codes: ["FR21", "NFR9", "NFR10"],
                evidence_type: "integration-test",
                owner: "Finance QA Reviewer",
                status: "blocker",
                blocker: true,
                message: "Evidence period lock dan missing COA mapping belum tersedia.",
              },
            ],
          },
        ],
      },
      isLoading: false,
      error: null,
    });

    render(<BusinessOperationsSettingsPage />);

    expect(screen.getByText("Flow inti belum siap sepenuhnya")).toBeTruthy();
    expect(screen.getByText("Accounting Handoff Minimum")).toBeTruthy();
  });
});
