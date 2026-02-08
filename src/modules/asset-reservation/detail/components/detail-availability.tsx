/** @format */

import { useEffect, useMemo, useRef, useState } from "react";

import type { AssetAvailabilityRange, AssetAvailabilityResponse } from "@/types/api/asset";

const DAYS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
type CellType =
  | "blank"
  | "disabled"
  | "available"
  | "booked"
  | "start"
  | "end"
  | "range"
  | "ellipsis";

type DetailAvailabilityProps = {
  blocked?: AssetAvailabilityRange[];
  isLoading?: boolean;
  error?: string | null;
  suggestion?: AssetAvailabilityResponse["suggestion"];
  selectedRange?: { start: string; end: string };
  onRangeChange?: (range: { start: string; end: string }) => void;
};

function DayCell({
  type,
  label,
}: {
  type: CellType;
  label?: string;
}) {
  if (type === "blank") {
    return <div className="aspect-square" />;
  }

  if (type === "disabled") {
    return (
      <div className="aspect-square flex items-center justify-center m-0.5 rounded-lg text-gray-300 dark:text-gray-600 cursor-not-allowed">
        {label}
      </div>
    );
  }

  if (type === "booked") {
    return (
      <div className="relative aspect-square m-0.5">
        <div className="absolute inset-0 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/50 rounded-lg flex items-center justify-center text-red-600 dark:text-red-400 font-bold cursor-not-allowed">
          {label}
        </div>
      </div>
    );
  }

  if (type === "start" || type === "end") {
    const isStart = type === "start";
    return (
      <div className="aspect-square flex items-center justify-center relative group cursor-pointer">
        <div
          className={`absolute inset-y-0 ${isStart ? "right-0 left-1 rounded-l-full" : "left-0 right-1 rounded-r-full"} bg-indigo-50 dark:bg-indigo-900/40`}
        />
        <div className="relative w-10 h-10 flex items-center justify-center bg-brand-primary text-white font-bold rounded-full shadow-md z-10 ring-2 ring-white dark:ring-surface-card-dark">
          {label}
        </div>
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition shadow-xl pointer-events-none whitespace-nowrap z-20">
          {isStart ? "Mulai" : "Selesai"}
        </div>
      </div>
    );
  }

  if (type === "range") {
    return (
      <div className="aspect-square flex items-center justify-center relative cursor-pointer bg-indigo-50 dark:bg-indigo-900/40">
        <span className="text-brand-primary dark:text-indigo-300 font-semibold">{label}</span>
      </div>
    );
  }

  if (type === "ellipsis") {
    return (
      <div className="aspect-square flex items-center justify-center m-0.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition">
        {label}
      </div>
    );
  }

  return (
    <div className="aspect-square flex items-center justify-center m-0.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition">
      {label}
    </div>
  );
}

function calculateDurationDays(start?: string, end?: string) {
  if (!start || !end) return null;
  const s = new Date(start);
  const e = new Date(end);
  const diff = Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24));
  if (Number.isNaN(diff) || diff <= 0) return null;
  return diff;
}

function buildCalendar(monthBase: string, start: string, end: string, blocked?: AssetAvailabilityRange[]) {
  const viewDate = monthBase ? new Date(`${monthBase}T00:00:00`) : new Date();
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: { type: CellType; label?: string; date?: string }[] = [];
  for (let i = 0; i < firstDay; i += 1) {
    cells.push({ type: "blank" });
  }
  const startTs = new Date(`${start}T00:00:00`).getTime();
  const endTs = new Date(`${end}T00:00:00`).getTime();
  const todayTs = new Date(new Date().toISOString().slice(0, 10) + "T00:00:00").getTime();

  const overlapsBlocked = (dateStr: string) => {
    if (!blocked || blocked.length === 0) return false;
    const ts = new Date(`${dateStr}T00:00:00`).getTime();
    return blocked.some((b) => {
      const bs = new Date(`${b.start_date}T00:00:00`).getTime();
      const be = new Date(`${b.end_date}T23:59:59`).getTime();
      return ts >= bs && ts <= be;
    });
  };

  for (let day = 1; day <= daysInMonth; day += 1) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const ts = new Date(`${dateStr}T00:00:00`).getTime();

    let type: CellType = "available";
    if (dateStr === start) type = "start";
    else if (dateStr === end) type = "end";
    else if (ts > startTs && ts < endTs) type = "range";
    else if (overlapsBlocked(dateStr)) type = "booked";
    else if (ts < todayTs) type = "disabled";

    cells.push({ type, label: String(day), date: dateStr });
  }
  return cells;
}

function addDays(dateStr: string, days: number) {
  const date = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dateStr;
  date.setDate(date.getDate() + days);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function overlap(aStart: string, aEnd: string, bStart: string, bEnd: string) {
  const aS = new Date(`${aStart}T00:00:00`).getTime();
  const aE = new Date(`${aEnd}T00:00:00`).getTime();
  const bS = new Date(`${bStart}T00:00:00`).getTime();
  const bE = new Date(`${bEnd}T00:00:00`).getTime();
  return aS <= bE && bS <= aE;
}

export function DetailAvailability({
  blocked,
  isLoading,
  error,
  suggestion,
  selectedRange,
  onRangeChange,
}: DetailAvailabilityProps) {
  const appliedSuggestionRef = useRef<string | null>(null);
  const suggestedRange = useMemo(() => {
    if (!suggestion?.start_date) return null;
    const start = suggestion.start_date;
    const tentativeEnd = addDays(start, 3);
    const endLimit = suggestion.end_date ?? tentativeEnd;
    const end =
      new Date(`${tentativeEnd}T00:00:00`) > new Date(`${endLimit}T00:00:00`) ? endLimit : tentativeEnd;
    return { start, end };
  }, [suggestion?.start_date, suggestion?.end_date]);

  const [viewMonth, setViewMonth] = useState(() => {
    const base = selectedRange?.start ?? suggestedRange?.start ?? new Date().toISOString().slice(0, 10);
    return /^\d{4}-\d{2}-\d{2}$/.test(base) ? base : new Date().toISOString().slice(0, 10);
  });

  useEffect(() => {
    if (!suggestedRange || !onRangeChange) return;
    const key = `${suggestedRange.start}-${suggestedRange.end}`;
    if (appliedSuggestionRef.current === key) return;
    onRangeChange(suggestedRange);
    appliedSuggestionRef.current = key;
    setViewMonth(suggestedRange.start);
  }, [onRangeChange, suggestedRange]);

  const baseRange = selectedRange ?? suggestedRange;
  const fallbackDate = viewMonth || new Date().toISOString().slice(0, 10);
  const startLabel = selectedRange?.start ?? suggestedRange?.start ?? fallbackDate;
  const endLabel = selectedRange?.end ?? suggestedRange?.end ?? fallbackDate;
  const durationDays = calculateDurationDays(baseRange?.start, baseRange?.end);
  const durationLabel = durationDays ? `${durationDays} Hari` : "-";
  const monthLabel = useMemo(() => {
    const date = viewMonth ? new Date(`${viewMonth.slice(0, 7)}-01T00:00:00`) : new Date();
    return new Intl.DateTimeFormat("id-ID", { month: "long", year: "numeric" }).format(date);
  }, [viewMonth]);

  const navigateMonth = (direction: -1 | 1) => {
    const date = viewMonth ? new Date(`${viewMonth.slice(0, 7)}-01T00:00:00`) : new Date();
    date.setMonth(date.getMonth() + direction);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    setViewMonth(`${year}-${month}-01`);
  };

  const handleDateChange = (which: "start" | "end", value: string) => {
    if (!onRangeChange) return;
    const clean = value || startLabel;
    const currentStart = which === "start" ? clean : startLabel;
    const currentEnd = which === "end" ? clean : endLabel;

    const isBlocked = (date: string) =>
      blocked?.some((b) => overlap(date, date, b.start_date, b.end_date)) ?? false;
    if (isBlocked(clean)) return;

    const nextEnd = new Date(currentEnd) < new Date(currentStart) ? currentStart : currentEnd;
    const overlapsBlockedRange =
      blocked?.some((b) => overlap(currentStart, nextEnd, b.start_date, b.end_date)) ?? false;
    if (overlapsBlockedRange) return;

    onRangeChange({ start: currentStart, end: nextEnd });
  };

  const visibleBlocked =
    blocked
      ?.map((b) => {
        const viewBase = viewMonth ? new Date(`${viewMonth.slice(0, 7)}-01T00:00:00`) : new Date();
        const monthStart = new Date(viewBase.getFullYear(), viewBase.getMonth(), 1);
        const monthEnd = new Date(viewBase.getFullYear(), viewBase.getMonth() + 1, 0);
        const monthStartStr = `${monthStart.getFullYear()}-${String(monthStart.getMonth() + 1).padStart(2, "0")}-${String(monthStart.getDate()).padStart(2, "0")}`;
        const monthEndStr = `${monthEnd.getFullYear()}-${String(monthEnd.getMonth() + 1).padStart(2, "0")}-${String(monthEnd.getDate()).padStart(2, "0")}`;
        if (!overlap(monthStartStr, monthEndStr, b.start_date, b.end_date)) return null;
        const clampStart = new Date(b.start_date) > monthStart ? b.start_date : monthStartStr;
        const clampEnd = new Date(b.end_date) < monthEnd ? b.end_date : monthEndStr;
        return { ...b, start_date: clampStart, end_date: clampEnd };
      })
      .filter(Boolean) as AssetAvailabilityRange[] | undefined;

  const calendarCells = buildCalendar(viewMonth, startLabel, endLabel, visibleBlocked);

  return (
    <div className="border-t border-gray-100 dark:border-gray-700 pt-6">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Ketersediaan & Jadwal</h2>
      <div className="bg-white dark:bg-surface-card-dark border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div className="relative group">
            <button className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white hover:text-brand-primary transition-colors">
              <span className="capitalize">{monthLabel}</span>
              <span className="material-icons-outlined text-gray-500">expand_more</span>
            </button>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => navigateMonth(-1)}
              className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition shadow-sm"
            >
              <span className="material-icons-outlined text-sm">arrow_back_ios_new</span>
            </button>
            <button
              type="button"
              onClick={() => navigateMonth(1)}
              className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition shadow-sm"
            >
              <span className="material-icons-outlined text-sm">arrow_forward_ios</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
          <label className="flex flex-col text-xs font-semibold text-gray-600 dark:text-gray-300">
            Mulai
            <input
              type="date"
              value={startLabel}
              onChange={(e) => handleDateChange("start", e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-brand-primary focus:ring-brand-primary"
            />
          </label>
          <label className="flex flex-col text-xs font-semibold text-gray-600 dark:text-gray-300">
            Selesai
            <input
              type="date"
              value={endLabel}
              onChange={(e) => handleDateChange("end", e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-brand-primary focus:ring-brand-primary"
            />
          </label>
        </div>

        <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-4">
          {DAYS.map((day) => (
            <div
              key={day}
              className="text-center text-xs font-semibold text-gray-400 uppercase tracking-wide"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-y-2 gap-x-0 relative select-none">
          {calendarCells.map((cell, index) => (
            <DayCell key={`${cell.type}-${cell.label ?? index}-${cell.date ?? index}`} type={cell.type} label={cell.label} />
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-6 mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-500" />
            <span className="text-xs text-gray-600 dark:text-gray-400">Tersedia</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-center justify-center text-[10px] font-bold text-red-500">
              X
            </div>
            <span className="text-xs text-gray-600 dark:text-gray-400">Disewa</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-brand-primary ring-1 ring-white dark:ring-surface-card-dark z-10" />
              <div className="w-3 h-2 bg-indigo-100 dark:bg-indigo-900/40 -ml-1" />
              <div className="w-3 h-3 rounded-full bg-brand-primary ring-1 ring-white dark:ring-surface-card-dark -ml-1 z-10" />
            </div>
            <span className="text-xs text-gray-600 dark:text-gray-400">Dipilih</span>
          </div>
        </div>

        <div className="mt-4 text-xs text-gray-600 dark:text-gray-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
          {isLoading
            ? "Memuat jadwal terblokir..."
            : (visibleBlocked?.length ?? 0) > 0
              ? `Slot terblokir bulan ini: ${visibleBlocked
                  ?.map((b) => `${b.start_date} s.d ${b.end_date}${b.type ? ` (${b.type})` : ""}`)
                  .join(", ")}`
              : "Tidak ada jadwal bentrok pada bulan ini."}
          {error ? <span className="text-red-500"> {error}</span> : null}
        </div>

        <div className="mt-6 bg-brand-primary/5 dark:bg-brand-primary/10 rounded-xl p-4 border border-brand-primary/10 dark:border-brand-primary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="mt-1 p-1.5 bg-white dark:bg-indigo-950 rounded-lg text-brand-primary shadow-sm">
              <span className="material-icons-outlined text-xl">date_range</span>
            </div>
            <div>
              <p className="text-xs font-semibold text-brand-primary uppercase tracking-wider mb-0.5">
                Jadwal Dipilih
              </p>
              <p className="text-sm font-bold text-gray-900 dark:text-white">
                {startLabel} - {endLabel}
                <span className="font-normal text-gray-500 dark:text-gray-400 mx-1">•</span>
                <span className="text-brand-primary">{durationLabel}</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            className="text-xs font-bold text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 underline underline-offset-2"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
