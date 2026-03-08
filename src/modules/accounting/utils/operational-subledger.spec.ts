/** @format */

import { describe, expect, it } from "vitest";

import {
  buildOperationalTraceRows,
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
  });
});
