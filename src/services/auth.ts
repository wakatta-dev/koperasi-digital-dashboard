/** @format */

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type ClientSessionCache = {
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
};

let clientSessionCache: ClientSessionCache | null = null;
let clientSessionPromise: Promise<ClientSessionCache | null> | null = null;

function parseExpiry(value: unknown): number | null {
  if (!value) return null;
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }
  const numeric = Date.parse(String(value));
  return Number.isNaN(numeric) ? null : numeric;
}

function setClientSessionCache(session: any): ClientSessionCache | null {
  if (!session) {
    clientSessionCache = null;
    return null;
  }

  const expiresAt = parseExpiry(session.expires);

  clientSessionCache = {
    accessToken: session?.accessToken ?? session?.access_token ?? null,
    refreshToken: session?.refreshToken ?? session?.refresh_token ?? null,
    expiresAt,
  };

  return clientSessionCache;
}

function resetClientSessionCache() {
  clientSessionCache = null;
  clientSessionPromise = null;
}

function getValidClientSessionCache(): ClientSessionCache | null {
  if (!clientSessionCache) return null;
  const { expiresAt, accessToken } = clientSessionCache;
  if (!accessToken) return null;
  if (!expiresAt) return clientSessionCache;
  const CLOCK_SKEW = 30_000; // refresh slightly before expiry
  if (expiresAt - CLOCK_SKEW > Date.now()) {
    return clientSessionCache;
  }
  return null;
}

async function loadClientSession(): Promise<ClientSessionCache | null> {
  const { getSession } = await import("next-auth/react");
  const session = await getSession();
  return setClientSessionCache(session);
}

async function ensureClientSession(): Promise<ClientSessionCache | null> {
  const cached = getValidClientSessionCache();
  if (cached) {
    return cached;
  }

  if (!clientSessionPromise) {
    clientSessionPromise = (async () => {
      try {
        return await loadClientSession();
      } finally {
        clientSessionPromise = null;
      }
    })();
  }

  return clientSessionPromise;
}

export async function login(email: string, password: string) {
  const { signIn } = await import("next-auth/react");
  const res = await signIn("credentials", {
    redirect: false,
    email,
    password,
  });
  if (res?.error) {
    throw new Error(res.error);
  }
  return res;
}

export async function logout() {
  // Try to read refresh_token from cookie/session similar to refreshToken()
  let rt: string | null = null;
  try {
    if (typeof window !== "undefined") {
      const match = document.cookie.match(/(?:^|; )refresh_token=([^;]+)/);
      rt = match ? decodeURIComponent(match[1]) : null;
    } else {
      const { cookies } = await import("next/headers");
      rt = (await cookies()).get("refresh_token")?.value ?? null;
    }
  } catch {
    rt = null;
  }

  await fetch(`${API_URL}/api/auth/logout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(rt ? { refresh_token: rt } : {}),
    credentials: "include",
  }).catch(() => null);
  resetClientSessionCache();
  if (typeof window !== "undefined") {
    document.cookie =
      "refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    const { signOut } = await import("next-auth/react");
    await signOut({ callbackUrl: "/login" });
  }
}

export async function getAccessToken(): Promise<string | null> {
  try {
    if (typeof window !== "undefined") {
      const sessionCache = await ensureClientSession();
      return sessionCache?.accessToken ?? null;
    }
    const { getServerSession } = await import("next-auth");
    const { authOptions } = await import("@/lib/authOptions");
    const session: any = await getServerSession(authOptions);
    return session?.accessToken ?? null;
  } catch {
    return null;
  }
}

export async function refreshToken(): Promise<string | null> {
  try {
    let rt: string | null = null;
    let tenantId: string | null = null;
    if (typeof window !== "undefined") {
      const match = document.cookie.match(/(?:^|; )refresh_token=([^;]+)/);
      rt = match ? decodeURIComponent(match[1]) : null;
      const tenantMatch = document.cookie.match(/(?:^|; )tenantId=([^;]+)/);
      tenantId = tenantMatch ? decodeURIComponent(tenantMatch[1]) : null;
    } else {
      try {
        const { cookies } = await import("next/headers");
        const cookieStore = await cookies();
        rt = cookieStore.get("refresh_token")?.value ?? null;
        tenantId = cookieStore.get("tenantId")?.value ?? null;
      } catch {
        rt = null;
        tenantId = null;
      }
    }

    if (!rt) {
      if (typeof window !== "undefined") {
        const sessionCache = await ensureClientSession();
        rt = sessionCache?.refreshToken ?? null;
      } else {
        const { getServerSession } = await import("next-auth");
        const { authOptions } = await import("@/lib/authOptions");
        const session: any = await getServerSession(authOptions);
        rt = session?.refreshToken ?? null;
      }
    }

    if (!rt) return null;

    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (!headers.Accept) {
      headers.Accept = "application/json";
    }
    if (!tenantId) {
      tenantId = process.env.NEXT_PUBLIC_TENANT_ID ?? null;
    }
    if (tenantId) {
      headers["X-Tenant-ID"] = tenantId;
    }

    const res = await fetch(`${API_URL}/api/auth/refresh`, {
      method: "POST",
      headers,
      body: JSON.stringify({ refresh_token: rt }),
      credentials: "include",
    });

    const json = await res.json().catch(() => null);
    const data = json?.data;
    if (!res.ok || !data?.access_token) return null;

    if (data.refresh_token) {
      if (typeof window !== "undefined") {
        document.cookie = `refresh_token=${data.refresh_token}; path=/`;
      } else {
        try {
          const { cookies } = await import("next/headers");
          (await cookies()).set("refresh_token", data.refresh_token, {
            path: "/",
          });
        } catch {
          /* noop */
        }
      }
    }

    if (typeof window !== "undefined") {
      const expiresAt = clientSessionCache?.expiresAt ?? (Date.now() + 5 * 60_000);
      clientSessionCache = {
        accessToken: data.access_token,
        refreshToken: data.refresh_token ?? clientSessionCache?.refreshToken ?? null,
        expiresAt,
      };
    }

    return data.access_token as string;
  } catch {
    return null;
  }
}
