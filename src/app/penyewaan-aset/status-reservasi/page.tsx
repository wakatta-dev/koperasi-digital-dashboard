/** @format */

import { redirect } from "next/navigation";

type StatusReservationRouteProps = {
  searchParams?: Promise<{ state?: string; sig?: string; id?: string }>;
};

export default async function StatusReservasiPage({
  searchParams,
}: StatusReservationRouteProps) {
  const searchParamsResolved = await searchParams;
  const nextParams = new URLSearchParams();

  if (searchParamsResolved?.id) nextParams.set("id", searchParamsResolved.id);
  if (searchParamsResolved?.sig) nextParams.set("sig", searchParamsResolved.sig);
  if (searchParamsResolved?.state) nextParams.set("state", searchParamsResolved.state);

  const query = nextParams.toString();
  redirect(
    query
      ? `/penyewaan-aset/status?${query}`
      : "/penyewaan-aset/status",
  );
}
