/** @format */

"use client";

import { Button } from "@/components/ui/button";

type SubmissionSuccessCardFeatureProps = Readonly<{
  ticket: string;
  homeHref: string;
}>;

export function SubmissionSuccessCardFeature({
  ticket,
  homeHref,
}: SubmissionSuccessCardFeatureProps) {
  return (
    <section className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full space-y-8 bg-white dark:bg-surface-card-dark p-10 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 text-center">
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-2">
            <span className="material-symbols-outlined text-6xl text-green-600 dark:text-green-400">
              check_circle
            </span>
          </div>
        </div>

        <div>
          <h2 className="mt-4 text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Pengajuan Berhasil Dikirim!
          </h2>

          <div className="mt-6 inline-block bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-6 py-4 shadow-sm">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Nomor Pengajuan
            </p>
            <p className="text-3xl font-bold text-brand-primary mt-1 tracking-wider font-mono">
              {ticket}
            </p>
          </div>

          <p className="mt-6 text-base text-gray-500 dark:text-gray-400 leading-relaxed">
            Simpan nomor pengajuan ini. Admin kami akan menghubungi Anda melalui
            WA/Email untuk langkah verifikasi selanjutnya.
          </p>
        </div>

        <div className="pt-4">
          <Button
            asChild
            className="w-full inline-flex justify-center items-center gap-2 px-6 py-3.5 border border-transparent text-base font-medium rounded-xl text-white bg-brand-primary hover:bg-brand-primary-hover shadow-lg shadow-indigo-600/30 transition-all focus-visible:ring-2 focus-visible:ring-brand-primary"
          >
            <a href={homeHref}>
              <span className="material-symbols-outlined">home</span>
              Kembali ke Beranda
            </a>
          </Button>

          <p className="mt-6 text-xs text-gray-500 dark:text-gray-400">
            Butuh bantuan?{" "}
            <a className="font-medium text-brand-primary hover:text-brand-primary-hover" href="#">
              Hubungi Support
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}

