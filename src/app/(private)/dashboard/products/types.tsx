// --- INTERFACES (No changes) ---
export interface ProductImage {
  id: number;
  image: string;
  is_thumbnail: boolean;
  preview?: string; // Add this
}

export interface ProductOption {
  name: string;
  image?: File;
}

export interface Product {
  id: number;
  name: string;
  category: number;
  description: string;
  price: string;
  discount_price: string | null;
  quantity: number | string;
  availability: boolean;
  extra_info: string;
  images: (ProductImage & { file?: File | null; preview?: string })[];
  options: ProductOption[];
  featured?: boolean;
  thumbnailIndex?: number;
}

export interface Category {
  id: number;
  name: string;
  image: string;
  items?: number; // optional if your API doesn’t return this
  link?: string; // optional for frontend
  product_count?: string;
  slug?: string;
}

export interface ErrorResponse {
  detail?: string; // common DRF error field
  [key: string]: any; // allow other dynamic error fields
}

export interface CategoryResponse {
  id: number;
  name: string;
  image: string | null;
}

export interface ErrorResponse {
  detail?: string;
  message?: string;
}

