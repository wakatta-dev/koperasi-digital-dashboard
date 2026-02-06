/** @format */

import { useEffect, useMemo, useState } from "react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { checkAvailability } from "../utils/availability";
import { createReservation } from "@/services/api/reservations";
import type { ReservationSummary } from "../../types";

const rentalSchema = z.object({
  start_date: z.string().min(1, "Tanggal mulai wajib diisi."),
  end_date: z.string().min(1, "Tanggal selesai wajib diisi."),
  full_name: z.string().trim().min(1, "Nama wajib diisi."),
  phone: z.string().trim().min(1, "Nomor telepon wajib diisi."),
  email: z.string().trim().min(1, "Email wajib diisi.").email("Email tidak valid."),
  purpose: z.string().trim().min(1, "Tujuan sewa wajib diisi."),
});

type DetailRentalFormProps = {
  assetId?: string;
  price: string;
  priceValue: number;
  unit: string;
  startDate: string;
  endDate: string;
  onRangeChange?: (range: { start: string; end: string }) => void;
  onSubmit?: (reservation: ReservationSummary) => Promise<void> | void;
};

export function DetailRentalForm({
  price,
  priceValue,
  unit,
  assetId,
  startDate,
  endDate,
  onRangeChange,
  onSubmit,
}: DetailRentalFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [suggestion, setSuggestion] = useState<{
    start: string;
    end: string;
  } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [reservationInfo, setReservationInfo] =
    useState<ReservationSummary | null>(null);
  const [dates, setDates] = useState<{ start: string; end: string }>({
    start: startDate,
    end: endDate,
  });

  useEffect(() => {
    setDates({ start: startDate, end: endDate });
  }, [startDate, endDate]);

  const durationDays = useMemo(() => {
    const s = new Date(dates.start);
    const e = new Date(dates.end);
    const diff = Math.max(
      1,
      Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1
    );
    return Number.isFinite(diff) ? diff : 1;
  }, [dates.start, dates.end]);

  const subtotal = useMemo(
    () => Math.max(0, priceValue || 0) * durationDays,
    [priceValue, durationDays]
  );
  const cleaningFee = 50000;
  const total = subtotal + cleaningFee;

  const handleDateUpdate = (which: "start" | "end", value: string) => {
    const next = { ...dates, [which]: value || dates[which] };
    const startTs = new Date(next.start).getTime();
    const endTs = new Date(next.end).getTime();
    if (endTs < startTs) {
      next.end = next.start;
    }
    setDates(next);
    onRangeChange?.({ start: next.start, end: next.end });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setServerError(null);
    setReservationInfo(null);
    setFieldErrors({});
    setError(null);
    const formData = new FormData(event.currentTarget);
    const start = String(formData.get("start_date") ?? dates.start);
    const end = String(formData.get("end_date") ?? dates.end);
    const purpose = String(formData.get("purpose") ?? "").trim();
    const fullName = String(formData.get("full_name") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const contact = [phone, email].filter(Boolean).join(" / ");
    const now = new Date().toISOString().slice(0, 10);
    const numericAssetId = assetId && /^\d+$/.test(assetId) ? assetId : undefined;

    const validation = rentalSchema.safeParse({
      start_date: start,
      end_date: end,
      purpose,
      full_name: fullName,
      phone,
      email,
    });

    if (!validation.success) {
      const flattened = validation.error.flatten();
      const byField: Record<string, string> = {};
      Object.entries(flattened.fieldErrors).forEach(([key, messages]) => {
        if (messages && messages.length > 0) byField[key] = messages[0];
      });
      setFieldErrors(byField);
      setError("Mohon lengkapi data yang wajib diisi.");
      return;
    }

    if (start > end) {
      setFieldErrors((prev) => ({ ...prev, end_date: "Tanggal selesai harus setelah tanggal mulai." }));
      setError("Tanggal selesai harus setelah tanggal mulai atau di hari yang sama.");
      return;
    }

    if (start < now) {
      setFieldErrors((prev) => ({ ...prev, start_date: "Tanggal mulai tidak boleh di masa lalu." }));
      setError("Tanggal mulai tidak boleh di masa lalu.");
      return;
    }

    setIsSubmitting(true);
    if (!numericAssetId) {
      setServerError("Aset tidak valid untuk diajukan.");
      setIsSubmitting(false);
      return;
    }

    const result = checkAvailability({ start, end, assetId: numericAssetId });
    const resolved = result instanceof Promise ? await result : result;

    if (!resolved.ok) {
      setError("Rentang tanggal bertabrakan dengan jadwal lain.");
      setSuggestion(resolved.suggestion ?? null);
      setIsSubmitting(false);
      return;
    }

    try {
      const creation = await createReservation({
        asset_id: numericAssetId,
        start_date: start,
        end_date: end,
        purpose: purpose || "Penggunaan umum",
        renter_name: fullName || "Pemesan",
        renter_contact: contact || "kontak tidak tersedia",
      });

      if (!creation.success || !creation.data) {
        throw new Error(creation.message || "Gagal membuat reservasi");
      }

      const { reservation_id, hold_expires_at, amounts, status } =
        creation.data;
      const info: ReservationSummary = {
        reservationId: reservation_id,
        assetId: assetId ?? "asset-unknown",
        startDate: start,
        endDate: end,
        status: status === "pending_review" ? "pending_review" : "awaiting_dp",
        holdExpiresAt: hold_expires_at,
        amounts,
      };
      setReservationInfo(info);
      setError(null);
      setSuggestion(null);
      await onSubmit?.(info);
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Gagal memproses permintaan"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-surface-card-dark rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg sticky top-24">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        Ajukan Sewa
      </h3>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Mulai Sewa
            </label>
            <Input
              type="date"
              value={dates.start}
              onChange={(e) => handleDateUpdate("start", e.target.value)}
              name="start_date"
              className={`w-full text-sm rounded-lg ${
                fieldErrors.start_date ? "border-red-500 focus-visible:ring-red-500" : "border-brand-primary focus-visible:border-brand-primary focus-visible:ring-brand-primary"
              } dark:border-brand-primary/50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium bg-brand-primary/5 dark:bg-brand-primary/10`}
            />
            {fieldErrors.start_date ? (
              <p className="mt-1 text-[11px] text-red-500">{fieldErrors.start_date}</p>
            ) : null}
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Selesai Sewa
            </label>
            <Input
              type="date"
              value={dates.end}
              onChange={(e) => handleDateUpdate("end", e.target.value)}
              name="end_date"
              className={`w-full text-sm rounded-lg ${
                fieldErrors.end_date ? "border-red-500 focus-visible:ring-red-500" : "border-brand-primary focus-visible:border-brand-primary focus-visible:ring-brand-primary"
              } dark:border-brand-primary/50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium bg-brand-primary/5 dark:bg-brand-primary/10`}
            />
            {fieldErrors.end_date ? (
              <p className="mt-1 text-[11px] text-red-500">{fieldErrors.end_date}</p>
            ) : null}
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-dashed border-gray-300 dark:border-gray-600">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
            Ringkasan Sewa
          </h4>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600 dark:text-gray-300">
              {price}
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                {unit}
              </span>{" "}
              x {durationDays} {unit === "/jam" ? "Jam" : "Hari"}
            </span>
            <span className="text-gray-900 dark:text-white font-medium">
              Rp{subtotal.toLocaleString("id-ID")}
            </span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600 dark:text-gray-300">
              Biaya Kebersihan
            </span>
            <span className="text-gray-900 dark:text-white font-medium">
              Rp{cleaningFee.toLocaleString("id-ID")}
            </span>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2 flex justify-between items-center">
            <span className="font-bold text-gray-900 dark:text-white">
              Total Estimasi
            </span>
            <span className="font-bold text-brand-primary text-lg">
              Rp{total.toLocaleString("id-ID")}
            </span>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nama Lengkap
            </label>
            <Input
              type="text"
              placeholder="Nama Anda"
              name="full_name"
              className={`w-full text-sm rounded-lg ${
                fieldErrors.full_name ? "border-red-500 focus-visible:ring-red-500" : "border-gray-300 focus-visible:border-brand-primary focus-visible:ring-brand-primary"
              } dark:border-gray-600 dark:bg-gray-800 text-gray-900 dark:text-white`}
            />
            {fieldErrors.full_name ? (
              <p className="mt-1 text-[11px] text-red-500">{fieldErrors.full_name}</p>
            ) : null}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nomor Telepon (WhatsApp)
            </label>
            <Input
              type="tel"
              placeholder="0812..."
              name="phone"
              className={`w-full text-sm rounded-lg ${
                fieldErrors.phone ? "border-red-500 focus-visible:ring-red-500" : "border-gray-300 focus-visible:border-brand-primary focus-visible:ring-brand-primary"
              } dark:border-gray-600 dark:bg-gray-800 text-gray-900 dark:text-white`}
            />
            {fieldErrors.phone ? (
              <p className="mt-1 text-[11px] text-red-500">{fieldErrors.phone}</p>
            ) : null}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <Input
              type="email"
              placeholder="email@contoh.com"
              name="email"
              className={`w-full text-sm rounded-lg ${
                fieldErrors.email ? "border-red-500 focus-visible:ring-red-500" : "border-gray-300 focus-visible:border-brand-primary focus-visible:ring-brand-primary"
              } dark:border-gray-600 dark:bg-gray-800 text-gray-900 dark:text-white`}
            />
            {fieldErrors.email ? (
              <p className="mt-1 text-[11px] text-red-500">{fieldErrors.email}</p>
            ) : null}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tujuan Sewa
            </label>
            <Textarea
              placeholder="Jelaskan acara atau kebutuhan Anda..."
              rows={3}
              name="purpose"
              className={`w-full text-sm rounded-lg ${
                fieldErrors.purpose ? "border-red-500 focus-visible:ring-red-500" : "border-gray-300 focus-visible:border-brand-primary focus-visible:ring-brand-primary"
              } dark:border-gray-600 dark:bg-gray-800 text-gray-900 dark:text-white resize-none`}
            />
            {fieldErrors.purpose ? (
              <p className="mt-1 text-[11px] text-red-500">{fieldErrors.purpose}</p>
            ) : null}
          </div>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-brand-primary hover:bg-indigo-600 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition transform active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70"
        >
          <span className="material-icons-outlined">
            {isSubmitting ? "hourglass_top" : "send"}
          </span>
          {isSubmitting ? "Memproses..." : "Minta Penawaran"}
        </Button>
        {error ? (
          <div className="mt-3 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
            <p className="font-semibold">Permintaan tidak bisa diproses</p>
            <p>{error}</p>
            {suggestion ? (
              <p className="mt-1">
                Coba jadwal berikut: <strong>{suggestion.start}</strong> sampai{" "}
                <strong>{suggestion.end}</strong>.
              </p>
            ) : null}
          </div>
        ) : null}
        {serverError ? (
          <div className="mt-3 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
            <p className="font-semibold">Gagal membuat reservasi</p>
            <p>{serverError}</p>
          </div>
        ) : null}
        {reservationInfo ? (
          <div className="mt-3 text-xs text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 space-y-1">
            <p className="font-semibold">Reservasi dibuat</p>
            <p>
              ID: <strong>{reservationInfo.reservationId}</strong>
            </p>
            <p>
              Status: <strong>{reservationInfo.status}</strong> · Hold hingga{" "}
              <strong>
                {new Date(reservationInfo.holdExpiresAt ?? "").toLocaleString()}
              </strong>
            </p>
            <p>
              DP: Rp{reservationInfo.amounts.dp.toLocaleString("id-ID")} · Sisa:
              Rp
              {reservationInfo.amounts.remaining.toLocaleString("id-ID")}
            </p>
          </div>
        ) : null}
        <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
          Tim BUMDes akan menghubungi Anda untuk konfirmasi ketersediaan dan
          pembayaran.
        </p>
      </form>
    </div>
  );
}
