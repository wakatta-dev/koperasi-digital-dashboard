/** @format */

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Tenant Not Found - Koperasi Digital",
  description: "Tenant not found page.",
};

export default function TenantNotFound() {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center bg-muted/30 p-6 text-center"
      data-testid="guest-tenant-not-found-page-root"
    >
      <h1 className="mb-4 text-3xl font-bold">
        Organisasi tidak ditemukan
      </h1>
      <p className="mb-8 max-w-md text-muted-foreground">
        Domain yang Anda akses belum terdaftar. Silakan hubungi administrator
        untuk informasi lebih lanjut.
      </p>
      <Link href="/login">
        <span className="inline-flex rounded-md bg-indigo-600 px-6 py-2 text-white shadow transition hover:bg-indigo-700">
          Kembali ke Login
        </span>
      </Link>
    </div>
  );
}
