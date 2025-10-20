import { API_BASE } from "@/constant/baseUrl";
import { ErrorResponse } from "./types";

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

  // --- Logo API methods ---
  async getLogo(): Promise<any> {
    const response = await this.fetchWithTimeout(`${API_BASE_URL}/logo/`, {
      method: "GET",
    });
    return this.handleResponse<any>(response, "Failed to fetch logo");
  }

  async updateLogo(logo: File): Promise<any> {
    const formData = new FormData();
    formData.append("logo", logo);
    const response = await this.fetchWithTimeout(`${API_BASE_URL}/logo/`, {
      method: "PUT",
      body: formData,
      headers: this.accessToken
        ? { Authorization: `Bearer ${this.accessToken}` }
        : {},
    });
    return this.handleResponse<any>(response, "Failed to update logo");
  }

  // --- Cover Image API methods ---
  async getCover(): Promise<any> {
    const response = await this.fetchWithTimeout(`${API_BASE_URL}/cover/`, {
      method: "GET",
    });
    return this.handleResponse<any>(response, "Failed to fetch cover image");
  }

  async updateCover(cover_image: File): Promise<any> {
    const formData = new FormData();
    formData.append("cover_image", cover_image);
    const response = await this.fetchWithTimeout(`${API_BASE_URL}/cover/`, {
      method: "PUT",
      body: formData,
      headers: this.accessToken
        ? { Authorization: `Bearer ${this.accessToken}` }
        : {},
    });
    return this.handleResponse<any>(response, "Failed to update cover image");
  }

  isAuthenticated(): boolean {
    return Boolean(this.accessToken);
  }
}

export const apiClient = APIClient.getInstance();
