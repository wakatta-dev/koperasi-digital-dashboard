/** @format */

import { redirect } from "next/navigation";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function InventoryDetailRoutePage({ params }: PageProps) {
  const paramsResolved = await params;
  redirect(`/bumdes/marketplace/inventory/${paramsResolved.id}`);
}
