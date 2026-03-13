/** @format */

export type PartnerManagementSellerItem = {
  seller_id: string;
  seller_name: string;
  business_name: string;
  owner_name: string;
  business_type: string;
  phone?: string;
  email?: string;
  lifecycle_state: string;
  ready_for_review: boolean;
  created_at: string;
  updated_at: string;
};

export type PartnerManagementSellerListResponse = {
  items: PartnerManagementSellerItem[];
};
