/** @format */

"use client";

import { useMemo, useState } from "react";

import { useAccountingSettingsCurrencies, useAccountingSettingsCurrencyMutations } from "@/hooks/queries";
import { toAccountingSettingsApiError } from "@/services/api/accounting-settings";

import { CURRENCY_ROWS } from "../../constants/settings-dummy";
import { FeatureAddCurrencyModal } from "../features/FeatureAddCurrencyModal";
import { FeatureCurrenciesSuccessToast } from "../features/FeatureCurrenciesSuccessToast";
import { FeatureCurrenciesTable } from "../features/FeatureCurrenciesTable";
import { mapCurrencyRows } from "../../utils/settings-api-mappers";

export function AccountingSettingsCurrenciesPage() {
  const currenciesQuery = useAccountingSettingsCurrencies({ page: 1, per_page: 20 });
  const { createCurrency, updateRates } = useAccountingSettingsCurrencyMutations();

  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const rows = useMemo(() => {
    if (!currenciesQuery.data?.items?.length) {
      return CURRENCY_ROWS;
    }

    return mapCurrencyRows(currenciesQuery.data.items);
  }, [currenciesQuery.data?.items]);

  const queryErrorMessage = currenciesQuery.error
    ? toAccountingSettingsApiError(currenciesQuery.error).message
    : null;
  const errorMessage = actionError ?? queryErrorMessage;

  const handleAddCurrency = async (payload: {
    currency_name: string;
    currency_code: string;
    symbol: string;
    exchange_rate: number;
    auto_rate_update_enabled: boolean;
  }) => {
    setActionError(null);
    try {
      await createCurrency.mutateAsync({ payload });
      setShowSuccessToast(true);
    } catch (err) {
      setActionError(toAccountingSettingsApiError(err).message);
    }
  };

  const handleUpdateRates = async () => {
    setActionError(null);
    try {
      await updateRates.mutateAsync();
    } catch (err) {
      setActionError(toAccountingSettingsApiError(err).message);
    }
  };

  return (
    <>
      {errorMessage ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      ) : null}

      <FeatureCurrenciesTable
        rows={rows}
        onUpdateRates={handleUpdateRates}
        onAddCurrency={() => setAddModalOpen(true)}
      />
      <FeatureAddCurrencyModal
        open={isAddModalOpen}
        onOpenChange={setAddModalOpen}
        onAddCurrency={handleAddCurrency}
      />
      <FeatureCurrenciesSuccessToast
        open={showSuccessToast}
        onClose={() => setShowSuccessToast(false)}
      />
    </>
  );
}
