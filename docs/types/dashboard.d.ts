import type { APIResponse, Rfc3339String } from './index';

export interface DashboardSummary { active_members: number; total_savings: number; total_loans: number; running_shu: number }
export interface TrendData { date: Rfc3339String; savings: number; loans: number }

export interface Notification {
  id: string;
  tenant_id: number;
  type: string;
  category?: string;
  title?: string;
  body?: string;
  status: string;
  created_at: Rfc3339String;
}

export interface VendorDashboard {
  packages: Array<{ package: string; total: number }>;
  active_clients?: number;
  total_revenue?: number;
  monthly_revenue?: number;
  open_tickets?: number;
  top_tenant?: { tenant_id: number; tenant: string; total: number } | null;
  top_product?: { product: string; total: number } | null;
  recent_audits: any[];
  recent_notifications: Array<{ id: string; category: string; title: string; body: string; created_at: Rfc3339String }>;
}

export interface ClientAnalytics {
  packages: Array<{ package: string; total: number }>;
  status: { active: number; inactive: number };
  growth: Array<{ period: string; total: number }>;
}

export type GetDashboardSummaryResponse = APIResponse<DashboardSummary>;
export type GetTrendResponse = APIResponse<TrendData[]>;
export type ListDashboardNotificationsResponse = APIResponse<Notification[]>;
export type GetVendorDashboardResponse = APIResponse<VendorDashboard>;
export type GetClientAnalyticsResponse = APIResponse<ClientAnalytics>;

