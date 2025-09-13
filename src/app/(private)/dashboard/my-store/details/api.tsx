import { API_BASE } from "@/constant/baseUrl";
import { ErrorResponse, Store, StoreFAQ } from "./types";

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
    const prev = this.accessToken;
    this.accessToken = token;

    if (typeof window !== "undefined") {
      if (token) {
        localStorage.setItem("access", token);
      } else {
        localStorage.removeItem("access");
      }
    }

    if (prev !== token) {
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
      } catch (err) {
        console.error("Error in token change listener:", err);
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
    } catch (err) {
      clearTimeout(timeoutId);
      throw err;
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
        if (errorData.detail) message = errorData.detail;
        else if (errorData.message) message = errorData.message;
      } catch {
        // keep default
      }
      const error = new Error(message);
      (error as any).status = response.status;
      throw error;
    }

    if (response.status === 204) {
      return {} as T;
    }

    return response.json() as Promise<T>;
  }

  // -------------------
  // Store API methods
  // -------------------
  async getStore(): Promise<Store> {
    const response = await this.fetchWithTimeout(`${API_BASE_URL}/store/`, {
      method: "GET",
    });
    return this.handleResponse<Store>(response, "Failed to fetch store");
  }

  async updateStore(data: Partial<Store>): Promise<Store> {
    const response = await this.fetchWithTimeout(`${API_BASE_URL}/store/`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return this.handleResponse<Store>(response, "Failed to update store");
  }

  async updateStoreWithImages(formData: FormData): Promise<Store> {
    const response = await this.fetchWithTimeout(`${API_BASE_URL}/store/`, {
      method: "PUT",
      body: formData,
      headers: this.accessToken
        ? { Authorization: `Bearer ${this.accessToken}` }
        : {},
    });
    return this.handleResponse<Store>(
      response,
      "Failed to update store with images"
    );
  }

  // -------------------
  // FAQ API methods
  // -------------------
  async getFAQs(): Promise<StoreFAQ[]> {
    const response = await this.fetchWithTimeout(
      `${API_BASE_URL}/store/faqs/`,
      {
        method: "GET",
      }
    );
    return this.handleResponse<StoreFAQ[]>(response, "Failed to fetch FAQs");
  }

  async addFAQ(question: string, answer: string): Promise<StoreFAQ> {
    const response = await this.fetchWithTimeout(
      `${API_BASE_URL}/store/faqs/`,
      {
        method: "POST",
        body: JSON.stringify({ question, answer }),
      }
    );
    return this.handleResponse<StoreFAQ>(response, "Failed to add FAQ");
  }

  async updateFAQ(id: number, data: Partial<StoreFAQ>): Promise<StoreFAQ> {
    const response = await this.fetchWithTimeout(
      `${API_BASE_URL}/store/faqs/${id}/`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      }
    );
    return this.handleResponse<StoreFAQ>(response, "Failed to update FAQ");
  }

  async deleteFAQ(id: number): Promise<void> {
    const response = await this.fetchWithTimeout(
      `${API_BASE_URL}/store/faqs/${id}/`,
      { method: "DELETE" }
    );
    if (!response.ok) {
      throw new Error("Failed to delete FAQ");
    }
  }

  isAuthenticated(): boolean {
    return Boolean(this.accessToken);
  }
}

// Export singleton
export const apiClient = APIClient.getInstance();
