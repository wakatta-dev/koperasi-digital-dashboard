/** @format */

import { listTransactionsAction } from "@/actions/transactions";
import { TransactionsList } from "@/components/feature/koperasi/transactions/transactions-list";

export const dynamic = "force-dynamic";

export default async function TransaksiPage() {
  const txs = await listTransactionsAction({ limit: 50 }).catch(() => []);
  return <TransactionsList initialData={txs ?? []} />;
}

