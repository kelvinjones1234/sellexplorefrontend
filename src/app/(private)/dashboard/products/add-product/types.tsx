// category

export interface CategoryResponse {
  id: string;
  name: string;
  image?: string;
  message?: string;
}

// Error shape returned by DRF or your API
export interface ErrorResponse {
  detail?: string; // common DRF error field
  [key: string]: any; // allow other dynamic error fields
}

export interface ImageData {
  file: File | null;
  preview: string;
  progress: number;
  uploadedUrl?: string;
}

export interface ProductOption {
  name: string;
  image?: File;
}

export interface ProductDetails {
  name: string;
  category: string; // Category ID or slug
  description: string;
  price: string; // String in frontend, converted to number for backend
  discountPrice?: string; // Optional, string in frontend
  quantity: string; // String in frontend, converted to number
  availability: boolean; // Changed to match backend
  hot_deal: boolean; // Changed to match backend
  recent: boolean; // Changed to match backend
  featured: boolean; // Changed to match backend
  extraInfo: string;
  options: ProductOption[]; // Correct type
}

export interface Product {
  images: ImageData[];
  thumbnailIndex: number;
  details: ProductDetails;
}

// types.tsx
export interface Option<T extends React.Key = string> {
  value: T;
  label: string;
}

export interface FancySelectProps<T extends React.Key = string> {
  name: string;
  options: Option<T>[];
  value: T | null;
  onChange: (val: T) => void;
  onCreateCategory?: (name: string, image: File | null) => void;
  placeholder?: string;
  margin?: string;
  disabled?: boolean;
  error?: string;
}
