/** @format */

import type { NextConfig } from "next";

type ImageRemotePattern = {
  protocol: "http" | "https";
  hostname: string;
  port?: string;
};

const envImageUrls = [
  process.env.NEXT_PUBLIC_API_URL,
  process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
    ? `https://${process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}`
    : undefined,
].filter(Boolean) as string[];

const envRemotePatterns: ImageRemotePattern[] = envImageUrls
  .map((url): ImageRemotePattern | null => {
    try {
      const parsed = new URL(url);
      const protocol = parsed.protocol.replace(":", "");
      if (protocol !== "http" && protocol !== "https") {
        return null;
      }
      return {
        protocol,
        hostname: parsed.hostname,
        ...(parsed.port ? { port: parsed.port } : {}),
      };
    } catch {
      return null;
    }
  })
  .filter((pattern): pattern is ImageRemotePattern => Boolean(pattern));

const baseRemotePatterns: ImageRemotePattern[] = [
  { protocol: "https", hostname: "lh3.googleusercontent.com" },
  { protocol: "https", hostname: "firebasestorage.googleapis.com" },
  { protocol: "https", hostname: "*.firebasestorage.app" },
  { protocol: "http", hostname: "localhost" },
  { protocol: "http", hostname: "127.0.0.1" },
];

const remotePatterns = [...baseRemotePatterns, ...envRemotePatterns].filter(
  (pattern, index, list) =>
    index ===
    list.findIndex(
      (item) =>
        item.protocol === pattern.protocol &&
        item.hostname === pattern.hostname &&
        item.port === pattern.port
    )
) as ImageRemotePattern[];

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL_INTERNAL: process.env.NEXTAUTH_URL_INTERNAL,
  },
  images: {
    remotePatterns:
      remotePatterns as NonNullable<NextConfig["images"]>["remotePatterns"],
  },
};

export default nextConfig;
