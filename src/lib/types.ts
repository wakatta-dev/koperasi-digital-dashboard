/** @format */

export type UserRole = "vendor" | "koperasi" | "umkm" | "bumdes";

export interface DashboardStats {
  title: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "neutral";
}

// Re-export API types to keep a single source of truth
export type {
  User,
  Role,
  Plan,
  Invoice,
  Payment,
  LoginResponse,
} from "@/types/api";
