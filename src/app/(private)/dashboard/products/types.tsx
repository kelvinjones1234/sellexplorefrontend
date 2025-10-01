export interface ProductImage {
  id?: number; // Optional for new images
  image: string; // URL for existing images
  is_thumbnail: boolean;
  preview?: string; // Frontend-only: URL.createObjectURL for new images
  file?: File | null; // Frontend-only: File for new image uploads
  isNew?: boolean; // Frontend-only: Track if image is newly added
  toDelete?: boolean; // Frontend-only: Track if image should be deleted
  created_at?: string; // Optional: from model
  updated_at?: string; // Optional: from model
}

export interface OptionsNote {
  id: number; // Required after creation
  note: string;
  created_at?: string; // Optional: from model
  updated_at?: string; // Optional: from model
}

export interface ProductOption {
  id?: number; // Optional for new options
  product: number; // Foreign key to Product ID
  options: string[]; // JSON array of options (e.g., ["S", "M", "L"])
  template_name?: string | null; // Optional template name
  as_template: boolean; // Whether this is a template
  note?: OptionsNote | null; // Foreign key to OptionsNote or null
  created_at?: string; // Optional: from model
  updated_at?: string; // Optional: from model
}

export interface Product {
  id: number;
  name: string;
  category?: number | null; // Foreign key to Category ID, nullable
  description: string;
  price: string; // Decimal as string (e.g., "100.00")
  discount_price?: string | null; // Optional, nullable
  quantity: number;
  availability: boolean;
  hot_deal?: boolean; // From model, defaults to false
  featured?: boolean; // From model, defaults to false
  recent?: boolean; // From model, defaults to false
  extra_info?: string | null; // Optional, nullable
  images: ProductImage[];
  options: ProductOption[]; // Array of ProductOptions (often 0 or 1 in your UI)
  thumbnailIndex?: number; // Frontend-only: Track selected thumbnail index
  deletedImageIds?: number[]; // Frontend-only: Track deleted image IDs
  created_at?: string; // Optional: from model
  updated_at?: string; // Optional: from model
}

export interface Category {
  id: number;
  name: string;
  image?: string | null; // Optional, nullable
  product_count?: number; // Optional, number only
  slug?: string; // Optional
}

export interface CategoryResponse {
  id: number;
  name: string;
  image?: string | null;
  product_count?: number;
  slug?: string;
}

export interface ProductResponse {
  id: number;
  name: string;
  category?: number | null;
  description: string;
  price: string;
  discount_price?: string | null;
  quantity: number;
  availability: boolean;
  hot_deal?: boolean;
  featured?: boolean;
  recent?: boolean;
  extra_info?: string | null;
  images: ProductImage[];
  options: ProductOption[];
  created_at?: string;
  updated_at?: string;
}

export interface ErrorResponse {
  detail?: string;
  message?: string;
  [key: string]: any; // Allow other dynamic error fields
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}