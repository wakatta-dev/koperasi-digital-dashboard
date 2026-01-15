/** @format */

import { API_PREFIX, api } from "@/services/api/base";
import type { ApiResponse } from "@/types/api";
import type {
  AboutSection,
  AdvantagesSection,
  BusinessUnitConfig,
  FeaturedProductSection,
  FooterSection,
  HeroSection,
  LandingPageConfig,
  LandingPageMediaResponse,
  NavigationConfig,
  TestimonialSection,
} from "@/types/landing-page";

const BASE = `${API_PREFIX}/landingpage`;

export function getLandingPagePublic(): Promise<ApiResponse<LandingPageConfig>> {
  return api.get<LandingPageConfig>(BASE);
}

export function getLandingPageAdmin(): Promise<ApiResponse<LandingPageConfig>> {
  return api.get<LandingPageConfig>(`${BASE}/admin`);
}

export function updateNavigation(
  payload: NavigationConfig
): Promise<ApiResponse<LandingPageConfig>> {
  return api.put<LandingPageConfig>(`${BASE}/admin/navigation`, payload);
}

export function updateHero(payload: HeroSection): Promise<ApiResponse<LandingPageConfig>> {
  return api.put<LandingPageConfig>(`${BASE}/admin/hero`, payload);
}

export function updateAbout(payload: AboutSection): Promise<ApiResponse<LandingPageConfig>> {
  return api.put<LandingPageConfig>(`${BASE}/admin/about`, payload);
}

export function updateAdvantages(
  payload: AdvantagesSection
): Promise<ApiResponse<LandingPageConfig>> {
  return api.put<LandingPageConfig>(`${BASE}/admin/advantages`, payload);
}

export function updateFeaturedProduct(
  payload: FeaturedProductSection
): Promise<ApiResponse<LandingPageConfig>> {
  return api.put<LandingPageConfig>(`${BASE}/admin/featured-product`, payload);
}

export function updateBusinessUnits(
  payload: BusinessUnitConfig
): Promise<ApiResponse<LandingPageConfig>> {
  return api.put<LandingPageConfig>(`${BASE}/admin/business-units`, payload);
}

export function updateTestimonials(
  payload: TestimonialSection
): Promise<ApiResponse<LandingPageConfig>> {
  return api.put<LandingPageConfig>(`${BASE}/admin/testimonials`, payload);
}

export function updateFooter(payload: FooterSection): Promise<ApiResponse<LandingPageConfig>> {
  return api.put<LandingPageConfig>(`${BASE}/admin/footer`, payload);
}

export function uploadLandingMedia(
  formData: FormData
): Promise<ApiResponse<LandingPageMediaResponse>> {
  return api.post<LandingPageMediaResponse>(`${BASE}/admin/media`, formData, {
    headers: {},
  });
}
