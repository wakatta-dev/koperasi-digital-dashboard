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
    <ul>
      {members.map((m) => (
        <li key={m.id}>{m.name}</li>
      ))}
    </ul>
  );
}
