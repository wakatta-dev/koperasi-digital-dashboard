/** @format */

import { describe, expect, it } from "vitest";

import {
  buildFinancialMaturityWorkspace,
  buildOperationalTraceRows,
  filterFollowUpQueueRows,
  filterOperationalTraceRows,
  summarizeOperationalTrace,
} from "./operational-subledger";

describe("operational subledger utils", () => {
  it("builds unified marketplace and rental rows with readiness labels", () => {
    const rows = buildOperationalTraceRows({
      marketplaceOrders: [
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
      rentalBookings: [
        {
          id: 22,
          asset_id: 8,
          asset_name: "Gedung",
          renter_name: "Karang Taruna",
          status: "AWAITING_SETTLEMENT",
          total_amount: 500000,
          latest_payment: { id: "pay-22", amount: 200000, status: "pending_verification" },
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

    expect(rows).toHaveLength(2);
    expect(rows[0]?.accountingStatus).toBe("Siap Ditinjau");
    expect(rows[1]?.accountingStatus).toBe("Belum Siap");
    expect(rows[1]?.paymentStatus).toBe("Menunggu Verifikasi");
    expect(rows[0]?.reconciliationStatus).toBe("Sesuai");
    expect(rows[1]?.reconciliationStatus).toBe("Perlu Tindak Lanjut");
    expect(rows[0]?.reportingStatus).toBe("Siap Dilaporkan");
    expect(rows[1]?.reportingStatus).toBe("Tahan Pelaporan");
    expect(rows[0]?.attentionScope).toBeNull();
    expect(rows[1]?.attentionScope).toBe("pembayaran");
    expect(rows[1]?.exceptionCode).toBe("ACC-PAYMENT-PENDING");
    expect(rows[1]?.queueOwnerLabel).toBe("Finance");
  });

  it("summarizes rows for finance attention", () => {
    const summary = summarizeOperationalTrace([
      {
        key: "1",
        domain: "marketplace",
        sourceId: "1",
        title: "INV-1",
        reference: "MP-1",
        operationalStatus: "Processing",
        paymentStatus: "Terverifikasi",
        accountingStatus: "Siap Ditinjau",
        accountingReason: "ok",
        reconciliationStatus: "Sesuai",
        reportingStatus: "Siap Dilaporkan",
        reportingReason: "consistent",
        attentionScope: null,
        attentionSummary: null,
        exceptionCode: null,
        exceptionSeverity: null,
        exceptionRecommendation: null,
        queueOwnerLabel: null,
        detailHref: "/",
      },
      {
        key: "2",
        domain: "rental",
        sourceId: "2",
        title: "Booking #2",
        reference: "RSV-2",
        operationalStatus: "Awaiting Settlement",
        paymentStatus: "Menunggu Verifikasi",
        accountingStatus: "Belum Siap",
        accountingReason: "wait",
        reconciliationStatus: "Perlu Tindak Lanjut",
        reportingStatus: "Tahan Pelaporan",
        reportingReason: "blocked",
        attentionScope: "pembayaran",
        attentionSummary: "Perlu follow-up pembayaran: Menunggu Verifikasi.",
        exceptionCode: "ACC-PAYMENT-PENDING",
        exceptionSeverity: "medium",
        exceptionRecommendation:
          "Verifikasi pembayaran dan pastikan status pembayaran final sebelum handoff accounting.",
        queueOwnerLabel: "Finance",
        detailHref: "/",
      },
    ]);

    expect(summary).toEqual({
      total: 2,
      ready: 1,
      needsAttention: 1,
      matched: 1,
      mismatched: 1,
      reportingReady: 1,
      reportingBlocked: 1,
    });
  });

  it("filters mismatch rows for reconciliation follow-up", () => {
    const rows = buildOperationalTraceRows({
      marketplaceOrders: [
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
      rentalBookings: [
        {
          id: 22,
          asset_id: 8,
          asset_name: "Gedung",
          renter_name: "Karang Taruna",
          status: "AWAITING_SETTLEMENT",
          total_amount: 500000,
          latest_payment: { id: "pay-22", amount: 200000, status: "pending_verification" },
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

    expect(filterOperationalTraceRows(rows, "attention")).toHaveLength(1);
    expect(filterOperationalTraceRows(rows, "matched")).toHaveLength(1);
    expect(filterFollowUpQueueRows(rows, { scope: "all" })).toHaveLength(1);
    expect(filterFollowUpQueueRows(rows, { scope: "pembayaran" })).toHaveLength(1);
    expect(filterFollowUpQueueRows(rows, { scope: "all", domain: "rental" })).toHaveLength(1);
    expect(filterFollowUpQueueRows(rows, { scope: "all", code: "ACC-PAYMENT-PENDING" })).toHaveLength(1);
    expect(filterFollowUpQueueRows(rows, { scope: "all", owner: "finance" })).toHaveLength(1);
  });

  it("classifies accounting mapping blockers with deterministic exception code", () => {
    const rows = buildOperationalTraceRows({
      marketplaceOrders: [
        {
          id: 44,
          order_number: "INV-2026-0044",
          status: "PROCESSING",
          payment_status: "succeeded",
          fulfillment_method: "DELIVERY",
          customer_name: "Sari",
          customer_phone: "08124",
          customer_email: "sari@example.com",
          total: 150000,
          created_at: 1,
          accounting_readiness: {
            status: "problematic",
            reason: "Payload jurnal tidak memuat akun tujuan untuk control account.",
            reference: "MP-INV-2026-0044",
          },
        },
      ],
    });

    expect(rows[0]?.exceptionCode).toBe("ACC-COA-MAPPING");
    expect(rows[0]?.exceptionSeverity).toBe("high");
    expect(rows[0]?.queueOwnerLabel).toBe("Finance");
  });

  it("builds marketplace financial maturity workspace from authoritative trace and exception context", () => {
    const workspace = buildFinancialMaturityWorkspace({
      row: {
        key: "marketplace-11",
        domain: "marketplace",
        sourceId: "11",
        title: "INV-2026-0001",
        reference: "MP-INV-2026-0001",
        operationalStatus: "Processing",
        paymentStatus: "Terverifikasi",
        accountingStatus: "Siap Ditinjau",
        accountingReason: "Siap posting",
        reconciliationStatus: "Sesuai",
        reportingStatus: "Siap Dilaporkan",
        reportingReason: "consistent",
        attentionScope: "accounting",
        attentionSummary: "Posting jurnal tertahan",
        exceptionCode: "ACC-JOURNAL-TRACE-MISSING",
        exceptionSeverity: "medium",
        exceptionRecommendation:
          "Validasi pembentukan reference jurnal dan sinkronkan trace source-to-journal.",
        queueOwnerLabel: "Finance",
        detailHref: "/",
      },
      trace: {
        domain: "marketplace",
        source_id: "11",
        source_reference: "MKT-11",
        source_document_reference: "ORD-2026-0011",
        event_key: "marketplace.order.completed",
        policy_code: "marketplace_completion_standard",
        readiness_status: "ready",
        readiness_reason: "Transaksi siap diteruskan ke accounting backbone.",
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
      },
      exceptionContext: {
        domain: "marketplace",
        source_id: 11,
        status: "active",
        reference: "MP-INV-2026-0001",
        attention_scope: "accounting",
        summary: "Posting jurnal tertahan",
        exception_code: "ACC-JOURNAL-TRACE-MISSING",
        severity: "medium",
        recommended_action:
          "Validasi pembentukan reference jurnal dan sinkronkan trace source-to-journal.",
        owner_label: "Finance",
        next_step: "Konfirmasi reference jurnal",
        notes: [
          {
            id: 1,
            action: "catatan_ditambahkan",
            status: "active",
            message: "Reference jurnal belum terbentuk.",
            actor_label: "finance",
            timestamp: "2026-03-09T10:00:00Z",
          },
        ],
        audit_entries: [],
      },
    });

    expect(workspace.stageLabel).toBe("Tertahan");
    expect(workspace.components).toHaveLength(2);
    expect(workspace.components[0]?.label).toBe("Settlement / Payout");
    expect(workspace.components[1]?.label).toBe("Refund / Return");
    expect(
      workspace.traceReferences.some(
        (reference) =>
          reference.label === "Financial Reference" &&
          reference.value === "MKT-RFDP-11",
      ),
    ).toBe(true);
    expect(workspace.activeExceptionOwner).toBe("Finance");
    expect(workspace.activeExceptionNextStep).toBe(
      "Konfirmasi reference jurnal",
    );
  });

  it("builds rental financial maturity workspace with classification and resolution blocks", () => {
    const workspace = buildFinancialMaturityWorkspace({
      row: {
        key: "rental-22",
        domain: "rental",
        sourceId: "22",
        title: "Booking #00022",
        reference: "RSV-000022",
        operationalStatus: "Completed",
        paymentStatus: "Terverifikasi",
        accountingStatus: "Siap Ditinjau",
        accountingReason: "Klasifikasi dan resolution siap.",
        reconciliationStatus: "Sesuai",
        reportingStatus: "Siap Dilaporkan",
        reportingReason: "consistent",
        attentionScope: null,
        attentionSummary: null,
        exceptionCode: null,
        exceptionSeverity: null,
        exceptionRecommendation: null,
        queueOwnerLabel: null,
        detailHref: "/",
      },
      trace: {
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
      },
      exceptionContext: {
        domain: "rental",
        source_id: 22,
        status: "resolved",
        notes: [],
        audit_entries: [],
      },
    });

    expect(workspace.stageLabel).toBe("Matang");
    expect(workspace.components).toHaveLength(3);
    expect(
      workspace.components.filter(
        (component) => component.label === "Payment Classification",
      ),
    ).toHaveLength(2);
    expect(
      workspace.components.some(
        (component) =>
          component.label === "Financial Resolution" &&
          component.reference === "RNT-DPR-22",
      ),
    ).toBe(true);
    expect(workspace.summary).toContain("3 komponen finansial utama");
  });
});
