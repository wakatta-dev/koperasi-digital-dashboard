/** @format */

export type NavigationItem = {
  id?: string;
  label: string;
  url: string;
  order: number;
};

export type NavigationConfig = {
  brand_name?: string;
  logo_light_url?: string;
  logo_dark_url?: string;
  favicon_url?: string;
  cta_label?: string;
  cta_url?: string;
  items: NavigationItem[];
};

export type HeroSection = {
  headline?: string;
  subheadline?: string;
  cta_label?: string;
  cta_url?: string;
  background_image_url?: string;
  illustration_left_url?: string;
  illustration_right_url?: string;
  is_active?: boolean;
};

export type AboutValue = {
  id?: string;
  icon?: string;
  title: string;
  description: string;
  order: number;
};

export type AboutSection = {
  title?: string;
  body?: string;
  image_url?: string;
  cta_label?: string;
  cta_url?: string;
  values: AboutValue[];
};

export type AdvantageItem = {
  id?: string;
  icon?: string;
  title: string;
  description: string;
  order: number;
};

export type AdvantagesSection = {
  title?: string;
  description?: string;
  items: AdvantageItem[];
  image_url?: string;
};

export type FeaturedProductSection = {
  title?: string;
  description?: string;
  product_id?: string | number;
  display_title?: string;
  display_price?: string;
  display_description?: string;
  image_url?: string;
  cta_label?: string;
  cta_url?: string;
};

export type BusinessUnitSelection = {
  id?: string;
  unit_id: string | number;
  order: number;
  label_override?: string;
  image_url?: string;
};

export type BusinessUnitConfig = {
  items: BusinessUnitSelection[];
};

export type TestimonialItem = {
  id?: string;
  name: string;
  role: string;
  rating: number;
  quote: string;
  photo_url?: string;
  order: number;
};

export type TestimonialSection = {
  title?: string;
  description?: string;
  items: TestimonialItem[];
};

export type FooterLink = {
  id?: string;
  label: string;
  url: string;
  order: number;
};

export type FooterColumn = {
  id?: string;
  title: string;
  links: FooterLink[];
};

export type SocialLink = {
  id?: string;
  platform: string;
  url: string;
  order: number;
};

export type FooterSection = {
  contact_email?: string;
  contact_whatsapp?: string;
  address?: string;
  hours?: string;
  maps_url?: string;
  social_links: SocialLink[];
  columns: FooterColumn[];
  copyright_text?: string;
  privacy_url?: string;
  terms_url?: string;
};

export type LandingPageConfig = {
  section_order?: string[];
  navigation?: NavigationConfig;
  hero?: HeroSection;
  about?: AboutSection;
  advantages?: AdvantagesSection;
  featured_product?: FeaturedProductSection;
  business_units?: BusinessUnitConfig;
  testimonials?: TestimonialSection;
  footer?: FooterSection;
};

export type LandingPageMediaResponse = {
  url: string;
};

export type LandingTemplateFieldSchema = {
  key: string;
  type: string;
  label?: string;
  required?: boolean;
  min_items?: number;
  max_items?: number;
  max_size_mb?: number;
  item_fields?: LandingTemplateFieldSchema[];
};

export type LandingTemplateSectionSchema = {
  key: string;
  label?: string;
  fields: LandingTemplateFieldSchema[];
};

export type LandingTemplateSchema = {
  sections: LandingTemplateSectionSchema[];
};

export type LandingTemplateSummary = {
  id: number;
  code: string;
  name: string;
  description?: string;
  category?: string;
  badges?: string[];
  preview_image_url?: string;
  status: string;
};

export type LandingEditorState = {
  template: LandingTemplateSummary;
  draft_version: number;
  published_version: number;
  has_unpublished_changes: boolean;
  last_draft_saved_at?: number;
  last_published_at?: number;
  section_schema: LandingTemplateSchema;
  draft_content: Record<string, any>;
  published_content: Record<string, any>;
};

export type LandingTemplateSwitchSummary = {
  safe_sections?: string[];
  dropped_sections?: string[];
};

export type LandingTemplateSelectResponse = {
  requires_confirmation: boolean;
  summary?: LandingTemplateSwitchSummary;
  editor_state?: LandingEditorState;
};

export type LandingTemplateSelectPayload = {
  template_id: number;
  force_replace?: boolean;
};

export type LandingSaveDraftPayload = {
  expected_draft_version: number;
  draft_content: Record<string, any>;
};

export type LandingPublishPayload = {
  expected_draft_version: number;
};

export const createEmptyLandingConfig = (): LandingPageConfig => ({
  section_order: [
    "hero",
    "about",
    "business_units",
    "featured_product",
    "advantages",
    "testimonials",
    "footer",
  ],
  navigation: {
    brand_name: "",
    logo_light_url: "",
    logo_dark_url: "",
    favicon_url: "",
    cta_label: "",
    cta_url: "",
    items: [],
  },
  hero: {
    headline: "",
    subheadline: "",
    cta_label: "",
    cta_url: "",
    background_image_url: "",
    illustration_left_url: "",
    illustration_right_url: "",
    is_active: true,
  },
  about: {
    title: "",
    body: "",
    image_url: "",
    cta_label: "",
    cta_url: "",
    values: [],
  },
  advantages: {
    title: "",
    description: "",
    items: [],
    image_url: "",
  },
  featured_product: {
    title: "",
    description: "",
    product_id: "",
    display_title: "",
    display_price: "",
    display_description: "",
    image_url: "",
    cta_label: "",
    cta_url: "",
  },
  business_units: {
    items: [],
  },
  testimonials: {
    title: "",
    description: "",
    items: [],
  },
  footer: {
    contact_email: "",
    contact_whatsapp: "",
    address: "",
    hours: "",
    maps_url: "",
    social_links: [],
    columns: [],
    copyright_text: "",
    privacy_url: "",
    terms_url: "",
  },
});
