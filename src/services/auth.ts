/** @format */

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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
      const { getSession } = await import("next-auth/react");
      const session: any = await getSession();
      return session?.accessToken ?? null;
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
    if (typeof window !== "undefined") {
      const match = document.cookie.match(/(?:^|; )refresh_token=([^;]+)/);
      rt = match ? decodeURIComponent(match[1]) : null;
    } else {
      try {
        const { cookies } = await import("next/headers");
        rt = (await cookies()).get("refresh_token")?.value ?? null;
      } catch {
        rt = null;
      }
    }

    if (!rt) {
      if (typeof window !== "undefined") {
        const { getSession } = await import("next-auth/react");
        const session: any = await getSession();
        rt = session?.refreshToken ?? null;
      } else {
        const { getServerSession } = await import("next-auth");
        const { authOptions } = await import("@/lib/authOptions");
        const session: any = await getServerSession(authOptions);
        rt = session?.refreshToken ?? null;
      }
    }

    if (!rt) return null;

    const res = await fetch(`${API_URL}/api/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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

    return data.access_token as string;
  } catch {
    return null;
  }
}
