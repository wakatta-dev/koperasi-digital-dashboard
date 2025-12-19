/** @format */

import { CALENDAR_MONTH, SELECTED_RANGE } from "../constants";
import { getBlockedRanges } from "../utils/availability";

const DAYS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

function DayCell({
  type,
  label,
}: {
  type: (typeof CALENDAR_MONTH.days)[number]["type"];
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
        <div className="relative w-10 h-10 flex items-center justify-center bg-[#4338ca] text-white font-bold rounded-full shadow-md z-10 ring-2 ring-white dark:ring-[#1e293b]">
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
        <span className="text-[#4338ca] dark:text-indigo-300 font-semibold">{label}</span>
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

export function DetailAvailability() {
  const blocked = getBlockedRanges();
  return (
    <div className="border-t border-gray-100 dark:border-gray-700 pt-6">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Ketersediaan & Jadwal</h2>
      <div className="bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div className="relative group">
            <button className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white hover:text-[#4338ca] transition-colors">
              <span>{CALENDAR_MONTH.label}</span>
              <span className="material-icons-outlined text-gray-500">expand_more</span>
            </button>
          </div>
          <div className="flex gap-2">
            <button className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition shadow-sm">
              <span className="material-icons-outlined text-sm">arrow_back_ios_new</span>
            </button>
            <button className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition shadow-sm">
              <span className="material-icons-outlined text-sm">arrow_forward_ios</span>
            </button>
          </div>
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
          {CALENDAR_MONTH.days.map((cell, index) => (
            <DayCell key={`${cell.type}-${cell.label ?? index}`} type={cell.type} label={cell.label} />
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
              <div className="w-3 h-3 rounded-full bg-[#4338ca] ring-1 ring-white dark:ring-[#1e293b] z-10" />
              <div className="w-3 h-2 bg-indigo-100 dark:bg-indigo-900/40 -ml-1" />
              <div className="w-3 h-3 rounded-full bg-[#4338ca] ring-1 ring-white dark:ring-[#1e293b] -ml-1 z-10" />
            </div>
            <span className="text-xs text-gray-600 dark:text-gray-400">Dipilih</span>
          </div>
        </div>

        <div className="mt-4 text-xs text-gray-600 dark:text-gray-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
          Slot terblokir:{" "}
          {blocked.map((b) => `${b.start} s.d ${b.end} (${b.type ?? "booking"})`).join(", ")}
        </div>

        <div className="mt-6 bg-[#4338ca]/5 dark:bg-[#4338ca]/10 rounded-xl p-4 border border-[#4338ca]/10 dark:border-[#4338ca]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="mt-1 p-1.5 bg-white dark:bg-indigo-950 rounded-lg text-[#4338ca] shadow-sm">
              <span className="material-icons-outlined text-xl">date_range</span>
            </div>
            <div>
              <p className="text-xs font-semibold text-[#4338ca] uppercase tracking-wider mb-0.5">
                Jadwal Dipilih
              </p>
              <p className="text-sm font-bold text-gray-900 dark:text-white">
                {SELECTED_RANGE.start} - {SELECTED_RANGE.end}
                <span className="font-normal text-gray-500 dark:text-gray-400 mx-1">•</span>
                <span className="text-[#4338ca]">{SELECTED_RANGE.duration}</span>
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
