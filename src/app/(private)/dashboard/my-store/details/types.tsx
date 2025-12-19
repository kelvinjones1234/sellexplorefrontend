export interface ErrorResponse {
  detail?: string;
  message?: string;
  [key: string]: any; // Allow other dynamic error fields
}

export interface Store {
  id: number;
  store_name: string;
  phone: string;
  description: string;
  country: string;
  state: string;
  address: string;
  delivery: string;
  business_category: string;
  product_types: string[];
  story: string;
  image_one?: string;
  image_two?: string;
  image_three?: string;
  twitter?: string;
  facebook?: string;
  tiktok?: string;
  snapchat?: string;
  instagram?: string;
  delivery_time?: string;
  policy?: string;
  created_at: string;
  updated_at: string;
}

export interface StoreFAQ {
  id: number;
  question: string;
  answer: string;
}





// --- Interfaces ---
export interface Option {
  value: string;
  label: string;
}

export interface BasicDetails {
  phone: string;
  store_name: string;
  description: string;
}

export interface LocationDetails {
  country: string;
  state: string;
  address: string;
}

export interface SocialLinks {
  twitter: string;
  facebook: string;
  tiktok: string;
  snapchat: string;
  instagram: string;
}

export interface ExtraInfo {
  deliveryTime: string;
  policy: string;
}

export interface AboutUs {
  story: string;
}

export interface Tab {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface LocalFAQ {
  tempId: string; // Temporary ID for unsaved FAQs
  question: string;
  answer: string;
}