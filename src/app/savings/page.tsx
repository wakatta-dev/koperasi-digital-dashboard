import Link from 'next/link';

export default function Savings() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Manajemen Simpanan</h1>
      <p className="mb-6">
        Placeholder untuk modul simpanan sesuai spesifikasi <code>docs/prd_dashboard_koperasi.md</code>.
      </p>
      <Link href="/savings/syariah" className="text-blue-600 underline">
        Simpanan Syariah
      </Link>
    </main>
  );
}
