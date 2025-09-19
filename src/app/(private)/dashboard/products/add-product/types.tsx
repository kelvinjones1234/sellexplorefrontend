// Represents a category response from the API
export interface CategoryResponse {
  id: string;
  name: string;
  image?: string;
  message?: string;
}

// Represents an error response from the API (e.g., DRF)
export interface ErrorResponse {
  detail?: string;
  [key: string]: any; // Allow dynamic error fields
}

// Represents image data for a product
export interface ImageData {
  file: File | null;
  preview: string;
  progress: number;
  uploadedUrl?: string;
}

// Represents a note associated with a product option
export interface OptionsNote {
  product: string | number;
  id: number;
  note: string;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

// Represents a product option
export interface ProductOption {
  id: number;
  product: number;
  note: OptionsNote | null;
  options: string[];
  as_template: boolean;
  template_name?: string | null;
  created_at: string;
  updated_at: string;
}

// Represents product details
export interface ProductDetails {
  name: string;
  category: string;
  description: string;
  price: string;
  discountPrice?: string;
  quantity: string;
  availability: boolean;
  hot_deal: boolean;
  recent: boolean;
  featured: boolean;
  extraInfo: string;
  options: ProductOption[]; // plural instead of singular
}

// Represents a product
export interface Product {
  images: ImageData[];
  thumbnailIndex: number;
  details: ProductDetails;
}

// Represents an option for FancySelect component
export interface Option<T extends React.Key = string> {
  value: T;
  label: string;
}

// Props for FancySelect component
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
