// 🔹 Error response shape
export interface ErrorResponse {
  detail?: string;
  message?: string;
  [key: string]: any; // Allow other dynamic error fields
}

// 🔹 Store configuration for theming & hero section
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

// 🔹 Category model
export interface Category {
  id: number;
  name: string;
  slug: string;
  image?: string | null;
}

// 🔹 Product image details
export interface ProductImage {
  id: number;
  image: string;
  is_thumbnail: boolean;
}

// 🔹 Product model (base)
export interface Product {
  id: number;
  name: string;
  price: string;
  discount_price?: string | null; // allow null + undefined
  description?: string;
  colors?: string[];
  length?: string;
  category?: Category;
  images: ProductImage[];
  options?: Array<{
    id: number;
    name: string;
    price: string;
    image?: string | File;
  }>;
}

// 🔹 Featured product = same as Product
export type FeaturedProduct = Product;

// 🔹 Product group (used in ItemsGroup or dashboard)
export interface ProductGroupData {
  id: number;
  name: string;
  products: Product[];
}

// 🔹 Combined response for homepage (featured + categories)
export interface CategoriesAndFeaturedProducts {
  featured_products: Product[];
  categories: Category[];
}

// 🔹 Generic API responses
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface FilteredProductResponse<T> {
  count: number;
  results: T[];
}

// 🔹 Product filter query params
export interface ProductFilters {
  search?: string;
  category?: string;
  categories?: string;
}




export interface CouponResponse {
  code: string;
  discount_type: "fixed" | "percentage";
  discount_value: number;
  products: {
    id: number;
    name: string;
    price: number;
    discount_price: number | null;
  }[];
  message: string;
}