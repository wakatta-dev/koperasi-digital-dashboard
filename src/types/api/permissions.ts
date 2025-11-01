/** @format */

import type { ApiResponse, Rfc3339String } from "./common";

export interface PermissionDefinition {
  id: number;
  module: string;
  name?: string;
  action: string;
  description?: string;
  version: number;
  pending_version?: number;
  is_active: boolean;
  pending_active?: boolean;
  pending_desc?: string;
  created_at?: Rfc3339String;
  updated_at?: Rfc3339String;
  last_confirmed_at?: Rfc3339String;
}

export interface PermissionDescriptor {
  action: string;
  description: string;
  active?: boolean;
}

export interface PermissionSyncRequest {
  module: string;
  permissions: PermissionDescriptor[];
  reason?: string;
}

export interface PermissionSyncReport {
  module: string;
  created?: number;
  staged?: number;
  unchanged?: number;
  definitions: PermissionDefinition[];
}

export interface PermissionConfirmRequest {
  reason: string;
}

export type PermissionRegistryResponse = ApiResponse<PermissionDefinition[]>;
export type PermissionSyncResponse = ApiResponse<PermissionSyncReport>;
export type PermissionConfirmResponse = ApiResponse<PermissionDefinition>;
