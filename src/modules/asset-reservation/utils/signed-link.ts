/** @format */

const SIGN_SECRET = "asset-rental-signature-v1";

type Payload = {
  id: string;
  status?: string;
  exp?: string;
};

async function sha256(input: string): Promise<string> {
  if (typeof crypto === "undefined" || !crypto.subtle) {
    return input;
  }
  const data = new TextEncoder().encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function toBase64(data: string) {
  if (typeof window !== "undefined" && window.btoa) {
    return window.btoa(data);
  }
  const buffer = typeof Buffer !== "undefined" ? Buffer : undefined;
  if (buffer) {
    return buffer.from(data, "utf-8").toString("base64");
  }
  return data;
}

function fromBase64(data: string) {
  if (typeof window !== "undefined" && window.atob) {
    return window.atob(data);
  }
  const buffer = typeof Buffer !== "undefined" ? Buffer : undefined;
  if (buffer) {
    return buffer.from(data, "base64").toString("utf-8");
  }
  return data;
}

export async function createSignedReservationLink(args: {
  reservationId: string | number;
  status?: string;
  expiresAt?: string;
  basePath?: string;
}): Promise<{ url: string; token: string; signature: string }> {
  const payload: Payload = {
    id: String(args.reservationId),
    status: args.status,
    exp: args.expiresAt,
  };
  const raw = JSON.stringify(payload);
  const token = toBase64(raw);
  const signature = await sha256(token + SIGN_SECRET);
  const basePath = args.basePath ?? "/penyewaan-aset/status";
  const url = `${basePath}/${encodeURIComponent(token)}?sig=${encodeURIComponent(signature)}`;
  return { url, token, signature };
}

export async function verifySignedReservationToken(
  token?: string,
  signature?: string
): Promise<{ ok: boolean; payload?: Payload; reason?: string; expired?: boolean }> {
  if (!token) return { ok: false, reason: "Token tidak tersedia" };
  const expected = await sha256(token + SIGN_SECRET);
  if (!signature || signature !== expected) {
    return { ok: false, reason: "Tautan tidak valid atau sudah diubah" };
  }
  try {
    const payload = JSON.parse(fromBase64(token)) as Payload;
    if (!payload.id) {
      return { ok: false, reason: "Payload tidak lengkap" };
    }
    if (payload.exp) {
      const expTs = new Date(payload.exp).getTime();
      if (Number.isFinite(expTs) && Date.now() > expTs) {
        return { ok: false, reason: "Tautan sudah kedaluwarsa", expired: true };
      }
    }
    return { ok: true, payload };
  } catch (_err) {
    return { ok: false, reason: "Gagal membaca token" };
  }
}
