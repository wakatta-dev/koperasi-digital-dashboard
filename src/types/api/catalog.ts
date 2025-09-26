/** @format */

export type CatalogModule = {
  id: number;
  code: string;
  name: string;
  description?: string;
  price?: number;
  billing_cycle?: string;
  metadata?: Record<string, unknown>;
};

