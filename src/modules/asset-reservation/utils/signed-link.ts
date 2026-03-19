/** @format */

export async function createSignedReservationLink(args: {
  reservationId: string | number;
  status?: string;
  expiresAt?: string;
  guestToken?: string;
  basePath?: string;
}): Promise<{ url: string; token?: string }> {
  const basePath = args.basePath ?? "/penyewaan-aset/status";
  const guestToken = args.guestToken?.trim();

  if (!guestToken) {
    return { url: basePath };
  }

  const params = new URLSearchParams();
  params.set("id", String(args.reservationId));
  params.set("sig", guestToken);
  const normalizedStatus = (args.status ?? "").toLowerCase();
  if (normalizedStatus === "confirmed_full" || normalizedStatus === "completed") {
    params.set("state", "done");
  } else {
    params.set("state", "dp");
  }
  return { url: `${basePath}?${params.toString()}`, token: guestToken };
}
