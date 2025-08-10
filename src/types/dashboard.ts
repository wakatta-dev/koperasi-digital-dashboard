/** @format */

export type SummaryItem = {
  amount: number;
  change: number;
};

export interface ClientSummary {
  active_members: SummaryItem;
  total_savings: SummaryItem;
  active_loans: SummaryItem;
  current_year_shu: SummaryItem;
}

export interface OwnerSummary {
  clients_per_tier: Record<string, { current: number; prev: number }>;
  open_tickets: number;
  most_active_client: string;
  top_ticket_product: { name: string; tickets: number };
  invoice_status: { lunas: number; belum_lunas: number };
  active_notifications: number;
}
