import { GetServerSideProps } from 'next';
import { useState, useEffect } from 'react';
import { authFetch } from '../utils/authFetch';

interface User {
  id: string;
  email: string;
  full_name: string;
}

interface PaginationMeta {
  pagination: {
    next_cursor: string | null;
    prev_cursor: string | null;
    has_next: boolean;
    has_prev: boolean;
    limit: number;
  };
}

interface Props {
  initialUsers: User[];
  initialMeta: PaginationMeta;
}

export default function UsersPage({ initialUsers, initialMeta }: Props) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [meta, setMeta] = useState<PaginationMeta>(initialMeta);
  const [cursor, setCursor] = useState<string | null>(null);

  useEffect(() => {
    if (cursor === null) return;
    const fetchUsers = async () => {
      const res = await authFetch(`/api/users?cursor=${cursor}`);
      const json = await res.json();
      setUsers((u) => [...u, ...json.data]);
      setMeta(json.meta);
    };
    fetchUsers();
  }, [cursor]);

  return (
    <div>
      <h1>Daftar Pengguna</h1>
      <ul>
        {users.map((u) => (
          <li key={u.id}>{u.full_name} ({u.email})</li>
        ))}
      </ul>
      <button
        onClick={() => setCursor(meta.pagination.next_cursor)}
        disabled={!meta.pagination.has_next}
      >
        Next
      </button>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const token = req.cookies?.access_token;
  if (!token) {
    return { redirect: { destination: '/login', permanent: false } };
  }
  const res = await fetch('http://localhost:8080/api/users', {
    headers: {
      Authorization: `Bearer ${token}`,
      'X-Tenant-ID': req.cookies?.tenant_id || ''
    }
  });
  if (!res.ok) {
    return { props: { initialUsers: [], initialMeta: { pagination: { next_cursor: null, prev_cursor: null, has_next: false, has_prev: false, limit: 10 } } } };
  }
  const json = await res.json();
  return { props: { initialUsers: json.data, initialMeta: json.meta } };
};
