/** @format */

import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function handle(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;

  const target = `${API_URL}/api/${resolvedParams?.path?.join("/")}${
    req?.nextUrl?.search
  }`;

  const headers: HeadersInit = {};
  const auth = req.headers.get("authorization");
  if (auth) headers["Authorization"] = auth;
  if (req.headers.get("content-type"))
    headers["Content-Type"] = req.headers.get("content-type") as string;
  const cookie = req.headers.get("cookie");
  if (cookie) headers["Cookie"] = cookie;

  const body =
    req.method === "GET" || req.method === "HEAD"
      ? undefined
      : await req.text();

  const res = await fetch(target, {
    method: req.method,
    headers,
    body,
  });

  const data = await res.json().catch(() => null);
  const nextRes = NextResponse.json(data, { status: res.status });
  res.headers.forEach((value, key) => {
    if (key.toLowerCase() === "set-cookie") {
      nextRes.headers.append("set-cookie", value);
    }
  });
  return nextRes;
}

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> }
) {
  return handle(req, ctx);
}
export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> }
) {
  return handle(req, ctx);
}
export async function PUT(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> }
) {
  return handle(req, ctx);
}
export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> }
) {
  return handle(req, ctx);
}
export async function DELETE(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> }
) {
  return handle(req, ctx);
}
