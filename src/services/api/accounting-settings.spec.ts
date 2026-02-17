/** @format */

import { beforeEach, describe, expect, it, vi } from "vitest";

import type { ApiResponse } from "@/types/api";

const { getMock, postMock, putMock, patchMock, deleteMock } = vi.hoisted(() => ({
  getMock: vi.fn(),
  postMock: vi.fn(),
  putMock: vi.fn(),
  patchMock: vi.fn(),
  deleteMock: vi.fn(),
}));

vi.mock("./base", () => ({
  API_PREFIX: "/api",
  api: {
    get: getMock,
    post: postMock,
    put: putMock,
    patch: patchMock,
    delete: deleteMock,
  },
}));

import {
  AccountingSettingsApiError,
  createAccountingSettingsTax,
  ensureAccountingSettingsSuccess,
  listAccountingSettingsCoa,
  toggleAccountingSettingsAutoRate,
} from "./accounting-settings";

describe("accounting-settings api service", () => {
  beforeEach(() => {
    getMock.mockReset();
    postMock.mockReset();
    putMock.mockReset();
    patchMock.mockReset();
    deleteMock.mockReset();
  });

  it("builds query string for coa list endpoint", async () => {
    getMock.mockResolvedValue({ success: true, data: { items: [], pagination: {} } });

    await listAccountingSettingsCoa({ q: "cash", page: 2, per_page: 25 });

    expect(getMock).toHaveBeenCalledWith("/api/accounting/settings/coa?q=cash&page=2&per_page=25", {
      signal: undefined,
    });
  });

  it("passes idempotency key for create tax endpoint", async () => {
    postMock.mockResolvedValue({ success: true, data: {} });

    await createAccountingSettingsTax(
      {
        tax_name: "PPN 11%",
        tax_type: "Sales",
        rate_percent: 11,
        tax_account_code: "210101",
        is_active: true,
      },
      { idempotencyKey: "idem-tax-1" }
    );

    expect(postMock).toHaveBeenCalledWith(
      "/api/accounting/settings/taxes",
      {
        tax_name: "PPN 11%",
        tax_type: "Sales",
        rate_percent: 11,
        tax_account_code: "210101",
        is_active: true,
      },
      {
        headers: {
          "Idempotency-Key": "idem-tax-1",
        },
      }
    );
  });

  it("calls auto-rate toggle endpoint with patch", async () => {
    patchMock.mockResolvedValue({ success: true, data: {} });

    await toggleAccountingSettingsAutoRate("USD", { auto_rate_update_enabled: true });

    expect(patchMock).toHaveBeenCalledWith("/api/accounting/settings/currencies/USD/auto-rate", {
      auto_rate_update_enabled: true,
    });
  });

  it("throws typed api error when response indicates failure", () => {
    const response: ApiResponse<{ items: unknown[] }> = {
      success: false,
      message: "validation failed",
      data: null as any,
      meta: {
        status_code: 422,
      } as any,
      errors: {
        target_amount: ["must be greater than zero"],
      },
      error: null,
    };

    expect(() => ensureAccountingSettingsSuccess(response)).toThrowError(AccountingSettingsApiError);

    try {
      ensureAccountingSettingsSuccess(response);
    } catch (err) {
      const apiErr = err as AccountingSettingsApiError;
      expect(apiErr.statusCode).toBe(422);
      expect(apiErr.message).toContain("must be greater than zero");
    }
  });
});
