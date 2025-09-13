import { API_BASE } from "@/constant/baseUrl";
import { ErrorResponse } from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || API_BASE;

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
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

  // --- Configurations API methods ---
  async getConfiguration(): Promise<any> {
    const response = await this.fetchWithTimeout(
      `${API_BASE_URL}/configurations/`,
      {
        method: "GET",
        headers: this.accessToken
          ? { Authorization: `Bearer ${this.accessToken}` }
          : {},
      }
    );

    return this.handleResponse<any>(response, "Failed to fetch configuration");
  }

  async updateConfiguration(
    data: FormData | Record<string, any>
  ): Promise<any> {
    let body: BodyInit;
    let headers: HeadersInit = {};

    console.log("config", data)

    if (data instanceof FormData) {
      body = data;
      if (this.accessToken) {
        headers = { Authorization: `Bearer ${this.accessToken}` };
      }
    } else {
      body = JSON.stringify(data);
      headers = {
        "Content-Type": "application/json",
        ...(this.accessToken
          ? { Authorization: `Bearer ${this.accessToken}` }
          : {}),
      };
    }

    const response = await this.fetchWithTimeout(
      `${API_BASE_URL}/configurations/`,
      {
        method: "PUT",
        body,
        headers,
      }
    );

    return this.handleResponse<any>(response, "Failed to update configuration");
  }
}

export const apiClient = APIClient.getInstance();
