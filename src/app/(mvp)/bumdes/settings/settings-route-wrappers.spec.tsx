/** @format */

import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import SettingsIndexPage from "./page";
import SettingsActivityLogPage from "./activity-log/page";
import SettingsAksesOtorisasiPage from "./akses-otorisasi/page";
import SettingsKomunikasiEmailPage from "./komunikasi-email/page";
import SettingsOperasionalUsahaPage from "./operasional-usaha/page";
import SettingsProfilTenantPage from "./profil-tenant/page";

const redirectMock = vi.fn();

vi.mock("next/navigation", () => ({
  redirect: (path: string) => redirectMock(path),
}));

vi.mock("@/modules/tenant-settings", () => ({
  TenantProfileSettingsPage: () => <div>tenant-profile-wrapper</div>,
  BusinessOperationsSettingsPage: () => <div>tenant-operational-wrapper</div>,
  AccessAuthorizationSettingsPage: () => <div>tenant-access-wrapper</div>,
  EmailCommunicationSettingsPage: () => <div>tenant-email-wrapper</div>,
  ActivityLogSettingsPage: () => <div>tenant-activity-wrapper</div>,
}));

describe("settings route wrappers", () => {
  beforeEach(() => {
    redirectMock.mockReset();
  });

  it("keeps the index route redirect-only", () => {
    SettingsIndexPage();
    expect(redirectMock).toHaveBeenCalledWith("/bumdes/settings/profil-tenant");
  });

  it("renders child wrappers from the tenant settings module", () => {
    render(
      <div>
        <SettingsProfilTenantPage />
        <SettingsOperasionalUsahaPage />
        <SettingsAksesOtorisasiPage />
        <SettingsKomunikasiEmailPage />
        <SettingsActivityLogPage />
      </div>
    );

    expect(screen.getByText("tenant-profile-wrapper")).toBeTruthy();
    expect(screen.getByText("tenant-operational-wrapper")).toBeTruthy();
    expect(screen.getByText("tenant-access-wrapper")).toBeTruthy();
    expect(screen.getByText("tenant-email-wrapper")).toBeTruthy();
    expect(screen.getByText("tenant-activity-wrapper")).toBeTruthy();
  });
});
