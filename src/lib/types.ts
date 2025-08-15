export type UserRole = "vendor" | "koperasi" | "umkm" | "bumdes"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  organizationId: string
}

export interface DashboardStats {
  title: string
  value: string | number
  change?: string
  trend?: "up" | "down" | "neutral"
}
