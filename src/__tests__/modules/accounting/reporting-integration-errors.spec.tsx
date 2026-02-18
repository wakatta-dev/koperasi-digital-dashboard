/** @format */

import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  ReportingAccountLedgerPage,
  ReportingGeneralLedgerPage,
  ReportingProfitLossPage,
} from "@/modules/accounting";
import { ensureAccountingReportingSuccess } from "@/services/api/accounting-reporting";

let pathnameMock = "/bumdes/accounting/reporting/profit-loss";
let searchParamsMock = new URLSearchParams();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
  }),
  usePathname: () => pathnameMock,
  useSearchParams: () => searchParamsMock,
}));

vi.mock("@/hooks/queries", () => ({
  useAccountingReportingProfitLoss: () => ({
    data: null,
    error: new Error("profit loss unavailable"),
    isPending: false,
  }),
  useAccountingReportingGeneralLedger: () => ({
    data: null,
    error: new Error("general ledger unavailable"),
    isPending: false,
  }),
  useAccountingReportingAccountLedger: () => ({
    data: null,
    error: new Error("account ledger unavailable"),
    isPending: false,
  }),
}));

describe("reporting integration errors", () => {
  beforeEach(() => {
    pathnameMock = "/bumdes/accounting/reporting/profit-loss";
    searchParamsMock = new URLSearchParams();
  });

  it("renders error states from reporting hooks", () => {
    render(<ReportingProfitLossPage />);
    expect(screen.getByText("profit loss unavailable")).toBeTruthy();

    pathnameMock = "/bumdes/accounting/reporting/general-ledger";
    render(<ReportingGeneralLedgerPage />);
    expect(screen.getByText("general ledger unavailable")).toBeTruthy();

    pathnameMock = "/bumdes/accounting/reporting/account-ledger";
    render(<ReportingAccountLedgerPage accountId="101000" />);
    expect(screen.getByText("account ledger unavailable")).toBeTruthy();
  });

  it("throws guard error when API envelope is unsuccessful", () => {
    expect(() =>
      ensureAccountingReportingSuccess({
        success: false,
        message: "failed",
        data: null,
        errors: {
          error: ["invalid reporting context"],
        },
      }),
    ).toThrow("invalid reporting context");
  });
});
