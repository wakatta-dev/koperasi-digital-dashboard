/** @format */

import Link from "next/link";

export default function MainPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-4 text-center">
      <h1 className="text-3xl font-bold">Koperasi Digital Dashboard</h1>
      <p>Platform untuk mengelola koperasi secara efektif dan modern.</p>
      <p className="max-w-md">
        Informasi harga: Silakan hubungi kami untuk paket keanggotaan dan layanan lainnya.
      </p>
      <Link href="/login" className="text-blue-600 underline">
        Masuk ke aplikasi
      </Link>
    </main>
  );
}

