export interface ErrorResponse {
  detail?: string;
  message?: string;
  [key: string]: any; // Allow other dynamic error fields
}

// Store configuration for theming & hero section
export interface StoreConfig {
  title: string;
  description: string;
  brand_color_dark?: string;
  brand_color_light?: string;
  headline?: string;
  subheading?: string;
  position?: "start" | "center" | "end";
  button_one?: string;
  button_two?: string;
  background_image_one?: string;
  background_image_two?: string;
  background_image_three?: string;
}

// Category model (used in filter dropdowns, listings)
export interface Category {
  id: number;
  name: string;
  image?: string | null;
}

// Product image details
export interface ProductImage {
  id: number;
  image: string;
  is_thumbnail: boolean;
}

// Featured product (for homepage sections)
export interface FeaturedProduct {
  id: number;
  name: string;
  price: string;
  discount_price?: string | null;
  images: ProductImage[];
  options: { id: number; name: string }[];
}

// Product group (for grouping in ItemsGroup)
export interface ProductGroupData {
  id: number;
  name: string;
  products: FeaturedProduct[];
}
