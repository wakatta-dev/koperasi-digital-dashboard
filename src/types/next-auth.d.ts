/** @format */

import { User } from "@/lib/types";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: User & {
      jenis_tenant?: string;
    };
    accessToken?: string;
    error?: string;
    jenis_tenant?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    email?: string;
    name?: string;
    role?: string;
    jenis_tenant?: string;
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    error?: string;
    exp?: number; // bawaan jwt decode
  }
}
