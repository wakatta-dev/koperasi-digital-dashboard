/** @format */

type ReportingAccountLedgerPageProps = {
  accountId?: string;
  preset?: string;
  start?: string;
  end?: string;
  branch?: string;
};

export function ReportingAccountLedgerPage({ accountId }: ReportingAccountLedgerPageProps) {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Account Ledger</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Account ledger detail {accountId ? `for ${accountId}` : "for selected account"}.
      </p>
    </div>
  );
}
