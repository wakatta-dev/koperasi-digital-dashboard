/** @format */

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { checkAvailability } from "../utils/availability";
import { createReservation } from "@/services/api/reservations";
import type { ReservationSummary } from "../../types";

type DetailRentalFormProps = {
  assetId?: string;
  price: string;
  unit: string;
  onSubmit?: () => void;
};

export function DetailRentalForm({
  price,
  unit,
  assetId,
  onSubmit,
}: DetailRentalFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [suggestion, setSuggestion] = useState<{
    start: string;
    end: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [reservationInfo, setReservationInfo] =
    useState<ReservationSummary | null>(null);

  const defaultStart = useMemo(() => "2024-10-12", []);
  const defaultEnd = useMemo(() => "2024-10-14", []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setServerError(null);
    setReservationInfo(null);
    const formData = new FormData(event.currentTarget);
    const start = String(formData.get("start_date") ?? "");
    const end = String(formData.get("end_date") ?? "");
    const purpose = String(formData.get("purpose") ?? "").trim();
    const now = new Date().toISOString().slice(0, 10);
    const numericAssetId =
      assetId && /^\d+$/.test(assetId) ? assetId : undefined;

    if (!start || !end) {
      setError("Tanggal mulai dan selesai wajib diisi.");
      return;
    }

    if (start >= end) {
      setError("Tanggal selesai harus setelah tanggal mulai.");
      return;
    }

    if (start < now) {
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
      });

      if (!creation.success || !creation.data) {
        throw new Error(creation.message || "Gagal membuat reservasi");
      }

      const { reservation_id, hold_expires_at, amounts, status } =
        creation.data;
      setReservationInfo({
        reservationId: reservation_id,
        assetId: assetId ?? "asset-unknown",
        startDate: start,
        endDate: end,
        status: status === "pending_review" ? "pending_review" : "awaiting_dp",
        holdExpiresAt: hold_expires_at,
        amounts,
      });
      setError(null);
      setSuggestion(null);
      onSubmit?.();
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Gagal memproses permintaan"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg sticky top-24">
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
              defaultValue={defaultStart}
              name="start_date"
              className="w-full text-sm rounded-lg border-[#4338ca] dark:border-[#4338ca]/50 dark:bg-gray-800 focus-visible:border-[#4338ca] focus-visible:ring-[#4338ca] text-gray-900 dark:text-white font-medium bg-[#4338ca]/5 dark:bg-[#4338ca]/10"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Selesai Sewa
            </label>
            <Input
              type="date"
              defaultValue={defaultEnd}
              name="end_date"
              className="w-full text-sm rounded-lg border-[#4338ca] dark:border-[#4338ca]/50 dark:bg-gray-800 focus-visible:border-[#4338ca] focus-visible:ring-[#4338ca] text-gray-900 dark:text-white font-medium bg-[#4338ca]/5 dark:bg-[#4338ca]/10"
            />
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
              x 3 Hari
            </span>
            <span className="text-gray-900 dark:text-white font-medium">
              Rp1.050.000
            </span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600 dark:text-gray-300">
              Biaya Kebersihan
            </span>
            <span className="text-gray-900 dark:text-white font-medium">
              Rp50.000
            </span>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2 flex justify-between items-center">
            <span className="font-bold text-gray-900 dark:text-white">
              Total Estimasi
            </span>
            <span className="font-bold text-[#4338ca] text-lg">
              Rp1.100.000
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
              className="w-full text-sm rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 focus-visible:border-[#4338ca] focus-visible:ring-[#4338ca] text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nomor Telepon (WhatsApp)
            </label>
            <Input
              type="tel"
              placeholder="0812..."
              name="phone"
              className="w-full text-sm rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 focus-visible:border-[#4338ca] focus-visible:ring-[#4338ca] text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <Input
              type="email"
              placeholder="email@contoh.com"
              name="email"
              className="w-full text-sm rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 focus-visible:border-[#4338ca] focus-visible:ring-[#4338ca] text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tujuan Sewa
            </label>
            <Textarea
              placeholder="Jelaskan acara atau kebutuhan Anda..."
              rows={3}
              name="purpose"
              className="w-full text-sm rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 focus-visible:border-[#4338ca] focus-visible:ring-[#4338ca] text-gray-900 dark:text-white resize-none"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#4338ca] hover:bg-indigo-600 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition transform active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70"
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
