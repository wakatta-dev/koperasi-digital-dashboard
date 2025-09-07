/** @format */

import { listTransactionsAction } from "@/actions/transactions";
import { TransactionsList } from "@/components/feature/koperasi/transactions/transactions-list";
import { CashbookPanel } from "@/components/feature/koperasi/cashbook/cashbook-panel";

export const dynamic = "force-dynamic";

export default async function TransaksiPage() {
  const txs = await listTransactionsAction({ limit: 10 }).catch(() => []);
  return (
    <div className="space-y-6">
      <CashbookPanel />
      <TransactionsList initialData={txs ?? []} />
    </div>
  );
}
