export interface ProductImage {
  id?: number; // Make optional for new images
  image: string;
  is_thumbnail: boolean;
  preview?: string;
  file?: File | null; // For new image uploads
  isNew?: boolean; // Track if this is a newly added image
  toDelete?: boolean; // Track if this image should be deleted
}

export interface ProductOption {
  id?: number; // Make optional for new options
  name: string;
  image?: File | string | null; // Can be either File (new) or string (existing URL)
}

export interface Product {
  id: number;
  name: string;
  category?: number | null; // Make optional and allow null
  description: string;
  price: string;
  discount_price?: string | null; // Make optional
  quantity: number;
  availability: boolean;
  extra_info?: string | null; // Make optional
  images: ProductImage[];
  options: ProductOption[];
  featured?: boolean;
  thumbnailIndex?: number;
  deletedImageIds?: number[]; // Track deleted image IDs
}

export interface Category {
  id: number;
  name: string;
  image?: string | null; // Make optional and allow null
  product_count?: number | string; // Allow both types
  slug?: string;
}

export interface CategoryResponse {
  id: number;
  name: string;
  image: string | null;
  product_count?: number;
  slug?: string;
}

export interface ErrorResponse {
  detail?: string;
  message?: string;
  [key: string]: any; // Allow other dynamic error fields
}

// API Response types
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ProductResponse extends Omit<Product, "images"> {
  images: Array<{
    id: number;
    image: string;
    is_thumbnail: boolean;
  }>;
}
