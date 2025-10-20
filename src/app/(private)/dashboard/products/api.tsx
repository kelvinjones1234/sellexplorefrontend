import { API_BASE } from "@/constant/baseUrl";
import {
  ErrorResponse,
  Product,
  Category,
  ProductOption,
  OptionsNote,
} from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || API_BASE;

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

type TokenChangeListener = (token: string | null) => void;

class APIClient {
  private accessToken: string | null = null;
  private static instance: APIClient;
  private tokenChangeListeners: Set<TokenChangeListener> = new Set();

  private constructor() {
    // Initialize token from localStorage if available
    this.initializeToken();
  }

  static getInstance(): APIClient {
    if (!APIClient.instance) {
      APIClient.instance = new APIClient();
    }
    return APIClient.instance;
  }

  private initializeToken(): void {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("access");
      if (storedToken) {
        this.accessToken = storedToken;
      }
    }
  }

  /**
   * Set access token and notify all listeners
   */
  setAccessToken(token: string | null): void {
    const previousToken = this.accessToken;
    this.accessToken = token;

    // Update localStorage
    if (typeof window !== "undefined") {
      if (token) {
        localStorage.setItem("access", token);
      } else {
        localStorage.removeItem("access");
      }
    }

    // Notify listeners only if token actually changed
    if (previousToken !== token) {
      this.notifyTokenChangeListeners(token);
    }
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  /**
   * Add listener for token changes
   */
  addTokenChangeListener(listener: TokenChangeListener): void {
    this.tokenChangeListeners.add(listener);
  }

  /**
   * Remove listener for token changes
   */
  removeTokenChangeListener(listener: TokenChangeListener): void {
    this.tokenChangeListeners.delete(listener);
  }

  /**
   * Notify all listeners of token changes
   */
  private notifyTokenChangeListeners(token: string | null): void {
    this.tokenChangeListeners.forEach((listener) => {
      try {
        listener(token);
      } catch (error) {
        console.error("Error in token change listener:", error);
      }
    });
  }

  /**
   * Clear all tokens and reset client state
   */
  clearTokens(): void {
    this.setAccessToken(null);
  }

  private async fetchWithTimeout(
    url: string,
    options: RequestInit = {},
    timeout = 10000
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const headers = new Headers(options.headers);
      // Only set JSON Content-Type if body is NOT FormData
      if (!(options.body instanceof FormData)) {
        headers.set("Content-Type", "application/json");
      }

      // Add authorization header if token exists
      if (this.accessToken) {
        headers.set("Authorization", `Bearer ${this.accessToken}`);
      }

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers,
      });

      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  private async handleResponse<T>(
    response: Response,
    defaultError: string
  ): Promise<T> {
    if (!response.ok) {
      let message = defaultError;
      try {
        const errorData: ErrorResponse = await response.json();
        if (errorData.detail) {
          message = errorData.detail;
        } else if (errorData.message) {
          message = errorData.message;
        }
      } catch (parseError) {
        // If JSON parsing fails, use default error message
        console.warn("Failed to parse error response:", parseError);
      }

      const error = new Error(message);
      (error as any).status = response.status;
      throw error;
    }

    // Handle no-content responses
    if (response.status === 204) {
      return {} as T;
    }

    try {
      return (await response.json()) as T;
    } catch (parseError) {
      console.error("Failed to parse response JSON:", parseError);
      throw new Error("Invalid response format");
    }
  }

  // --- Coupon API methods ---
  async getCoupons(
    page = 1,
    search = "",
    page_size = 10
  ): Promise<PaginatedResponse<Coupon>> {
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: page_size.toString(),
    });

    if (search.trim()) {
      params.append("search", search.trim());
    }

    const response = await this.fetchWithTimeout(
      `${API_BASE_URL}/coupons/?${params.toString()}`,
      { method: "GET" }
    );

    return this.handleResponse<PaginatedResponse<Coupon>>(
      response,
      "Failed to fetch coupons"
    );
  }

  async createCoupon(data: FormData): Promise<Coupon> {
    const response = await this.fetchWithTimeout(
      `${API_BASE_URL}/coupons/`,
      {
        method: "POST",
        body: data,
      }
    );
    return this.handleResponse<Coupon>(response, "Failed to create coupon");
  }

  async updateCoupon(id: number, data: FormData): Promise<Coupon> {
    const response = await this.fetchWithTimeout(
      `${API_BASE_URL}/coupons/${id}/`,
      {
        method: "PUT",
        body: data,
      }
    );
    return this.handleResponse<Coupon>(response, "Failed to update coupon");
  }

  async deleteCoupon(id: number): Promise<void> {
    const response = await this.fetchWithTimeout(
      `${API_BASE_URL}/coupons/${id}/`,
      { method: "DELETE" }
    );
    await this.handleResponse<void>(response, "Failed to delete coupon");
  }

  // --- Product API methods ---
  async getProducts(
    page = 1,
    search = "",
    page_size = 10
  ): Promise<PaginatedResponse<Product>> {
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: page_size.toString(),
    });

    if (search.trim()) {
      params.append("search", search.trim());
    }

    const response = await this.fetchWithTimeout(
      `${API_BASE_URL}/products-paginated/?${params.toString()}`,
      { method: "GET" }
    );

    return this.handleResponse<PaginatedResponse<Product>>(
      response,
      "Failed to fetch products"
    );
  }

  // --- Coupon products ---
  async getCouponProducts(): Promise<{ id: number; name: string }[]> {
    const response = await this.fetchWithTimeout(
      `${API_BASE_URL}/coupon-items/`,
      { method: "GET" }
    );
    return this.handleResponse<{ id: number; name: string }[]>(
      response,
      "Failed to fetch coupon products"
    );
  }

  // --- Delete product API methods ---
  async deleteProduct(id: number | string): Promise<void> {
    const response = await this.fetchWithTimeout(
      `${API_BASE_URL}/products/${id}/`,
      { method: "DELETE" }
    );

    if (!response.ok) {
      let errorMessage = "Failed to delete product";
      try {
        const errorData = await response.json();
        if (errorData.detail || errorData.message) {
          errorMessage = errorData.detail || errorData.message;
        }
      } catch {
        // Use default error message if parsing fails
      }
      throw new Error(errorMessage);
    }
  }

  async deleteProductsBulk(ids: number[]): Promise<void> {
    await Promise.all(
      ids.map(async (id) => {
        const response = await this.fetchWithTimeout(
          `${API_BASE_URL}/products/${id}/`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${this.accessToken}`,
            },
          }
        );

        if (!response.ok) {
          let errorMessage = `Failed to delete product ${id}`;
          try {
            const errorData = await response.json();
            if (errorData.detail || errorData.message) {
              errorMessage = errorData.detail || errorData.message;
            }
          } catch {
            // Use default error message if parsing fails
          }
          throw new Error(errorMessage);
        }
      })
    );
  }

  // --- Category API methods ---
  async getCategories(
    page = 1,
    search = "",
    page_size = 10
  ): Promise<PaginatedResponse<Category>> {
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: page_size.toString(),
    });

    if (search.trim()) {
      params.append("search", search.trim());
    }

    const response = await this.fetchWithTimeout(
      `${API_BASE_URL}/categories-paginated/?${params.toString()}`,
      { method: "GET" }
    );

    return this.handleResponse<PaginatedResponse<Category>>(
      response,
      "Failed to fetch categories"
    );
  }

  async getCatForManager(): Promise<CategoryResponse[]> {
    const response = await this.fetchWithTimeout(
      `${API_BASE_URL}/categories/`,
      { method: "GET" }
    );

    return this.handleResponse<CategoryResponse[]>(
      response,
      "Failed to fetch categories"
    );
  }

  async addCategory(
    name: string,
    image: File | null
  ): Promise<CategoryResponse> {
    const formData = new FormData();
    formData.append("name", name);
    if (image) {
      formData.append("image", image);
    }

    const response = await this.fetchWithTimeout(
      `${API_BASE_URL}/categories/`,
      {
        method: "POST",
        body: formData,
        headers: this.accessToken
          ? { Authorization: `Bearer ${this.accessToken}` }
          : {},
      }
    );

    return this.handleResponse<CategoryResponse>(
      response,
      "Failed to create category"
    );
  }

  async updateCategory(
    id: number,
    name: string,
    image: File | null
  ): Promise<CategoryResponse> {
    const formData = new FormData();
    formData.append("name", name);

    if (image) {
      formData.append("image", image);
    }

    const response = await this.fetchWithTimeout(
      `${API_BASE_URL}/categories/${id}/`,
      {
        method: "PUT",
        body: formData,
        headers: this.accessToken
          ? { Authorization: `Bearer ${this.accessToken}` }
          : {},
      }
    );

    return this.handleResponse<CategoryResponse>(
      response,
      "Failed to update category"
    );
  }

  async deleteCategory(id: number | string): Promise<void> {
    const response = await this.fetchWithTimeout(
      `${API_BASE_URL}/categories/${id}/`,
      { method: "DELETE" }
    );

    if (!response.ok) {
      let errorMessage = "Failed to delete category";
      try {
        const errorData = await response.json();
        if (errorData.detail || errorData.message) {
          errorMessage = errorData.detail || errorData.message;
        }
      } catch {
        // Use default error message if parsing fails
      }
      throw new Error(errorMessage);
    }
  }

  async updateProduct(id: number | string, data: FormData): Promise<Product> {
    const response = await this.fetchWithTimeout(
      `${API_BASE_URL}/products/${id}/`,
      {
        method: "PUT",
        body: data,
        headers: this.accessToken
          ? { Authorization: `Bearer ${this.accessToken}` }
          : {},
      }
    );
    return this.handleResponse<Product>(response, "Failed to update product");
  }

  async updateProductImages(
    productId: number,
    imagesFormData: FormData
  ): Promise<any[]> {
    console.log(`FormData entry: ${imagesFormData}`);

    const response = await this.fetchWithTimeout(
      `${API_BASE_URL}/products/${productId}/images/update/`,
      {
        method: "POST",
        body: imagesFormData,
        headers: this.accessToken
          ? { Authorization: `Bearer ${this.accessToken}` }
          : {},
      }
    );
    return this.handleResponse<any[]>(
      response,
      "Failed to update product images"
    );
  }

  async deleteProductImage(imageId: number): Promise<void> {
    const response = await this.fetchWithTimeout(
      `${API_BASE_URL}/products/images/${imageId}/`,
      { method: "DELETE" }
    );

    if (!response.ok) {
      let errorMessage = "Failed to delete image";
      try {
        const errorData = await response.json();
        if (errorData.detail || errorData.message) {
          errorMessage = errorData.detail || errorData.message;
        }
      } catch {
        // Use default error message if parsing fails
      }
      throw new Error(errorMessage);
    }
  }

  async setProductThumbnail(productId: number, imageId: number): Promise<void> {
    const response = await this.fetchWithTimeout(
      `${API_BASE_URL}/products/${productId}/images/${imageId}/`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_thumbnail: true }),
      }
    );

    if (!response.ok) {
      let errorMessage = "Failed to update thumbnail";
      try {
        const errorData = await response.json();
        if (errorData.detail || errorData.message) {
          errorMessage = errorData.detail || errorData.message;
        }
      } catch {
        // Use default error message if parsing fails
      }
      throw new Error(errorMessage);
    }
  }

  async updateProductOption(
    optionId: number,
    data: Partial<ProductOption>
  ): Promise<ProductOption> {
    const response = await this.fetchWithTimeout(
      `${API_BASE_URL}/product-options/${optionId}/`,
      {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.accessToken}`,
        },
      }
    );
    return this.handleResponse<ProductOption>(
      response,
      "Failed to update product option"
    );
  }

  async createProductOption(data: any): Promise<ProductOption> {
    console.log("createProductOption payload:", data);
    const response = await this.fetchWithTimeout(
      `${API_BASE_URL}/product-options/`,
      {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.accessToken}`,
        },
      }
    );
    return this.handleResponse<ProductOption>(
      response,
      "Failed to create product option"
    );
  }

  async createOptionsNote(data: {
    note: string;
    product: number;
  }): Promise<OptionsNote> {
    console.log("createOptionsNote payload:", data);
    const response = await this.fetchWithTimeout(
      `${API_BASE_URL}/options-notes/`,
      {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.accessToken}`,
        },
      }
    );
    return this.handleResponse<OptionsNote>(
      response,
      "Failed to create options note"
    );
  }


  async getCoupon(id: number): Promise<Coupon> {
  const response = await this.fetchWithTimeout(
    `${API_BASE_URL}/coupons/${id}/`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: this.accessToken
          ? `Bearer ${this.accessToken}`
          : "",
      },
    }
  );

  return this.handleResponse<Coupon>(response, "Failed to fetch coupon");
}

  async updateOptionsNote(
    noteId: number,
    data: { note: string; product: number }
  ): Promise<OptionsNote> {
    console.log("updateOptionsNote payload:", data);
    const response = await this.fetchWithTimeout(
      `${API_BASE_URL}/options-notes/${noteId}/`,
      {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.accessToken}`,
        },
      }
    );
    return this.handleResponse<OptionsNote>(
      response,
      "Failed to update options note"
    );
  }

  async getProduct(productId: number): Promise<Product> {
    const response = await this.fetchWithTimeout(
      `${API_BASE_URL}/products/${productId}/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.accessToken}`,
        },
      }
    );

    return this.handleResponse<Product>(response, "Failed to fetch product");
  }

  async getOptionTemplates(): Promise<ProductOption[]> {
    const response = await this.fetchWithTimeout(
      `${API_BASE_URL}/product-options/`,
      {
        method: "GET",
      }
    );
    return this.handleResponse<ProductOption[]>(
      response,
      "Failed to fetch option templates"
    );
  }

  /**
   * Check if the client has a valid token
   */
  isAuthenticated(): boolean {
    return Boolean(this.accessToken);
  }
}

// Export singleton instance
export const apiClient = APIClient.getInstance(); 