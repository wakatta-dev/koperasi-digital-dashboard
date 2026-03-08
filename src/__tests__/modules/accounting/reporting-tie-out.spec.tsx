/** @format */

import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ReportingTieOutPage } from "@/modules/accounting";

let pathnameMock = "/bumdes/accounting/reporting/tie-out";
let searchParamsMock = new URLSearchParams("preset=month");

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
  }),
  usePathname: () => pathnameMock,
  useSearchParams: () => searchParamsMock,
}));

vi.mock("@/hooks/queries", () => ({
  useAccountingReportingTieOut: () => ({
    data: {
      period_label: "Jan 2026",
      summaries: [
        {
          domain: "marketplace",
          label: "Marketplace",
          operational_total: 150000,
          gl_total: 100000,
          delta: 50000,
          operational_count: 2,
          gl_count: 1,
          mismatch_count: 1,
          status: "mismatch",
        },
      ],
      mismatches: [
        {
          domain: "marketplace",
          source_id: "77",
          source_reference: "MKT-77",
          source_document_reference: "ORD-77",
          operational_amount: 150000,
          gl_amount: 100000,
          delta: 50000,
          mismatch_status: "amount_delta",
          mismatch_reason: "Total operational subledger dan GL berbeda untuk reference yang sama.",
          readiness_status: "ready",
          readiness_reason: "Order selesai dan siap dibandingkan dengan GL.",
          journal_number: "JRN-1",
          trace_available: true,
        },
        {
          domain: "rental",
          source_id: "88",
          source_reference: "RNT-88",
          source_document_reference: "RSV-000088",
          operational_amount: 200000,
          gl_amount: 0,
          delta: 200000,
          mismatch_status: "gl_posting_lag",
          mismatch_reason: "Operational subledger sudah ready tetapi reference GL belum ditemukan pada periode yang sama.",
          readiness_status: "ready",
          readiness_reason: "Booking rental siap dibandingkan dengan GL.",
          trace_available: true,
        },
      ],
      fixed_asset_summary: {
        qualified_asset_count: 3,
        registered_asset_count: 2,
        profiled_asset_count: 1,
        missing_register_count: 1,
        missing_profile_count: 1,
        review_items: [
          {
            asset_id: 10,
            asset_name: "Gedung Serbaguna Desa",
            asset_reference: "AST-000010",
            fixed_asset_status: "registered_fixed_asset",
            fixed_asset_reference: "FAR-AST-000010",
            fixed_asset_category: "Bangunan Operasional",
            maturity_status: "profile_incomplete",
            gap_reason: "Dasar depresiasi atau klasifikasi maintenance belum lengkap.",
          },
        ],
      },
      report_context: {
        source_of_truth: "operational_subledger_vs_gl_control",
        report_tier: "control_workspace",
        auto_fallback_applied: false,
      },
    },
    error: null,
    isPending: false,
  }),
}));

describe("reporting tie-out page", () => {
  beforeEach(() => {
    pathnameMock = "/bumdes/accounting/reporting/tie-out";
    searchParamsMock = new URLSearchParams("preset=month");
  });

  it("renders summary cards and mismatch detail drill-down", () => {
    render(<ReportingTieOutPage />);

    expect(screen.getByRole("heading", { name: "Operational vs GL Tie-Out" })).toBeTruthy();
    expect(screen.getAllByText("Marketplace").length).toBeGreaterThan(0);
    expect(screen.getByRole("button", { name: "MKT-77" })).toBeTruthy();
    expect(screen.getByText("Total operational subledger dan GL berbeda untuk reference yang sama.")).toBeTruthy();
    expect(screen.getByText("Fixed Asset Maturity")).toBeTruthy();
    expect(screen.getByText("Gedung Serbaguna Desa")).toBeTruthy();
    expect(screen.getByText("AST-000010 • FAR-AST-000010")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "RNT-88" }));

    expect(screen.getByText("Operational subledger sudah ready tetapi reference GL belum ditemukan pada periode yang sama.")).toBeTruthy();
    expect(screen.getByText("Belum ada journal number")).toBeTruthy();
  });
});
