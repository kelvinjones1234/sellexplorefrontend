// // 🔹 Error response shape
// export interface ErrorResponse {
//   detail?: string;
//   message?: string;
//   [key: string]: any; // Allow other dynamic error fields
// }

// // 🔹 Store configuration for theming & hero section
// export interface StoreConfig {
//   title: string;
//   description: string;
//   brand_color_dark?: string;
//   brand_color_light?: string;
//   headline?: string;
//   subheading?: string;
//   position?: "start" | "center" | "end";
//   button_one?: string;
//   button_two?: string;
//   background_image_one?: string;
//   background_image_two?: string;
//   background_image_three?: string;
// }

// // 🔹 Category model
// export interface Category {
//   id: number;
//   name: string;
//   slug: string;
//   image?: string | null;
// }

// // 🔹 Product image details
// export interface ProductImage {
//   id: number;
//   image: string;
//   is_thumbnail: boolean;
// }

// // 🔹 Product model (base)
// export interface Product {
//   id: number;
//   name: string;
//   price: string;
//   discount_price?: string | null; // allow null + undefined
//   description?: string;
//   colors?: string[];
//   length?: string;
//   category?: Category;
//   images: ProductImage[];
//   options?: Array<{
//     id: number;
//     name: string;
//     price: string;
//     image?: string | File;
//   }>;
// }

// // 🔹 Featured product = same as Product
// export type FeaturedProduct = Product;

// // 🔹 Product group (used in ItemsGroup or dashboard)
// export interface ProductGroupData {
//   id: number;
//   name: string;
//   products: Product[];
// }

// // 🔹 Combined response for homepage (featured + categories)
// export interface CategoriesAndFeaturedProducts {
//   featured_products: Product[];
//   categories: Category[];
// }

// // 🔹 Generic API responses
// export interface PaginatedResponse<T> {
//   count: number;
//   next: string | null;
//   previous: string | null;
//   results: T[];
// }

// export interface FilteredProductResponse<T> {
//   count: number;
//   results: T[];
// }

// // 🔹 Product filter query params
// export interface ProductFilters {
//   search?: string;
//   category?: string;
//   categories?: string;
// }




// export interface CouponResponse {
//   code: string;
//   discount_type: "fixed" | "percentage";
//   discount_value: number;
//   products: {
//     id: number;
//     name: string;
//     price: number;
//     discount_price: number | null;
//   }[];
//   message: string;
// }










// src/types/product.ts
// ──────────────────────────────────────────────────────────────────────
// 1. Core building blocks
// ──────────────────────────────────────────────────────────────────────
export interface Category {
  id: number;
  name: string;
  slug: string;
  image?: string | null;
}

export interface ProductImage {
  id: number;
  image: string;
  is_thumbnail: boolean;
}

/**
 * A single variant/option of a product.
 * Used in `Product.options` (always an array, even if empty).
 */
export interface ProductOption {
  id: number;
  name: string;
  price: string;               // keep as string to match API
  image?: string | File;       // optional image for the variant
}

/**
 * The **single source of truth** for every product in the app.
 * Featured, Recommended, Category-list, Product-detail – all use this.
 */
export interface Product {
  id: number;
  name: string;
  slug?: string;               // optional – not every endpoint returns it
  price: string;
  discount_price?: string | null;
  description?: string;
  colors?: string[];
  length?: string;
  quantity?: number;           // stock quantity (optional)
  availability?: boolean;
  hot_deal?: boolean;
  featured?: boolean;
  recent?: boolean;
  extra_info?: string;

  // Relations
  category?: Category;
  images: ProductImage[];
  options: ProductOption[];    // **always an array**
}

/**
 * FeaturedProduct is just an alias – no extra fields.
 * This guarantees 100 % compatibility everywhere.
 */
export type FeaturedProduct = Product;

// ──────────────────────────────────────────────────────────────────────
// 2. API response shapes (unchanged, just re-exported)
// ──────────────────────────────────────────────────────────────────────
export interface ErrorResponse {
  detail?: string;
  message?: string;
  [key: string]: any;
}

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

export interface ProductGroupData {
  id: number;
  name: string;
  products: Product[];
}

export interface CategoriesAndFeaturedProducts {
  featured_products: Product[];
  categories: Category[];
}

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

export interface ProductFilters {
  search?: string;
  category?: string;
  categories?: string;
}

// ──────────────────────────────────────────────────────────────────────
// 3. Coupon response (kept exactly as you wrote)
// ──────────────────────────────────────────────────────────────────────
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

// ──────────────────────────────────────────────────────────────────────
// 4. Helper types for the UI (optional but super handy)
// ──────────────────────────────────────────────────────────────────────
/** Cart line as stored by CartContext */
export interface CartItem {
  cartItemId: string;          // unique identifier for the line
  id: number;                  // product.id
  name: string;
  price: number;
  discount_price?: number | null;
  quantity: number;
  selectedOption?: string;     // "default" for non-variant, otherwise option name
  image: string;
}

/** Props that every ProductCard receives */
export interface ProductCardProps {
  product: Product;
  totalQuantity: number;
  onOpenDetail: (p: Product) => void;
  onOpenOptions: (p: Product) => void;
  onAddToCart: (p: Product) => void;
  onUpdateQuantity: (cartItemId: string, qty: number) => void;
  getCartItems: (p: Product) => CartItem[];
}