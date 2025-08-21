/** @format */
import { AuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { decodeJwt } from "jose"; // ✅ lebih aman dari manual base64 decode
import { getTenantId } from "@/services/api";
import { NEXTAUTH_SECRET } from "@/lib/env";

export async function refreshAccessToken(token: any) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: token.refreshToken }),
      }
    );

    const json = await res.json().catch(() => null);
    const data = json?.data;

    if (!res.ok || !data) throw new Error("Refresh token failed");

    const decoded: any = decodeJwt(data.access_token);

    return {
      ...token,
      accessToken: data.access_token,
      accessTokenExpires: decoded?.exp
        ? decoded.exp * 1000
        : Date.now() + 15 * 60 * 1000, // fallback 15 menit
      refreshToken: data.refresh_token ?? token.refreshToken,
      error: undefined,
    };
  } catch (err) {
    console.error("refreshAccessToken error:", err);
    return { ...token, error: "RefreshAccessTokenError" };
  }
}

export const authOptions: AuthOptions = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const tenantId = await getTenantId();

        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "X-Tenant-ID": tenantId ?? "", // ✅ tenant ikut header
              },
              body: JSON.stringify({
                email: credentials?.email,
                password: credentials?.password,
              }),
            }
          );

          const json = await res.json().catch(() => null);
          const data = json?.data;
          if (!res.ok || !data) return null;

          const decoded: any = decodeJwt(data.access_token);

          return {
            id: data.id,
            email: data.email,
            name: data.nama,
            role: data.role,
            jenis_tenant: data.jenis_tenant,
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            accessTokenExpires: decoded?.exp
              ? decoded.exp * 1000
              : Date.now() + 15 * 60 * 1000,
          };
        } catch (err) {
          console.error("authorize error:", err);
          return null;
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      // Saat login pertama kali
      if (user) return { ...token, ...user };

      // Jika access token masih valid, return existing token
      if (Date.now() < (token as any).accessTokenExpires) return token;

      // Kalau sudah expired, refresh
      return await refreshAccessToken(token);
    },

    async session({ session, token }) {
      session.user = {
        id: (token as any).id,
        email: (token as any).email,
        name: (token as any).name,
        role: (token as any).role,
        jenis_tenant: (token as any).jenis_tenant,
      };
      (session as any).accessToken = (token as any).accessToken;
      (session as any).error = (token as any).error;
      return session;
    },
  },

  pages: {
    signIn: "/auth/login",
    signOut: "/auth/login",
  },

  // Use a constant secret to prevent runtime decryption errors
  secret: NEXTAUTH_SECRET,
};
