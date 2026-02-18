/** @format */

type TaxPpnDetailsPageProps = {
  period?: string;
  returnToQuery?: string;
};

export function TaxPpnDetailsPage({
  period,
  returnToQuery,
}: TaxPpnDetailsPageProps) {
  void period;
  void returnToQuery;

  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Detail Transaksi PPN (VAT)</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Review detailed list of all transactions subject to VAT.
      </p>
    </div>
  );
}
