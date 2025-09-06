// PRODUCT MAIN PAGE
// PRODUCT MAIN PAGE

import { API_BASE } from "@/constant/baseUrl";
import { ErrorResponse, Product, Category } from "./types";

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

    // Remove Content-Type header for FormData to set boundary automatically
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

    // Remove Content-Type header for FormData to set boundary automatically
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
    console.log("FormData contents:");
    for (let [key, value] of data.entries()) {
        console.log(key, value);
    }
    
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

  /**
   * Check if the client has a valid token
   */
  isAuthenticated(): boolean {
    return Boolean(this.accessToken);
  }
}

// Export singleton instance
export const apiClient = APIClient.getInstance();
