/** @format */

export const API_ENDPOINTS = {
  tenant: {
    byDomain: "/tenant/by-domain",
    list: "/tenants",
    detail: (id: string | number) => `/tenants/${id}`,
    status: (id: string | number) => `/tenants/${id}/status`,
    users: (id: string | number) => `/tenants/${id}/users`,
    modules: (id: string | number) => `/tenants/${id}/modules`,
  },
  auth: {
    login: "/auth/login",
    refresh: "/auth/refresh",
    logout: "/auth/logout",
  },
  users: {
    list: "/users",
    detail: (id: string | number) => `/users/${id}`,
    status: (id: string | number) => `/users/${id}/status`,
    resetPassword: "/users/reset-password",
    roles: (id: string | number) => `/users/${id}/roles`,
    role: (id: string | number, rid: string | number) => `/users/${id}/roles/${rid}`,
  },
  roles: {
    list: "/roles",
    detail: (id: string | number) => `/roles/${id}`,
    permissions: (id: string | number) => `/roles/${id}/permissions`,
    permission: (id: string | number, pid: string | number) => `/roles/${id}/permissions/${pid}`,
  },
} as const;

export type ApiEndpoint = typeof API_ENDPOINTS;
