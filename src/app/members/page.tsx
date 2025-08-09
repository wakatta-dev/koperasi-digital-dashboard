'use client';

import api from '@/services/api';
import { useEffect, useState } from 'react';

interface Member {
  id: number;
  name: string;
}

export default function Members() {
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    api.get('/members').then((res) => setMembers(res.data));
  }, []);

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Daftar Anggota</h1>
      <ul>
        {members.map((m) => (
          <li key={m.id}>{m.name}</li>
        ))}
      </ul>
    </main>
  );
}
