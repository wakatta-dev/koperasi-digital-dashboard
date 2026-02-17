/** @format */

import { API_ENDPOINTS } from "@/constants/api";
import type { ApiResponse } from "@/types/api";
import type {
  AccountingSettingsAnalyticAccountListQuery,
  AccountingSettingsAnalyticAccountListResponse,
  AccountingSettingsBudgetListQuery,
  AccountingSettingsBudgetListResponse,
  AccountingSettingsCoaListQuery,
  AccountingSettingsCoaListResponse,
  AccountingSettingsCreateAnalyticAccountRequest,
  AccountingSettingsCreateAnalyticAccountResponse,
  AccountingSettingsCreateBudgetRequest,
  AccountingSettingsCreateBudgetResponse,
  AccountingSettingsCreateCoaRequest,
  AccountingSettingsCreateCoaResponse,
  AccountingSettingsCreateCurrencyRequest,
  AccountingSettingsCreateCurrencyResponse,
  AccountingSettingsCreateTaxRequest,
  AccountingSettingsCreateTaxResponse,
  AccountingSettingsCurrencyListQuery,
  AccountingSettingsCurrencyListResponse,
  AccountingSettingsDeleteBudgetResponse,
  AccountingSettingsDeleteCoaResponse,
  AccountingSettingsDeleteTaxResponse,
  AccountingSettingsDuplicateTaxRequest,
  AccountingSettingsDuplicateTaxResponse,
  AccountingSettingsOverviewResponse,
  AccountingSettingsTaxListQuery,
  AccountingSettingsTaxListResponse,
  AccountingSettingsToggleAutoRateRequest,
  AccountingSettingsToggleAutoRateResponse,
  AccountingSettingsToggleTaxStatusRequest,
  AccountingSettingsToggleTaxStatusResponse,
  AccountingSettingsUpdateAnalyticAccountRequest,
  AccountingSettingsUpdateAnalyticAccountResponse,
  AccountingSettingsUpdateBudgetRequest,
  AccountingSettingsUpdateBudgetResponse,
  AccountingSettingsUpdateCoaRequest,
  AccountingSettingsUpdateCoaResponse,
  AccountingSettingsUpdateCurrencyRequest,
  AccountingSettingsUpdateCurrencyResponse,
  AccountingSettingsUpdateRatesRequest,
  AccountingSettingsUpdateRatesResponse,
  AccountingSettingsUpdateTaxRequest,
  AccountingSettingsUpdateTaxResponse,
} from "@/types/api/accounting-settings";

import { API_PREFIX, api } from "./base";

const E = API_ENDPOINTS.accountingSettings;

function buildQuery(params?: Record<string, unknown>) {
  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(params ?? {})) {
    if (value === undefined || value === null || value === "") continue;
    if (Array.isArray(value)) {
      value.forEach((item) => search.append(key, String(item)));
      continue;
    }
    search.set(key, String(value));
  }

  const query = search.toString();
  return query ? `?${query}` : "";
}

function buildAccountingSettingsErrorMessage<T>(res: ApiResponse<T>): string {
  const flattened =
    Object.entries(res.errors ?? {})
      .flatMap(([, errs]) => errs)
      .filter(Boolean)
      .join("; ") || "";

  return flattened || res.message || "Accounting settings request failed.";
}

function inferAccountingSettingsStatusCode<T>(res: ApiResponse<T>): number {
  if (typeof res.meta?.status_code === "number" && res.meta.status_code > 0) {
    return res.meta.status_code;
  }

  return 500;
}

export class AccountingSettingsApiError extends Error {
  readonly statusCode: number;
  readonly response?: ApiResponse<unknown>;

  constructor(params: {
    message: string;
    statusCode: number;
    response?: ApiResponse<unknown>;
  }) {
    super(params.message);
    this.name = "AccountingSettingsApiError";
    this.statusCode = params.statusCode;
    this.response = params.response;
  }
}

export function ensureAccountingSettingsSuccess<T>(res: ApiResponse<T>): T {
  if (res.success) {
    return res.data as T;
  }

  throw new AccountingSettingsApiError({
    message: buildAccountingSettingsErrorMessage(res),
    statusCode: inferAccountingSettingsStatusCode(res),
    response: res as ApiResponse<unknown>,
  });
}

export function toAccountingSettingsApiError(err: unknown): AccountingSettingsApiError {
  if (err instanceof AccountingSettingsApiError) {
    return err;
  }

  if (err instanceof Error) {
    return new AccountingSettingsApiError({
      message: err.message,
      statusCode: 500,
    });
  }

  return new AccountingSettingsApiError({
    message: "Accounting settings request failed.",
    statusCode: 500,
  });
}

export function getAccountingSettingsOverview(opts?: { signal?: AbortSignal }) {
  return api.get<AccountingSettingsOverviewResponse>(`${API_PREFIX}${E.overview}`, {
    signal: opts?.signal,
  });
}

export function listAccountingSettingsCoa(
  params?: AccountingSettingsCoaListQuery,
  opts?: { signal?: AbortSignal }
): Promise<ApiResponse<AccountingSettingsCoaListResponse>> {
  const query = buildQuery(params);
  return api.get<AccountingSettingsCoaListResponse>(`${API_PREFIX}${E.coa}${query}`, {
    signal: opts?.signal,
  });
}

export function createAccountingSettingsCoa(
  payload: AccountingSettingsCreateCoaRequest,
  opts?: { idempotencyKey?: string }
): Promise<ApiResponse<AccountingSettingsCreateCoaResponse>> {
  const headers = opts?.idempotencyKey
    ? {
        "Idempotency-Key": opts.idempotencyKey,
      }
    : undefined;

  return api.post<AccountingSettingsCreateCoaResponse>(
    `${API_PREFIX}${E.coa}`,
    payload,
    headers ? { headers } : undefined
  );
}

export function updateAccountingSettingsCoa(
  accountCode: string,
  payload: AccountingSettingsUpdateCoaRequest
): Promise<ApiResponse<AccountingSettingsUpdateCoaResponse>> {
  return api.put<AccountingSettingsUpdateCoaResponse>(
    `${API_PREFIX}${E.coaItem(accountCode)}`,
    payload
  );
}

export function deleteAccountingSettingsCoa(
  accountCode: string
): Promise<ApiResponse<AccountingSettingsDeleteCoaResponse>> {
  return api.delete<AccountingSettingsDeleteCoaResponse>(`${API_PREFIX}${E.coaItem(accountCode)}`);
}

export function listAccountingSettingsTaxes(
  params?: AccountingSettingsTaxListQuery,
  opts?: { signal?: AbortSignal }
): Promise<ApiResponse<AccountingSettingsTaxListResponse>> {
  const query = buildQuery(params);
  return api.get<AccountingSettingsTaxListResponse>(`${API_PREFIX}${E.taxes}${query}`, {
    signal: opts?.signal,
  });
}

export function createAccountingSettingsTax(
  payload: AccountingSettingsCreateTaxRequest,
  opts?: { idempotencyKey?: string }
): Promise<ApiResponse<AccountingSettingsCreateTaxResponse>> {
  const headers = opts?.idempotencyKey
    ? {
        "Idempotency-Key": opts.idempotencyKey,
      }
    : undefined;

  return api.post<AccountingSettingsCreateTaxResponse>(
    `${API_PREFIX}${E.taxes}`,
    payload,
    headers ? { headers } : undefined
  );
}

export function updateAccountingSettingsTax(
  taxId: string,
  payload: AccountingSettingsUpdateTaxRequest
): Promise<ApiResponse<AccountingSettingsUpdateTaxResponse>> {
  return api.put<AccountingSettingsUpdateTaxResponse>(`${API_PREFIX}${E.taxItem(taxId)}`, payload);
}

export function toggleAccountingSettingsTaxStatus(
  taxId: string,
  payload: AccountingSettingsToggleTaxStatusRequest
): Promise<ApiResponse<AccountingSettingsToggleTaxStatusResponse>> {
  return api.patch<AccountingSettingsToggleTaxStatusResponse>(
    `${API_PREFIX}${E.taxStatus(taxId)}`,
    payload
  );
}

export function duplicateAccountingSettingsTax(
  taxId: string,
  payload?: AccountingSettingsDuplicateTaxRequest
): Promise<ApiResponse<AccountingSettingsDuplicateTaxResponse>> {
  return api.post<AccountingSettingsDuplicateTaxResponse>(
    `${API_PREFIX}${E.taxDuplicate(taxId)}`,
    payload ?? {}
  );
}

export function deleteAccountingSettingsTax(
  taxId: string
): Promise<ApiResponse<AccountingSettingsDeleteTaxResponse>> {
  return api.delete<AccountingSettingsDeleteTaxResponse>(`${API_PREFIX}${E.taxItem(taxId)}`);
}

export function listAccountingSettingsCurrencies(
  params?: AccountingSettingsCurrencyListQuery,
  opts?: { signal?: AbortSignal }
): Promise<ApiResponse<AccountingSettingsCurrencyListResponse>> {
  const query = buildQuery(params);
  return api.get<AccountingSettingsCurrencyListResponse>(
    `${API_PREFIX}${E.currencies}${query}`,
    {
      signal: opts?.signal,
    }
  );
}

export function createAccountingSettingsCurrency(
  payload: AccountingSettingsCreateCurrencyRequest,
  opts?: { idempotencyKey?: string }
): Promise<ApiResponse<AccountingSettingsCreateCurrencyResponse>> {
  const headers = opts?.idempotencyKey
    ? {
        "Idempotency-Key": opts.idempotencyKey,
      }
    : undefined;

  return api.post<AccountingSettingsCreateCurrencyResponse>(
    `${API_PREFIX}${E.currencies}`,
    payload,
    headers ? { headers } : undefined
  );
}

export function updateAccountingSettingsCurrency(
  currencyCode: string,
  payload: AccountingSettingsUpdateCurrencyRequest
): Promise<ApiResponse<AccountingSettingsUpdateCurrencyResponse>> {
  return api.put<AccountingSettingsUpdateCurrencyResponse>(
    `${API_PREFIX}${E.currencyItem(currencyCode)}`,
    payload
  );
}

export function updateAccountingSettingsRates(
  payload?: AccountingSettingsUpdateRatesRequest
): Promise<ApiResponse<AccountingSettingsUpdateRatesResponse>> {
  return api.post<AccountingSettingsUpdateRatesResponse>(
    `${API_PREFIX}${E.currencyUpdateRates}`,
    payload ?? {}
  );
}

export function toggleAccountingSettingsAutoRate(
  currencyCode: string,
  payload: AccountingSettingsToggleAutoRateRequest
): Promise<ApiResponse<AccountingSettingsToggleAutoRateResponse>> {
  return api.patch<AccountingSettingsToggleAutoRateResponse>(
    `${API_PREFIX}${E.currencyAutoRate(currencyCode)}`,
    payload
  );
}

export function listAccountingSettingsAnalyticAccounts(
  params?: AccountingSettingsAnalyticAccountListQuery,
  opts?: { signal?: AbortSignal }
): Promise<ApiResponse<AccountingSettingsAnalyticAccountListResponse>> {
  const query = buildQuery(params);
  return api.get<AccountingSettingsAnalyticAccountListResponse>(
    `${API_PREFIX}${E.analyticAccounts}${query}`,
    {
      signal: opts?.signal,
    }
  );
}

export function createAccountingSettingsAnalyticAccount(
  payload: AccountingSettingsCreateAnalyticAccountRequest,
  opts?: { idempotencyKey?: string }
): Promise<ApiResponse<AccountingSettingsCreateAnalyticAccountResponse>> {
  const headers = opts?.idempotencyKey
    ? {
        "Idempotency-Key": opts.idempotencyKey,
      }
    : undefined;

  return api.post<AccountingSettingsCreateAnalyticAccountResponse>(
    `${API_PREFIX}${E.analyticAccounts}`,
    payload,
    headers ? { headers } : undefined
  );
}

export function updateAccountingSettingsAnalyticAccount(
  analyticAccountId: string,
  payload: AccountingSettingsUpdateAnalyticAccountRequest
): Promise<ApiResponse<AccountingSettingsUpdateAnalyticAccountResponse>> {
  return api.put<AccountingSettingsUpdateAnalyticAccountResponse>(
    `${API_PREFIX}${E.analyticAccountItem(analyticAccountId)}`,
    payload
  );
}

export function listAccountingSettingsBudgets(
  params?: AccountingSettingsBudgetListQuery,
  opts?: { signal?: AbortSignal }
): Promise<ApiResponse<AccountingSettingsBudgetListResponse>> {
  const query = buildQuery(params);
  return api.get<AccountingSettingsBudgetListResponse>(`${API_PREFIX}${E.budgets}${query}`, {
    signal: opts?.signal,
  });
}

export function createAccountingSettingsBudget(
  payload: AccountingSettingsCreateBudgetRequest,
  opts?: { idempotencyKey?: string }
): Promise<ApiResponse<AccountingSettingsCreateBudgetResponse>> {
  const headers = opts?.idempotencyKey
    ? {
        "Idempotency-Key": opts.idempotencyKey,
      }
    : undefined;

  return api.post<AccountingSettingsCreateBudgetResponse>(
    `${API_PREFIX}${E.budgets}`,
    payload,
    headers ? { headers } : undefined
  );
}

export function updateAccountingSettingsBudget(
  budgetId: string,
  payload: AccountingSettingsUpdateBudgetRequest
): Promise<ApiResponse<AccountingSettingsUpdateBudgetResponse>> {
  return api.put<AccountingSettingsUpdateBudgetResponse>(`${API_PREFIX}${E.budgetItem(budgetId)}`, payload);
}

export function deleteAccountingSettingsBudget(
  budgetId: string
): Promise<ApiResponse<AccountingSettingsDeleteBudgetResponse>> {
  return api.delete<AccountingSettingsDeleteBudgetResponse>(`${API_PREFIX}${E.budgetItem(budgetId)}`);
}
