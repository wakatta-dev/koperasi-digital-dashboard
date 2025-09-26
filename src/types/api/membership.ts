/** @format */

import type { ApiResponse, Rfc3339String } from './common';

export type Member = {
  id: number;
  tenant_id: number;
  user_id: number;
  no_anggota: string;
  full_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postal_code: string;
  identity_type: string;
  identity_number: string;
  occupation?: string;
  status: 'pending' | 'active' | 'nonaktif' | 'keluar';
  join_date: Rfc3339String;
  created_at: Rfc3339String;
  updated_at: Rfc3339String;
};

export type MemberListItem = {
  id: number;
  tenant_id: number;
  user_id: number;
  no_anggota: string;
  full_name: string;
  email: string;
  phone: string;
  city: string;
  province: string;
  status: string;
  join_date: Rfc3339String;
  user: {
    full_name: string;
    email: string;
  };
};

export type MemberCard = {
  member_id: number;
  qr_code: string;
  qr_url: string;
  issued_at: Rfc3339String;
  expired_at?: Rfc3339String;
};

export type SavingsSummary = {
  total_deposit: number;
  total_withdrawal: number;
  balance: number;
};

export type LoanSummary = {
  active_loans: number;
  outstanding: number;
};

export type AttendanceSummary = {
  rat_attended: number;
  last_attended?: Rfc3339String;
};

export type MemberProfile = {
  member: Member;
  savings_summary: SavingsSummary;
  loan_summary: LoanSummary;
  attendance: AttendanceSummary;
};

export type RegisterMemberRequest = {
  user_id: number;
  no_anggota: string;
  full_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postal_code: string;
  identity_type: string;
  identity_number: string;
  occupation?: string;
  family_name?: string;
  family_relationship?: string;
  family_phone?: string;
  initial_deposit?: number;
  documents?: Array<{ type: string; data: string }>;
};

export type VerifyMemberRequest = {
  approve: boolean;
  reason?: string;
};

export type UpdateMemberProfileRequest = Partial<{
  full_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postal_code: string;
  occupation: string;
  family_name: string;
  family_relationship: string;
  family_phone: string;
}>;

export type UpdateMemberStatusRequest = {
  status: 'active' | 'nonaktif' | 'keluar';
  effective_date?: Rfc3339String;
  reason?: string;
};

export type RegisterMemberResponse = Member;
export type VerifyMemberResponse = ApiResponse<Member>;
export type MemberListResponse = ApiResponse<MemberListItem[]>;
export type MemberProfileResponse = ApiResponse<MemberProfile>;
export type UpdateMemberStatusResponse = ApiResponse<null>;
export type MemberCardResponse = ApiResponse<MemberCard>;
export type ValidateMemberCardResponse = ApiResponse<Member>;
