/** @format */

import type { NextConfig } from "next";
import { env } from "./src/lib/env";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_BASE_URL: env.NEXT_PUBLIC_BASE_URL,
    NEXTAUTH_URL: env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: env.NEXTAUTH_SECRET,
    NEXTAUTH_URL_INTERNAL: env.NEXTAUTH_URL_INTERNAL,
  },
};

export default nextConfig;
