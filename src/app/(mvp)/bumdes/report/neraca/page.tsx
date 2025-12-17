/** @format */

"use client";

import { useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Download,
  HelpCircle,
  Info,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { ReportFooter } from "../_components/report-footer";
import { SegmentedControl } from "../_components/segmented-control";

const periodPresets = [
  { label: "Bulanan", value: "monthly", active: false },
  { label: "Kuartalan", value: "quarterly", active: true },
  { label: "Tahunan", value: "yearly", active: false },
];

const assets = [
  { label: "Kas dan Setara Kas", value: "Rp 250.000.000" },
  { label: "Piutang Usaha", value: "Rp 120.000.000" },
  { label: "Nilai Persediaan", value: "Rp 180.000.000" },
  { label: "Aset Lancar Lainnya", value: "Rp 75.000.000" },
  { label: "Aset Tetap (Setelah Penyusutan)", value: "Rp 550.000.000" },
];

const liabilities = [
  { label: "Hutang Usaha", value: "Rp 95.000.000" },
  { label: "Hutang Bank (Jangka Pendek)", value: "Rp 120.000.000" },
  { label: "Hutang Pajak", value: "Rp 45.000.000" },
  { label: "Hutang Bank (Jangka Panjang)", value: "Rp 320.000.000" },
];

const equity = [
  { label: "Modal Disetor", value: "Rp 350.000.000" },
  { label: "Laba Ditahan", value: "Rp 245.000.000" },
];

const assetInfo = [
  { label: "Aset Lancar", value: "Rp 625.000.000" },
  { label: "Aset Tidak Lancar", value: "Rp 550.000.000" },
  { label: "Rasio Lancar", value: "2.4" },
];

const liabilityInfo = [
  { label: "Liabilitas Jangka Pendek", value: "Rp 260.000.000" },
  { label: "Liabilitas Jangka Panjang", value: "Rp 320.000.000" },
  { label: "Rasio Hutang terhadap Ekuitas", value: "0.97" },
];

export default function NeracaReportPage() {
  const [activePeriod, setActivePeriod] = useState(
    periodPresets.find((preset) => preset.active)?.value ?? periodPresets[0].value
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 text-slate-900 dark:text-slate-100">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Neraca Sederhana</h1>
        <div className="flex items-center gap-4 flex-wrap">
          <SegmentedControl
            options={periodPresets}
            activeValue={activePeriod}
            onChange={setActivePeriod}
          />
          <Button
            type="button"
            variant="outline"
            className="hidden sm:inline-flex h-auto items-center gap-0 px-4 py-2 text-sm font-medium bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-700 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 focus-visible:ring-indigo-600 focus-visible:ring-2 focus-visible:ring-offset-2"
          >
            <CalendarDays className="h-4 w-4 mr-2 text-slate-500" />
            31 Desember 2023
          </Button>
          <div className="flex gap-2 flex-wrap">
            <Button
              type="button"
              variant="outline"
              className="inline-flex h-auto items-center gap-0 px-3 py-2 text-sm font-medium bg-white dark:bg-slate-900 border border-indigo-600 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-700"
            >
              <Download className="h-4 w-4 mr-2" />
              Ekspor PDF
            </Button>
            <Button
              type="button"
              className="inline-flex h-auto items-center gap-0 px-3 py-2 text-sm font-medium shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus-visible:ring-indigo-600 focus-visible:ring-2 focus-visible:ring-offset-2"
            >
              <Download className="h-4 w-4 mr-2" />
              Ekspor Excel
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <h3 className="text-lg font-bold">Laporan Posisi Keuangan</h3>
          <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 mt-2 sm:mt-0">
            <Info className="h-5 w-5 mr-1" />
            Per: 31 Desember 2023
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div className="space-y-6">
              <h4 className="text-sm font-bold uppercase tracking-wider">
                Aset
              </h4>
              <div className="space-y-4">
                {assets.map((item) => (
                  <div
                    key={item.label}
                    className="flex justify-between items-center text-sm"
                  >
                    <span>{item.label}</span>
                    <span className="font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <span className="font-bold">Total Aset</span>
                <span className="font-bold">Rp 1.175.000.000</span>
              </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-6">
                <h4 className="text-sm font-bold uppercase tracking-wider">
                  Liabilitas
                </h4>
                <div className="space-y-4">
                  {liabilities.map((item) => (
                    <div
                      key={item.label}
                      className="flex justify-between items-center text-sm"
                    >
                      <span>{item.label}</span>
                      <span className="font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
                  <span className="font-bold">Total Liabilitas</span>
                  <span className="font-bold">Rp 580.000.000</span>
                </div>
              </div>

              <div className="space-y-6">
                <h4 className="text-sm font-bold uppercase tracking-wider">
                  Ekuitas
                </h4>
                <div className="space-y-4">
                  {equity.map((item) => (
                    <div
                      key={item.label}
                      className="flex justify-between items-center text-sm"
                    >
                      <span>{item.label}</span>
                      <span className="font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
                  <span className="font-bold">Total Ekuitas</span>
                  <span className="font-bold">Rp 595.000.000</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <span className="font-bold">Total Liabilitas dan Ekuitas</span>
                <span className="font-bold">Rp 1.175.000.000</span>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-lime-100/60 dark:bg-green-900/10 p-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
            <div className="flex items-center gap-8 font-bold">
              <span>Total Aset</span>
              <span>Rp 1.175.000.000</span>
              <span>=</span>
              <span>Total Liabilitas + Ekuitas</span>
              <span>Rp 1.175.000.000</span>
            </div>
            <div className="flex items-center text-emerald-600 dark:text-emerald-400 font-medium">
              <CheckCircle2 className="h-5 w-5 mr-1" />
              Neraca Seimbang
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50/50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/30 p-6 flex gap-3">
        <HelpCircle className="h-6 w-6 text-blue-500 dark:text-blue-400 shrink-0" />
        <div>
          <h3 className="text-sm font-bold text-blue-700 dark:text-blue-300 mb-1">
            Catatan
          </h3>
          <p className="text-sm text-blue-600 dark:text-blue-400 leading-relaxed">
            Neraca ini menunjukkan posisi keuangan perusahaan pada tanggal 31
            Desember 2023. Total Aset harus sama dengan Total Liabilitas
            ditambah Ekuitas.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
          <h3 className="text-base font-bold mb-4">Informasi Aset</h3>
          <div className="space-y-3">
            {assetInfo.map((item) => (
              <div
                key={item.label}
                className="flex justify-between items-center text-sm"
              >
                <span className="text-slate-500 dark:text-slate-400">
                  {item.label}
                </span>
                <span className="font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
          <h3 className="text-base font-bold mb-4">Informasi Liabilitas</h3>
          <div className="space-y-3">
            {liabilityInfo.map((item) => (
              <div
                key={item.label}
                className="flex justify-between items-center text-sm"
              >
                <span className="text-slate-500 dark:text-slate-400">
                  {item.label}
                </span>
                <span className="font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ReportFooter updatedLabel="Terakhir diperbarui: 31 Desember 2023, 15:30" />
    </div>
  );
}
