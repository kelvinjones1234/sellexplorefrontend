// new token management system
// new token management system
// new token management system
// new token management system
// new token management system
// new token management system
// new token management system
// new token management system
// new token management system




import { api } from "@/constant/baseUrl"; 
import { ErrorResponse, Product, Category, ProductOption, OptionsNote } from "./types";
import { AxiosError } from "axios";

// --- Interfaces ---
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface CategoryResponse {
  id: number;
  name: string;
  image: string;
}

interface Coupon {
  id: number;
  code: string;
  discount_amount: string | null;
  discount_percentage: string | null;
  valid_from: string;
  valid_until: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  products: number[];
}

class APIClient {
  private static instance: APIClient;

  private constructor() {}

  static getInstance(): APIClient {
    if (!APIClient.instance) {
      APIClient.instance = new APIClient();
    }
    return APIClient.instance;
  }

  // --- Helper: Standardize Error Handling ---
  private async request<T>(promise: Promise<any>): Promise<T> {
    try {
      const response = await promise;
      return response.data;
    } catch (error: any) {
      const axiosError = error as AxiosError<ErrorResponse>;
      let message = "An unexpected error occurred";

      if (axiosError.response?.data) {
        const data = axiosError.response.data;
        message = data.detail || data.message || message;
      } else if (axiosError.message) {
        message = axiosError.message;
      }

      throw new Error(message);
    }
  }

  // --- Coupon API methods ---
  async getCoupons(page = 1, search = "", page_size = 10): Promise<PaginatedResponse<Coupon>> {
    return this.request(
      api.get("/coupons/", {
        params: { page, page_size, search: search.trim() || undefined },
      })
    );
  }

  async getCoupon(id: number): Promise<Coupon> {
    return this.request(api.get(`/coupons/${id}/`));
  }

  async createCoupon(data: FormData): Promise<Coupon> {
    return this.request(api.post("/coupons/", data));
  }

  async updateCoupon(id: number, data: FormData): Promise<Coupon> {
    return this.request(api.put(`/coupons/${id}/`, data));
  }

  async deleteCoupon(id: number): Promise<void> {
    return this.request(api.delete(`/coupons/${id}/`));
  }

  // --- Product API methods ---
  async getProducts(page = 1, search = "", page_size = 10): Promise<PaginatedResponse<Product>> {
    return this.request(
      api.get("/products-paginated/", {
        params: { page, page_size, search: search.trim() || undefined },
      })
    );
  }

  async getProduct(productId: number): Promise<Product> {
    return this.request(api.get(`/products/${productId}/`));
  }

  async updateProduct(id: number | string, data: FormData): Promise<Product> {
    return this.request(api.put(`/products/${id}/`, data));
  }

  async deleteProduct(id: number | string): Promise<void> {
    return this.request(api.delete(`/products/${id}/`));
  }

  async deleteProductsBulk(ids: number[]): Promise<void> {
    await Promise.all(
      ids.map((id) => this.request(api.delete(`/products/${id}/`)))
    );
  }

  // --- Coupon Products ---
  async getCouponProducts(): Promise<{ id: number; name: string }[]> {
    return this.request(api.get("/coupon-items/"));
  }

  // --- Category API methods ---
  async getCategories(page = 1, search = "", page_size = 10): Promise<PaginatedResponse<Category>> {
    return this.request(
      api.get("/categories-paginated/", {
        params: { page, page_size, search: search.trim() || undefined },
      })
    );
  }

  async getCatForManager(): Promise<CategoryResponse[]> {
    return this.request(api.get("/categories/"));
  }

  async addCategory(name: string, image: File | null): Promise<CategoryResponse> {
    const formData = new FormData();
    formData.append("name", name);
    if (image) formData.append("image", image);

    return this.request(api.post("/categories/", formData));
  }

  async updateCategory(id: number, name: string, image: File | null): Promise<CategoryResponse> {
    const formData = new FormData();
    formData.append("name", name);
    if (image) formData.append("image", image);

    return this.request(api.put(`/categories/${id}/`, formData));
  }

  async deleteCategory(id: number | string): Promise<void> {
    return this.request(api.delete(`/categories/${id}/`));
  }

  // --- Image Handling ---
  async updateProductImages(productId: number, imagesFormData: FormData): Promise<any[]> {
    return this.request(api.post(`/products/${productId}/images/update/`, imagesFormData));
  }

  async deleteProductImage(imageId: number): Promise<void> {
    return this.request(api.delete(`/products/images/${imageId}/`));
  }

  async setProductThumbnail(productId: number, imageId: number): Promise<void> {
    return this.request(
      api.put(`/products/${productId}/images/${imageId}/`, { is_thumbnail: true })
    );
  }

  // --- Product Options ---
  async getOptionTemplates(): Promise<ProductOption[]> {
    return this.request(api.get("/product-options/"));
  }

  async createProductOption(data: any): Promise<ProductOption> {
    return this.request(api.post("/product-options/", data));
  }

  async updateProductOption(optionId: number, data: Partial<ProductOption>): Promise<ProductOption> {
    return this.request(api.put(`/product-options/${optionId}/`, data));
  }

  // --- Option Notes ---
  async createOptionsNote(data: { note: string; product: number }): Promise<OptionsNote> {
    return this.request(api.post("/options-notes/", data));
  }

  async updateOptionsNote(noteId: number, data: { note: string; product: number }): Promise<OptionsNote> {
    return this.request(api.put(`/options-notes/${noteId}/`, data));
  }

  /**
   * Helper to check authentication status.
   * Prefer using useAuth().isAuthenticated in React components.
   */
  isAuthenticated(): boolean {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem("access");
  }
}

export const apiClient = APIClient.getInstance();