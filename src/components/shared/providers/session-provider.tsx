'use client';

import { SessionProvider, useSession } from 'next-auth/react';
import { useEffect, useRef } from 'react';
import { logout as doLogout } from '@/services/auth';

function SessionErrorHandler() {
  const { data: session, status } = useSession();
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    if (
      status === 'authenticated' &&
      (session as any)?.error === 'RefreshAccessTokenError'
    ) {
      handled.current = true;
      // Fire and forget logout to clear cookies and NextAuth state
      void doLogout();
    }
  }, [status, session]);

  return null;
}

export default function SessionProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <SessionErrorHandler />
      {children}
    </SessionProvider>
  );
}
