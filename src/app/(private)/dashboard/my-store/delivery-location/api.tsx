import { API_BASE } from "@/constant/baseUrl";
import { ErrorResponse, DeliveryArea } from "./types";

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

  // --- Delivery Locations API methods (Fixed endpoints) ---
  async getDeliveryAreas(): Promise<PaginatedResponse<DeliveryArea>> {
    const response = await this.fetchWithTimeout(
      `${API_BASE_URL}/delivery-locations/`,
      {
        method: "GET",
        headers: this.accessToken
          ? { Authorization: `Bearer ${this.accessToken}` }
          : {},
      }
    );

    return this.handleResponse<PaginatedResponse<DeliveryArea>>(
      response,
      "Failed to fetch delivery areas"
    );
  }

  async createDeliveryArea(data: {
    location: string;
    delivery_fee: string;
  }): Promise<DeliveryArea> {
    const response = await this.fetchWithTimeout(
      `${API_BASE_URL}/delivery-locations/`,
      {
        method: "POST",
        body: JSON.stringify(data),
        headers: this.accessToken
          ? { Authorization: `Bearer ${this.accessToken}` }
          : {},
      }
    );
    return this.handleResponse<DeliveryArea>(
      response,
      "Failed to create delivery area"
    );
  }

  async updateDeliveryArea(
    id: number,
    data: { location: string; delivery_fee: string }
  ): Promise<DeliveryArea> {
    const response = await this.fetchWithTimeout(
      `${API_BASE_URL}/delivery-locations/${id}/`,
      {
        method: "PATCH",
        body: JSON.stringify(data),
        headers: this.accessToken
          ? { Authorization: `Bearer ${this.accessToken}` }
          : {},
      }
    );
    return this.handleResponse<DeliveryArea>(
      response,
      "Failed to update delivery area"
    );
  }

  async deleteDeliveryArea(id: number): Promise<void> {
    const response = await this.fetchWithTimeout(
      `${API_BASE_URL}/delivery-locations/${id}/`,
      {
        method: "DELETE",
        headers: this.accessToken
          ? { Authorization: `Bearer ${this.accessToken}` }
          : {},
      }
    );

    return this.handleResponse<void>(
      response,
      "Failed to delete delivery area"
    );
  }
}

export const apiClient = APIClient.getInstance();
