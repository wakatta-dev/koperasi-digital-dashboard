/** @format */

import { fireEvent, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { renderFeature } from "@/__tests__/modules/asset-rental/test-utils";
import { FeatureOperationalTraceWorkbench } from "./FeatureOperationalTraceWorkbench";

const useMarketplaceOrdersMock = vi.fn();
const useMarketplaceOrderMock = vi.fn();
const getAssetRentalBookingsMock = vi.fn();
const getReservationMock = vi.fn();
const useSupportOperationalExceptionContextMock = vi.fn();
const useSupportOperationalExceptionActionsMock = vi.fn();
const useAccountingJournalPostingPoliciesMock = vi.fn();
const useAccountingJournalSourceTraceMock = vi.fn();

vi.mock("@/hooks/queries/marketplace-orders", () => ({
  useMarketplaceOrders: (...args: unknown[]) =>
    useMarketplaceOrdersMock(...args),
  useMarketplaceOrder: (...args: unknown[]) => useMarketplaceOrderMock(...args),
}));

vi.mock("@/services/api/asset-rental", () => ({
  getAssetRentalBookings: (...args: unknown[]) =>
    getAssetRentalBookingsMock(...args),
}));

vi.mock("@/services/api/reservations", () => ({
  getReservation: (...args: unknown[]) => getReservationMock(...args),
}));

vi.mock("@/hooks/queries/support-config", () => ({
  useSupportOperationalExceptionContext: (...args: unknown[]) =>
    useSupportOperationalExceptionContextMock(...args),
  useSupportOperationalExceptionActions: (...args: unknown[]) =>
    useSupportOperationalExceptionActionsMock(...args),
}));

vi.mock("@/hooks/queries/accounting-journal", () => ({
  useAccountingJournalPostingPolicies: (...args: unknown[]) =>
    useAccountingJournalPostingPoliciesMock(...args),
  useAccountingJournalSourceTrace: (...args: unknown[]) =>
    useAccountingJournalSourceTraceMock(...args),
}));

describe("FeatureOperationalTraceWorkbench", () => {
  beforeEach(() => {
    useMarketplaceOrdersMock.mockReturnValue({
      data: {
        items: [
          {
            id: 11,
            order_number: "INV-2026-0001",
            status: "PROCESSING",
            payment_status: "succeeded",
            fulfillment_method: "DELIVERY",
            customer_name: "Budi",
            customer_phone: "08123",
            customer_email: "budi@example.com",
            total: 100000,
            created_at: 1,
            accounting_readiness: {
              status: "ready",
              reason: "Siap posting",
              reference: "MP-INV-2026-0001",
            },
          },
        ],
      },
      isLoading: false,
      isError: false,
      error: null,
    });

    useMarketplaceOrderMock.mockReturnValue({
      data: {
        manual_payment: {
          proof_url: "https://example.com/proof-marketplace.jpg",
        },
        status_history: [
          {
            status: "PAYMENT_VERIFICATION",
            timestamp: 1700000000,
            reason: "Menunggu verifikasi admin",
          },
        ],
      },
      isLoading: false,
      isError: false,
      error: null,
    });

    getAssetRentalBookingsMock.mockResolvedValue({
      success: true,
      data: [
        {
          id: 22,
          asset_id: 8,
          asset_name: "Gedung",
          renter_name: "Karang Taruna",
          status: "AWAITING_SETTLEMENT",
          total_amount: 500000,
          latest_payment: {
            id: "pay-22",
            amount: 200000,
            status: "pending_verification",
          },
          accounting_readiness: {
            status: "not_ready",
            reason: "Menunggu settlement",
            reference: "RSV-000022",
          },
          start_time: 1,
          end_time: 2,
        },
      ],
    });

    getReservationMock.mockResolvedValue({
      success: true,
      data: {
        reservation_id: 22,
        latest_payment: { proof_url: "https://example.com/proof-rental.jpg" },
        timeline: [
          {
            event: "awaiting_payment_verification",
            at: "2026-03-08T10:00:00Z",
            meta: { actor: "system", note: "proof received" },
          },
        ],
      },
    });

    useSupportOperationalExceptionContextMock.mockReturnValue({
      data: {
        domain: "marketplace",
        source_id: 11,
        reference: "MP-INV-2026-0001",
        attention_scope: "accounting",
        summary: "Posting jurnal tertahan",
        exception_code: "ACC-JOURNAL-TRACE-MISSING",
        severity: "medium",
        recommended_action:
          "Validasi pembentukan reference jurnal dan sinkronkan trace source-to-journal.",
        status: "active",
        owner_label: "Finance",
        next_step: "Konfirmasi reference jurnal",
        notes: [
          {
            id: 1,
            action: "catatan_ditambahkan",
            status: "active",
            message: "Reference jurnal belum terbentuk.",
            owner_label: "Finance",
            next_step: "Konfirmasi reference jurnal",
            actor_label: "finance",
            timestamp: "2026-03-08T10:00:00Z",
          },
        ],
        audit_entries: [
          {
            id: 1,
            action: "catatan_ditambahkan",
            old_status: "none",
            new_status: "active",
            reason: "Reference jurnal belum terbentuk.",
            actor_label: "finance",
            request_id: "req-exc-1",
            timestamp: "2026-03-08T10:00:00Z",
          },
        ],
      },
      isLoading: false,
      isError: false,
      error: null,
    });

    useSupportOperationalExceptionActionsMock.mockReturnValue({
      saveNote: {
        mutate: vi.fn(),
        isPending: false,
      },
      applyDecision: {
        mutate: vi.fn(),
        isPending: false,
      },
    });

    useAccountingJournalPostingPoliciesMock.mockReturnValue({
      data: {
        items: [
          {
            event_key: "marketplace.order.completed",
            domain: "marketplace",
            policy_code: "marketplace_completion_standard",
            policy_name: "Marketplace Completion Standard",
            treatment_summary:
              "Kas/bank didebit ke pendapatan marketplace, dengan HPP dan persediaan ditambahkan bila cost tersedia.",
            prerequisite_codes: [
              "accounting_handoff_minimum",
              "period_lock_open",
              "coa_mapping_ready",
            ],
            status: "active",
            updated_at: "2026-03-08T14:00:00Z",
          },
        ],
        summary: {
          active_policies: 1,
          inactive_policies: 0,
        },
      },
      isLoading: false,
      isError: false,
      error: null,
    });

    useAccountingJournalSourceTraceMock.mockImplementation(
      (domain?: string) => ({
        data:
          domain === "rental"
            ? {
                domain: "rental",
                source_id: "22",
                source_reference: "RNT-22",
                source_document_reference: "RSV-000022",
                event_key: "asset_rental.booking.completed",
                policy_code: "rental_completion_standard",
                readiness_status: "ready",
                readiness_reason:
                  "Klasifikasi DP, deposit, dan revenue recognition rental sudah tersedia.",
                trace_status: "ready",
                journal_reference: "RNT-22",
                rental_payment_classifications: [
                  {
                    classification_type: "DEPOSIT",
                    amount: 200000,
                    reason: "Dana jaminan sampai inspeksi aset selesai.",
                    follow_up_reference: "DEP-22",
                    evidence_reference: "DOC-DEP-22",
                    accounting_event_key: "rental.deposit.received",
                    accounting_reference: "RNT-DPS-22",
                  },
                  {
                    classification_type: "REVENUE_RECOGNITION",
                    amount: 300000,
                    reason: "Jasa sewa sudah selesai dan layak diakui.",
                    follow_up_reference: "REV-22",
                    evidence_reference: "DOC-REV-22",
                    accounting_event_key: "rental.revenue.recognized",
                    accounting_reference: "RNT-REV-22",
                  },
                ],
                rental_financial_resolutions: [
                  {
                    outcome_type: "DEPOSIT_REFUNDED",
                    amount: 200000,
                    reason: "Deposit dikembalikan penuh.",
                    follow_up_reference: "DPR-22",
                    evidence_reference: "DOC-DPR-22",
                    accounting_event_key: "rental.deposit.refunded",
                    accounting_reference: "RNT-DPR-22",
                  },
                ],
              }
            : {
                domain: "marketplace",
                source_id: "11",
                source_reference: "MKT-11",
                source_document_reference: "ORD-2026-0011",
                event_key: "marketplace.order.completed",
                policy_code: "marketplace_completion_standard",
                readiness_status: "ready",
                readiness_reason:
                  "Transaksi siap diteruskan ke accounting backbone.",
                governance_status: "blocked",
                governance_code: "ACC-JOURNAL-TRACE-MISSING",
                governance_reason:
                  "Reference jurnal belum terbentuk sehingga trace source-to-journal belum final.",
                settlement_mode: "MERCHANT_PAYOUT",
                payout_status: "SCHEDULED",
                payout_reference: "PAYOUT-11",
                financial_flow_type: "REFUND",
                financial_decision_status: "APPROVED",
                refund_status: "REFUND_PAID",
                accounting_consequence_status: "CONSEQUENCE_RECORDED",
                financial_follow_up_reference: "CS-REFUND-11",
                financial_event_key: "marketplace.refund.paid",
                financial_reference: "MKT-RFDP-11",
                trace_status: "blocked",
                journal_reference: "MKT-11",
                blocker_reason:
                  "Reference jurnal belum terbentuk sehingga trace source-to-journal belum final.",
              },
        isLoading: false,
        isError: false,
        error: null,
      }),
    );
  });

  it("renders unified finance trace rows and detail panel", async () => {
    renderFeature(<FeatureOperationalTraceWorkbench />);

    await waitFor(() => {
      expect(screen.getByText("Operational Subledger Trace")).toBeTruthy();
      expect(screen.getAllByText("MP-INV-2026-0001").length).toBeGreaterThan(0);
      expect(screen.getAllByText("RSV-000022").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Siap Ditinjau").length).toBeGreaterThan(0);
      expect(screen.getByText("Belum Siap")).toBeTruthy();
      expect(screen.getByText("Perlu Rekonsiliasi")).toBeTruthy();
      expect(screen.getByText("Sinkron")).toBeTruthy();
      expect(screen.getByText("Layak lapor 1")).toBeTruthy();
      expect(screen.getByText("Reporting Basis Snapshot")).toBeTruthy();
      expect(screen.getByText("Follow-up Queue")).toBeTruthy();
      expect(screen.getByText("Aktif 1")).toBeTruthy();
      expect(screen.getByText("Jejak Status")).toBeTruthy();
      expect(screen.getByText("Financial Maturity Workspace")).toBeTruthy();
      expect(screen.getByText("Maturity: Tertahan")).toBeTruthy();
      expect(screen.getByText("Policy Result")).toBeTruthy();
      expect(screen.getByText("Governance Blocker")).toBeTruthy();
      expect(screen.getByText("Exception Context")).toBeTruthy();
      expect(screen.getByText("Trace References")).toBeTruthy();
      expect(screen.getByText("Komponen Finansial Utama")).toBeTruthy();
      expect(screen.getAllByText("Settlement / Payout").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Refund / Return").length).toBeGreaterThan(0);
      expect(screen.getByText("Policy Name")).toBeTruthy();
      expect(screen.getByText("Marketplace Completion Standard")).toBeTruthy();
      expect(screen.getByText("accounting_handoff_minimum")).toBeTruthy();
      expect(screen.getByText("period_lock_open")).toBeTruthy();
      expect(screen.getByText("coa_mapping_ready")).toBeTruthy();
      expect(screen.getByText("Blocked")).toBeTruthy();
      expect(screen.getByText("marketplace.refund.paid")).toBeTruthy();
      expect(screen.getAllByText("MKT-RFDP-11").length).toBeGreaterThan(0);
      expect(screen.getAllByText("CS-REFUND-11").length).toBeGreaterThan(0);
      expect(screen.getByText("PAYMENT VERIFICATION")).toBeTruthy();
      expect(screen.getByText("Exception Workspace")).toBeTruthy();
      expect(screen.getByText("Basis Resolusi")).toBeTruthy();
      expect(
        screen.getAllByText("ACC-JOURNAL-TRACE-MISSING").length,
      ).toBeGreaterThan(0);
      expect(screen.getByText("Medium")).toBeTruthy();
      expect(
        screen.getByText(
          "Validasi pembentukan reference jurnal dan sinkronkan trace source-to-journal.",
        ),
      ).toBeTruthy();
      expect(
        screen.getByText(
          "Reference jurnal belum terbentuk sehingga trace source-to-journal belum final.",
        ),
      ).toBeTruthy();
      expect(screen.getByDisplayValue("Finance")).toBeTruthy();
      expect(
        screen.getByDisplayValue("Konfirmasi reference jurnal"),
      ).toBeTruthy();
      expect(screen.getByText("Tersedia")).toBeTruthy();
      expect(
        screen.getAllByText("Reference jurnal belum terbentuk.").length,
      ).toBeGreaterThan(0);
      expect(screen.getByText("Audit Trail Exception")).toBeTruthy();
      expect(screen.getByText("Request: req-exc-1")).toBeTruthy();
      expect(screen.getAllByText("Siap Dilaporkan").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Tahan Pelaporan").length).toBeGreaterThan(0);
      expect(screen.getByText("Lihat Bukti Pembayaran")).toBeTruthy();
    });
  });

  it("filters rows that need reconciliation follow-up", async () => {
    renderFeature(<FeatureOperationalTraceWorkbench />);

    await waitFor(() => {
      expect(screen.getAllByText("RSV-000022").length).toBeGreaterThan(0);
    });

    fireEvent.click(screen.getByRole("button", { name: "Perlu Rekonsiliasi" }));

    await waitFor(() => {
      expect(screen.getAllByText("RSV-000022").length).toBeGreaterThan(0);
      expect(screen.queryByText("MP-INV-2026-0001")).toBeFalsy();
    });
  });

  it("filters follow-up queue by context", async () => {
    renderFeature(<FeatureOperationalTraceWorkbench />);

    await waitFor(() => {
      expect(screen.getByText("Follow-up Queue")).toBeTruthy();
      expect(
        screen.getByText("Perlu follow-up pembayaran: Menunggu Verifikasi."),
      ).toBeTruthy();
    });

    fireEvent.click(screen.getByRole("button", { name: "Accounting" }));

    await waitFor(() => {
      expect(
        screen.getByText(
          "Tidak ada transaksi aktif yang membutuhkan tindak lanjut pada scope ini.",
        ),
      ).toBeTruthy();
    });

    fireEvent.click(screen.getByRole("button", { name: "Pembayaran" }));

    await waitFor(() => {
      expect(
        screen.getByText("Perlu follow-up pembayaran: Menunggu Verifikasi."),
      ).toBeTruthy();
    });

    fireEvent.change(
      screen.getByPlaceholderText("Filter code exception, contoh ACC-PAYMENT"),
      {
        target: { value: "ACC-PAYMENT-PENDING" },
      },
    );
    fireEvent.change(
      screen.getByPlaceholderText("Filter owner, contoh Finance"),
      {
        target: { value: "Finance" },
      },
    );

    await waitFor(() => {
      expect(screen.getByText("ACC-PAYMENT-PENDING")).toBeTruthy();
      expect(
        screen.getByText("Owner: Finance • Severity: Medium"),
      ).toBeTruthy();
    });
  });

  it("keeps queue context and backbone trace visible for blocked review", async () => {
    renderFeature(<FeatureOperationalTraceWorkbench />);

    await waitFor(() => {
      expect(screen.getByText("Financial Maturity Workspace")).toBeTruthy();
      expect(screen.getByText("Governance Blocker")).toBeTruthy();
      expect(screen.getByText("Exception Context")).toBeTruthy();
      expect(screen.getByText("Exception Workspace")).toBeTruthy();
      expect(screen.getByText("Request: req-exc-1")).toBeTruthy();
      expect(screen.getAllByText("MKT-11").length).toBeGreaterThan(0);
      expect(screen.getByText("Trace: Blocked")).toBeTruthy();
      expect(screen.getByText("Maturity: Tertahan")).toBeTruthy();
    });
  });

  it("renders rental payment classifications on rental trace review", async () => {
    renderFeature(<FeatureOperationalTraceWorkbench />);

    await waitFor(() => {
      expect(screen.getAllByText("RSV-000022").length).toBeGreaterThan(0);
    });

    fireEvent.click(screen.getByRole("button", { name: "Perlu Rekonsiliasi" }));
    fireEvent.click(screen.getAllByText("RSV-000022")[0]);

    await waitFor(() => {
      expect(screen.getByText("Financial Maturity Workspace")).toBeTruthy();
      expect(screen.getByText("Maturity: Perlu Follow-up")).toBeTruthy();
      expect(screen.getAllByText("Payment Classification").length).toBeGreaterThan(0);
      expect(screen.getByText("rental.deposit.received")).toBeTruthy();
      expect(screen.getAllByText("RNT-DPS-22").length).toBeGreaterThan(0);
      expect(screen.getByText("rental.revenue.recognized")).toBeTruthy();
      expect(screen.getAllByText("RNT-REV-22").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Financial Resolution").length).toBeGreaterThan(0);
      expect(screen.getByText("rental.deposit.refunded")).toBeTruthy();
      expect(screen.getAllByText("RNT-DPR-22").length).toBeGreaterThan(0);
    });
  });

  it("submits exception note from trace detail panel", async () => {
    const saveNoteMutate = vi.fn();
    useSupportOperationalExceptionActionsMock.mockReturnValue({
      saveNote: {
        mutate: saveNoteMutate,
        isPending: false,
      },
      applyDecision: {
        mutate: vi.fn(),
        isPending: false,
      },
    });

    renderFeature(<FeatureOperationalTraceWorkbench />);

    await waitFor(() => {
      expect(screen.getByText("Exception Workspace")).toBeTruthy();
    });

    fireEvent.change(
      screen.getByPlaceholderText("Contoh: Finance, Admin Operasional"),
      {
        target: { value: "Admin Operasional" },
      },
    );
    fireEvent.change(
      screen.getByPlaceholderText("Contoh: Konfirmasi bukti transfer"),
      {
        target: { value: "Hubungi renter" },
      },
    );
    fireEvent.change(
      screen.getByPlaceholderText(
        "Tuliskan konteks masalah, alasan follow-up, atau keputusan sementara.",
      ),
      {
        target: { value: "Menunggu konfirmasi ulang dari renter." },
      },
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Simpan Catatan Exception" }),
    );

    expect(saveNoteMutate).toHaveBeenCalledWith(
      expect.objectContaining({
        domain: "marketplace",
        source_id: 11,
        owner_label: "Admin Operasional",
        next_step: "Hubungi renter",
        message: "Menunggu konfirmasi ulang dari renter.",
      }),
    );
  });

  it("applies exception resolution from linked trace context", async () => {
    const applyDecisionMutate = vi.fn();
    useSupportOperationalExceptionActionsMock.mockReturnValue({
      saveNote: {
        mutate: vi.fn(),
        isPending: false,
      },
      applyDecision: {
        mutate: applyDecisionMutate,
        isPending: false,
      },
    });

    renderFeature(<FeatureOperationalTraceWorkbench />);

    await waitFor(() => {
      expect(screen.getByText("Basis Resolusi")).toBeTruthy();
    });

    fireEvent.change(
      screen.getByPlaceholderText(
        "Tuliskan konteks masalah, alasan follow-up, atau keputusan sementara.",
      ),
      {
        target: { value: "Referensi jurnal sudah terbentuk dan sinkron." },
      },
    );

    fireEvent.click(screen.getByRole("button", { name: "Setujui" }));

    expect(applyDecisionMutate).toHaveBeenCalledWith(
      expect.objectContaining({
        domain: "marketplace",
        source_id: 11,
        status: "approved",
        message: "Referensi jurnal sudah terbentuk dan sinkron.",
      }),
    );
  });
});
