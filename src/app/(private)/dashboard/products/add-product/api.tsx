import { API_BASE } from "@/constant/baseUrl";
import {
  ErrorResponse,
  Product,
  ProductOption,
  CategoryResponse,
} from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || API_BASE;

type TokenChangeListener = (token: string | null) => void;

class APIClient {
  private accessToken: string | null = null;
  private static instance: APIClient;
  private tokenChangeListeners: Set<TokenChangeListener> = new Set();

  private constructor() {
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

  setAccessToken(token: string | null): void {
    const previousToken = this.accessToken;
    this.accessToken = token;

    if (typeof window !== "undefined") {
      if (token) {
        localStorage.setItem("access", token);
      } else {
        localStorage.removeItem("access");
      }
    }

    if (previousToken !== token) {
      this.notifyTokenChangeListeners(token);
    }
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  addTokenChangeListener(listener: TokenChangeListener): void {
    this.tokenChangeListeners.add(listener);
  }

  removeTokenChangeListener(listener: TokenChangeListener): void {
    this.tokenChangeListeners.delete(listener);
  }

  private notifyTokenChangeListeners(token: string | null): void {
    this.tokenChangeListeners.forEach((listener) => {
      try {
        listener(token);
      } catch (error) {
        console.error("Error in token change listener:", error);
      }
    });
  }

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
      if (!(options.body instanceof FormData)) {
        headers.set("Content-Type", "application/json");
      }

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
        console.warn("Failed to parse error response:", parseError);
      }

      const error = new Error(message);
      (error as any).status = response.status;
      throw error;
    }

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

  // api.ts

  async postProduct(product: Product): Promise<Product> {
    const formData = new FormData();

    // Basic product fields
    formData.append("name", product.details.name);
    formData.append("category", product.details.category);
    formData.append("description", product.details.description);
    formData.append("price", product.details.price);
    if (product.details.discountPrice) {
      formData.append("discount_price", product.details.discountPrice);
    }
    formData.append("quantity", product.details.quantity);
    formData.append(
      "availability",
      product.details.availability ? "true" : "false"
    );
    formData.append("featured", product.details.featured ? "true" : "false");
    formData.append("recent", product.details.recent ? "true" : "false");
    formData.append("hot_deal", product.details.hot_deal ? "true" : "false");
    formData.append("extra_info", product.details.extraInfo);

    // Images
    product.images.forEach((img, idx) => {
      if (img.file) {
        formData.append(`images[${idx}][image]`, img.file);
        formData.append(
          `images[${idx}][is_thumbnail]`,
          idx === product.thumbnailIndex ? "true" : "false"
        );
      }
    });

    // Options - Always include options, even if empty
    const optionsForBackend = (product.details.options || []).map((option) => ({
      options: option.options || [],
      as_template: option.as_template || false,
      template_name: option.template_name || null,
      note: option.note ? option.note.note : null,
    }));
    formData.append("options", JSON.stringify(optionsForBackend));
    console.log("FormData entries:", Object.fromEntries(formData));
    console.log(`Product ${product.details.name} options:`, optionsForBackend);

    try { 
      const response = await this.fetchWithTimeout(
        `${API_BASE_URL}/products/`,
        {
          method: "POST",
          body: formData,
          headers: this.accessToken
            ? { Authorization: `Bearer ${this.accessToken}` }
            : {},
        }
      );

      return await this.handleResponse<Product>(
        response,
        "Failed to create product"
      );
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
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

  async getCategories(): Promise<CategoryResponse[]> {
    const response = await this.fetchWithTimeout(
      `${API_BASE_URL}/categories/`,
      { method: "GET" }
    );

    return this.handleResponse<CategoryResponse[]>(
      response,
      "Failed to fetch categories"
    );
  }

  async postCategory(
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

  isAuthenticated(): boolean {
    return Boolean(this.accessToken);
  }
}

export const apiClient = APIClient.getInstance();
