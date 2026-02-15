/** @format */

export async function createSignedReservationLink(args: {
  reservationId: string | number;
  status?: string;
  expiresAt?: string;
  guestToken?: string;
  basePath?: string;
}): Promise<{ url: string; token?: string }> {
  const basePath = args.basePath ?? "/penyewaan-aset/status-reservasi";
  const params = new URLSearchParams();
  params.set("id", String(args.reservationId));
  if (args.guestToken) {
    params.set("sig", args.guestToken);
  }
  if ((args.status ?? "").toLowerCase() === "confirmed_full") {
    params.set("state", "done");
  } else {
    params.set("state", "dp");
  }
  return { url: `${basePath}?${params.toString()}`, token: args.guestToken };
}
