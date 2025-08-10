/** @format */

import { fetchMembers, Member } from "@/actions/members";

export default async function Members() {
  const members: Member[] = await fetchMembers();

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Daftar Anggota</h1>
      <ul>
        {members?.map((m) => (
          <li key={m.id}>{m.membership_number}</li>
        ))}
      </ul>
    </main>
  );
}
