/** @format */

export type CoaAccountRow = {
  account_code: string;
  account_name: string;
  account_type: string;
  balance: string;
  level: number;
  is_group?: boolean;
  is_expanded?: boolean;
  is_highlighted?: boolean;
};

export type TaxRow = {
  tax_id: string;
  tax_name: string;
  description: string;
  tax_type: "Sales" | "Purchase" | "Both" | "None";
  rate_percent: string;
  tax_account: string;
  tax_account_description: string;
  is_active: boolean;
};

export type CurrencyRow = {
  currency_code: string;
  symbol: string;
  exchange_rate: string;
  last_updated: string;
  is_base: boolean;
  badge_class: string;
};

export type BudgetRow = {
  budget_id: string;
  budget_name: string;
  department: string;
  analytic_account: string;
  period: string;
  target_amount: string;
  practical_amount: string;
  achievement_percent: number;
  achievement_label: string;
  progress_class: string;
  achievement_class: string;
  avatar: string;
  avatar_class: string;
};

export type AnalyticAccountCard = {
  analytic_account_id: string;
  account_name: string;
  reference_code: string;
  current_balance: string;
  active_budgets: number;
  status: "Active" | "Inactive";
  icon: string;
  icon_class: string;
  balance_class: string;
};

