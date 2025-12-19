// import { API_BASE } from "@/constant/baseUrl";
// import { tokenManager } from "../../utils/tokenManager";

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || API_BASE;

// interface ErrorResponse {
//   error?: string;
//   detail?: string;
//   message?: string;
// }

// interface UserProfile {
//   id?: number;
//   user?: number;
//   name?: string;
//   email?: string;
//   phone?: string;
//   profile_pic?: string | null;
//   [key: string]: any;
// }

// interface PasswordUpdateData {
//   old_password: string;
//   new_password: string;
//   confirm_password: string;
// }

// type TokenChangeListener = (token: string | null) => void;

// class APIClient {
//   private accessToken: string | null = null;
//   private static instance: APIClient;
//   private tokenChangeListeners: Set<TokenChangeListener> = new Set();

//   private constructor() {
//     this.initializeToken();
//     tokenManager.onChange(this.handleTokenChange.bind(this));
//   }

//   static getInstance(): APIClient {
//     if (!APIClient.instance) {
//       APIClient.instance = new APIClient();
//     }
//     return APIClient.instance;
//   }

//   private initializeToken(): void {
//     this.accessToken = tokenManager.getAccessToken();
//   }

//   private handleTokenChange(token: string | null): void {
//     this.accessToken = token;
//     this.notifyTokenChangeListeners(token);
//   }

//   setAccessToken(token: string | null): void {
//     tokenManager.setAccessToken(token);
//   }

//   getAccessToken(): string | null {
//     return this.accessToken;
//   }

//   addTokenChangeListener(listener: TokenChangeListener): void {
//     this.tokenChangeListeners.add(listener);
//   }

//   removeTokenChangeListener(listener: TokenChangeListener): void {
//     this.tokenChangeListeners.delete(listener);
//   }

//   private notifyTokenChangeListeners(token: string | null): void {
//     this.tokenChangeListeners.forEach((listener) => {
//       try {
//         listener(token);
//       } catch (error) {
//         console.error("Error in token change listener:", error);
//       }
//     });
//   }

//   clearTokens(): void {
//     this.setAccessToken(null);
//   }

//   private async fetchWithTimeout(
//     url: string,
//     options: RequestInit = {},
//     timeout = 10000
//   ): Promise<Response> {
//     const controller = new AbortController();
//     const timeoutId = setTimeout(() => controller.abort(), timeout);
//     try {
//       const headers = new Headers(options.headers);
//       if (!(options.body instanceof FormData)) {
//         headers.set("Content-Type", "application/json");
//       }
//       if (this.accessToken) {
//         headers.set("Authorization", `Bearer ${this.accessToken}`);
//       }
//       const response = await fetch(url, {
//         ...options,
//         signal: controller.signal,
//         headers,
//       });
//       clearTimeout(timeoutId);
//       return response;
//     } catch (error) {
//       clearTimeout(timeoutId);
//       throw error;
//     }
//   }

//   private async handleResponse<T>(
//     response: Response,
//     defaultError: string
//   ): Promise<T> {
//     if (!response.ok) {
//       let message = defaultError;
//       try {
//         const errorData: ErrorResponse = await response.json();
//         if (errorData.error) {
//           message = errorData.error;
//         } else if (errorData.detail) {
//           message = errorData.detail;
//         } else if (errorData.message) {
//           message = errorData.message;
//         }
//       } catch (parseError) {
//         console.warn("Failed to parse error response:", parseError);
//       }
//       const error = new Error(message);
//       (error as any).status = response.status;
//       throw error;
//     }
//     if (response.status === 204) {
//       return {} as T;
//     }
//     try {
//       return (await response.json()) as T;
//     } catch (parseError) {
//       console.error("Failed to parse response JSON:", parseError);
//       throw new Error("Invalid response format");
//     }
//   }

//   async getUserProfile(): Promise<UserProfile> {
//     const response = await this.fetchWithTimeout(`${API_BASE_URL}/profile/`, {
//       method: "GET",
//     });
//     return this.handleResponse<UserProfile>(
//       response,
//       "Failed to fetch user profile"
//     );
//   }

//   async updateUserProfile(data: Partial<UserProfile>): Promise<UserProfile> {
//     const response = await this.fetchWithTimeout(`${API_BASE_URL}/profile/`, {
//       method: "PUT",
//       body: JSON.stringify(data),
//     });
//     console.log("data", data);
    
//     return this.handleResponse<UserProfile>(
//       response,
//       "Failed to update user profile"
//     );
//   }

//   async updatePassword(data: PasswordUpdateData): Promise<void> {
//     const response = await this.fetchWithTimeout(
//       `${API_BASE_URL}/password/change/`,
//       {
//         method: "POST",
//         body: JSON.stringify(data),
//       }
//     );
//     return this.handleResponse<void>(response, "Failed to update password");
//   }

//   async disableAccount(): Promise<void> {
//     const response = await this.fetchWithTimeout(
//       `${API_BASE_URL}/account/disable/`,
//       {
//         method: "POST",
//       }
//     );
//     return this.handleResponse<void>(response, "Failed to disable account");
//   }

//   async deleteAccount(): Promise<void> {
//     const response = await this.fetchWithTimeout(
//       `${API_BASE_URL}/account/delete/`,
//       {
//         method: "DELETE",
//       }
//     );
//     return this.handleResponse<void>(response, "Failed to delete account");
//   }

//   isAuthenticated(): boolean {
//     return Boolean(this.accessToken);
//   }
// }

// export const apiClient = APIClient.getInstance();







import { api } from "@/constant/baseUrl";
import { AxiosError } from "axios";

// --- Interfaces ---
interface ErrorResponse {
  error?: string;
  detail?: string;
  message?: string;
}

export interface UserProfile {
  id?: number;
  user?: number;
  name?: string;
  email?: string;
  phone?: string;
  profile_pic?: string | null;
  [key: string]: any;
}

export interface PasswordUpdateData {
  old_password: string;
  new_password: string;
  confirm_password: string;
}

class APIClient {
  private static instance: APIClient;

  // Singleton pattern
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
        // Handle common Django error fields
        const data = axiosError.response.data;
        message = data.error || data.detail || data.message || message;
      } else if (axiosError.message) {
        message = axiosError.message;
      }

      throw new Error(message);
    }
  }

  // --- Profile Methods ---

  async getUserProfile(): Promise<UserProfile> {
    return this.request(api.get("/profile/"));
  }

  async updateUserProfile(data: Partial<UserProfile>): Promise<UserProfile> {
    // Axios automatically handles JSON stringification and Content-Type
    return this.request(api.put("/profile/", data));
  }

  async updatePassword(data: PasswordUpdateData): Promise<void> {
    return this.request(api.post("/password/change/", data));
  }

  // --- Account Management ---

  async disableAccount(): Promise<void> {
    return this.request(api.post("/account/disable/"));
  }

  async deleteAccount(): Promise<void> {
    return this.request(api.delete("/account/delete/"));
  }

  // --- Utility ---
  isAuthenticated(): boolean {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem("access");
  }
}

export const apiClient = APIClient.getInstance();