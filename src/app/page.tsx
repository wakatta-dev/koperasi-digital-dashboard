import Link from 'next/link';

const modules = [
  { href: '/members', label: 'Manajemen Keanggotaan' },
  { href: '/savings', label: 'Manajemen Simpanan' },
  { href: '/loans', label: 'Manajemen Pinjaman' },
  { href: '/financing', label: 'Pembiayaan Syariah' },
  { href: '/shu', label: 'Manajemen SHU' },
  { href: '/rat', label: 'Rapat Anggota (RAT)' },
  { href: '/assets', label: 'Manajemen Aset' },
  { href: '/transactions', label: 'Manajemen Transaksi' },
  { href: '/notifications', label: 'Notifikasi & Pengingat' },
  { href: '/billing', label: 'Manajemen Billing' },
];

export default function Home() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Koperasi Digital Dashboard</h1>
      <p className="mb-6">
        Aplikasi ini menyediakan antarmuka dashboard untuk modul koperasi digital. Spesifikasi dan kebutuhan fitur terdapat pada dokumentasi produk di{' '}
        <code>docs/prd_dashboard_koperasi.md</code> dan{' '}
        <code>docs/prd_dashboard_billing.md</code>.
      </p>
      <ul className="list-disc pl-5 space-y-1">
        {modules.map((m) => (
          <li key={m.href}>
            <Link href={m.href} className="text-blue-600 underline">
              {m.label}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
