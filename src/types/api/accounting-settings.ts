/** @format */

export type AccountingSettingsTaxType = "Sales" | "Purchase" | "Both" | "None";

export type AccountingSettingsPagination = {
  page: number;
  per_page: number;
  total_items: number;
  total_pages: number;
};

export type AccountingSettingsOverviewItem = {
  key: string;
  title: string;
  description: string;
  action_label: string;
  href: string;
};

export type AccountingSettingsOverviewResponse = {
  items: AccountingSettingsOverviewItem[];
};

export type AccountingSettingsCoaListQuery = {
  q?: string;
  page?: number;
  per_page?: number;
};

export type AccountingSettingsCoaItem = {
  account_code: string;
  account_name: string;
  account_type: string;
  balance: number;
  level: number;
  parent_account_code?: string | null;
  is_active: boolean;
};

export type AccountingSettingsCoaListResponse = {
  items: AccountingSettingsCoaItem[];
  pagination: AccountingSettingsPagination;
};

export type AccountingSettingsCreateCoaRequest = {
  account_code: string;
  account_name: string;
  account_type: string;
  parent_account_code?: string;
  description?: string;
};

export type AccountingSettingsUpdateCoaRequest = {
  account_name?: string;
  account_type?: string;
  parent_account_code?: string;
  description?: string;
  is_active?: boolean;
};

export type AccountingSettingsCreateCoaResponse = {
  account_code: string;
  account_name: string;
  account_type: string;
  parent_account_code?: string | null;
};

export type AccountingSettingsUpdateCoaResponse = AccountingSettingsCoaItem;

export type AccountingSettingsDeleteCoaResponse = {
  deleted: boolean;
  account_code: string;
};

export type AccountingSettingsTaxListQuery = {
  q?: string;
  status?: "active" | "inactive";
  tax_type?: AccountingSettingsTaxType;
  page?: number;
  per_page?: number;
};

export type AccountingSettingsTaxItem = {
  tax_id: string;
  tax_name: string;
  tax_type: AccountingSettingsTaxType;
  rate_percent: number;
  tax_account: string;
  is_active: boolean;
  description?: string;
};

export type AccountingSettingsTaxListResponse = {
  items: AccountingSettingsTaxItem[];
  pagination: AccountingSettingsPagination;
};

export type AccountingSettingsCreateTaxRequest = {
  tax_name: string;
  tax_type: AccountingSettingsTaxType;
  rate_percent: number;
  tax_account_code: string;
  description?: string;
  is_active: boolean;
};

export type AccountingSettingsUpdateTaxRequest = Partial<AccountingSettingsCreateTaxRequest>;

export type AccountingSettingsCreateTaxResponse = AccountingSettingsTaxItem;

export type AccountingSettingsUpdateTaxResponse = AccountingSettingsTaxItem;

export type AccountingSettingsToggleTaxStatusRequest = {
  is_active: boolean;
};

export type AccountingSettingsToggleTaxStatusResponse = {
  tax_id: string;
  is_active: boolean;
};

export type AccountingSettingsDuplicateTaxRequest = {
  new_name?: string;
};

export type AccountingSettingsDuplicateTaxResponse = AccountingSettingsTaxItem;

export type AccountingSettingsDeleteTaxResponse = {
  deleted: boolean;
  tax_id: string;
};

export type AccountingSettingsCurrencyListQuery = {
  q?: string;
  page?: number;
  per_page?: number;
};

export type AccountingSettingsCurrencyItem = {
  currency_code: string;
  currency_name: string;
  symbol: string;
  exchange_rate: number;
  is_base: boolean;
  auto_rate_update_enabled: boolean;
  last_updated_at: string;
  is_active: boolean;
};

export type AccountingSettingsCurrencyListResponse = {
  items: AccountingSettingsCurrencyItem[];
  pagination: AccountingSettingsPagination;
};

export type AccountingSettingsCreateCurrencyRequest = {
  currency_name: string;
  currency_code: string;
  symbol: string;
  exchange_rate: number;
  auto_rate_update_enabled: boolean;
};

export type AccountingSettingsUpdateCurrencyRequest = {
  currency_name?: string;
  symbol?: string;
  exchange_rate?: number;
  is_active?: boolean;
};

export type AccountingSettingsCreateCurrencyResponse = AccountingSettingsCurrencyItem;

export type AccountingSettingsUpdateCurrencyResponse = AccountingSettingsCurrencyItem;

export type AccountingSettingsUpdateRatesRequest = {
  codes?: string[];
};

export type AccountingSettingsUpdateRatesResponse = {
  updated_count: number;
  updated_codes: string[];
  updated_at: string;
};

export type AccountingSettingsToggleAutoRateRequest = {
  auto_rate_update_enabled: boolean;
};

export type AccountingSettingsToggleAutoRateResponse = {
  currency_code: string;
  auto_rate_update_enabled: boolean;
};

export type AccountingSettingsAnalyticAccountListQuery = {
  q?: string;
  status?: "active" | "inactive";
  page?: number;
  per_page?: number;
};

export type AccountingSettingsAnalyticAccountItem = {
  analytic_account_id: string;
  account_name: string;
  reference_code: string;
  status: string;
  current_balance: number;
  active_budgets: number;
  parent_analytic_account_id?: string | null;
};

export type AccountingSettingsAnalyticAccountListResponse = {
  items: AccountingSettingsAnalyticAccountItem[];
  pagination: AccountingSettingsPagination;
};

export type AccountingSettingsCreateAnalyticAccountRequest = {
  account_name: string;
  reference_code: string;
  parent_analytic_account_id?: string;
};

export type AccountingSettingsUpdateAnalyticAccountRequest = {
  account_name?: string;
  reference_code?: string;
  parent_analytic_account_id?: string;
  status?: string;
};

export type AccountingSettingsCreateAnalyticAccountResponse =
  AccountingSettingsAnalyticAccountItem;

export type AccountingSettingsUpdateAnalyticAccountResponse =
  AccountingSettingsAnalyticAccountItem;

export type AccountingSettingsBudgetListQuery = {
  q?: string;
  analytic_account_id?: string;
  date_from?: string;
  date_to?: string;
  page?: number;
  per_page?: number;
};

export type AccountingSettingsBudgetItem = {
  budget_id: string;
  budget_name: string;
  analytic_account_id: string;
  analytic_account_name: string;
  start_date: string;
  end_date: string;
  currency_code: string;
  target_amount: number;
  practical_amount: number;
  achievement_percent: number;
  status: string;
};

export type AccountingSettingsBudgetListResponse = {
  items: AccountingSettingsBudgetItem[];
  pagination: AccountingSettingsPagination;
};

export type AccountingSettingsCreateBudgetRequest = {
  budget_name: string;
  analytic_account_id: string;
  start_date: string;
  end_date: string;
  currency_code: string;
  target_amount: number;
};

export type AccountingSettingsUpdateBudgetRequest = {
  budget_name?: string;
  analytic_account_id?: string;
  start_date?: string;
  end_date?: string;
  currency_code?: string;
  target_amount?: number;
  status?: string;
};

export type AccountingSettingsCreateBudgetResponse = AccountingSettingsBudgetItem;

export type AccountingSettingsUpdateBudgetResponse = AccountingSettingsBudgetItem;

export type AccountingSettingsDeleteBudgetResponse = {
  deleted: boolean;
  budget_id: string;
};
