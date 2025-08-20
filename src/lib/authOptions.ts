/** @format */

import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { cookies } from "next/headers";

function decodeJwt(token: string) {
  const payload = token.split(".")[1];
  return JSON.parse(Buffer.from(payload, "base64").toString());
}

async function refreshAccessToken(token: any) {
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
    if (!res.ok || !data) {
      throw new Error("Refresh token failed");
    }

    const decoded = decodeJwt(data.access_token);
    return {
      ...token,
      accessToken: data.access_token,
      accessTokenExpires: decoded.exp * 1000,
      refreshToken: data.refresh_token ?? token.refreshToken,
    };
  } catch {
    return { ...token, error: "RefreshAccessTokenError" };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
            {
              method: "post",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: credentials?.email,
                password: credentials?.password,
              }),
            }
          );

          const json = await res.json().catch(() => null);
          const data = json?.data;
          if (!res.ok || !data) {
            return null;
          }

          (await cookies()).set("refresh_token", data.refresh_token, {
            httpOnly: true,
            path: "/",
            sameSite: "strict",
          });

          const decoded = decodeJwt(data.access_token);

          return {
            ...data.user,
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            accessTokenExpires: decoded.exp * 1000,
          } as any;
        } catch {
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
      if (user) {
        return { ...token, ...user };
      }

      if (Date.now() < (token as any).accessTokenExpires) {
        return token;
      }

      return await refreshAccessToken(token);
    },
    session({ session, token }) {
      (session as any).user = token;
      (session as any).accessToken = (token as any).accessToken;
      return session;
    },
  },
  pages: {
    // signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
