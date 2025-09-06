/** @format */

import type { ApiResponse, Rfc3339String } from './common';

export interface Member {
  id: number;
  tenant_id: number;
  user_id: number;
  no_anggota: string;
  status: string;
  join_date: Rfc3339String;
  qr_code: string;
  qr_expired_at: Rfc3339String;
  created_at: Rfc3339String;
  updated_at: Rfc3339String;
}

export interface MemberDocument { id: number; member_id: number; type: string; file_url: string; created_at: Rfc3339String }
export interface Profile { member: Member; savings: number; loans: number; shu: number }
export interface MemberDocumentUpload { type: string; data: string }

export interface RegisterMemberRequest { user_id: number; no_anggota: string; initial_deposit?: number; documents: MemberDocumentUpload[] }
export interface VerifyMemberRequest { approve: boolean }
export interface UpdateMemberStatusRequest { status: string }

export type RegisterMemberResponse = Member;
export type VerifyMemberResponse = void;
export type GetMemberProfileResponse = Profile;
export type UpdateMemberStatusResponse = void;
export type CreateMemberCardResponse = ApiResponse<{ member_id: number; qr: string; issued_at: Rfc3339String }>;
export type ValidateMemberCardResponse = ApiResponse<Member>;

// Extended list item per docs: includes short user info
export interface MemberUserShort { full_name: string; email: string }
export interface MemberListItem {
  id: number;
  tenant_id: number;
  user_id: number;
  no_anggota: string;
  status: string;
  join_date: Rfc3339String;
  created_at: Rfc3339String;
  updated_at: Rfc3339String;
  user?: MemberUserShort; // optional if backend omits
}

export type ListMembersResponse = ApiResponse<MemberListItem[]>;
