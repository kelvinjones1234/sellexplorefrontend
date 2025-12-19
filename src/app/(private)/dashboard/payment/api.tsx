// // apiClient.ts
// import { API_BASE } from "@/constant/baseUrl";
// import {
//   AddressInfo,
//   BvnInfo,
//   NameInfo,
//   NinInfo,
//   VerificationSummary,
// } from "./types";

// interface WalletStatus {
//   activated: boolean;
//   disabled?: boolean;
//   bank_name?: string;
//   account_number?: string;
//   balance?: number;
//   currency?: string;
// }

// interface WalletSetupData {
//   bank_name: string;
//   account_number: string;
//   pin: string;
//   confirm_pin: string;
// }

// interface WalletUpdateData {
//   bank_name?: string;
//   account_number?: string;
// }

// interface ChangePinData {
//   old_pin: string;
//   new_pin: string;
//   confirm_new_pin: string;
// }

// interface ResetPinData {
//   new_pin: string;
//   confirm_new_pin: string;
// }

// interface WithdrawalData {
//   amount: number;
//   pin: string;
// }

// interface Transaction {
//   id: number;
//   type: string;
//   amount: number;
//   currency: string;
//   status: string;
//   timestamp: string;
//   recipient: string | null;
//   category: string | null;
//   paystack_reference: string | null;
//   description: string;
// }

// interface ErrorResponse {
//   detail?: string;
//   message?: string;
// }

// type TokenChangeListener = (token: string | null) => void;

// class APIClient {
//   private accessToken: string | null = null;
//   private static instance: APIClient;
//   private tokenChangeListeners: Set<TokenChangeListener> = new Set();

//   private constructor() {
//     this.initializeToken();
//   }

//   static getInstance(): APIClient {
//     if (!APIClient.instance) {
//       APIClient.instance = new APIClient();
//     }
//     return APIClient.instance;
//   }

//   private initializeToken(): void {
//     if (typeof window !== "undefined") {
//       const storedToken = localStorage.getItem("access");
//       if (storedToken) {
//         this.accessToken = storedToken;
//       }
//     }
//   }

//   setAccessToken(token: string | null): void {
//     const previousToken = this.accessToken;
//     this.accessToken = token;

//     if (typeof window !== "undefined") {
//       if (token) {
//         localStorage.setItem("access", token);
//       } else {
//         localStorage.removeItem("access");
//       }
//     }

//     if (previousToken !== token) {
//       this.notifyTokenChangeListeners(token);
//     }
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
//         const errorData: any = await response.json();

//         if (errorData.detail) {
//           message = errorData.detail;
//         } else if (errorData.message) {
//           message = errorData.message;
//         } else if (errorData.error) {
//           message = errorData.error; // ✅ handles "error" key
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

//   async validatePin(current_pin: string): Promise<{ message: string }> {
//     const response = await this.fetchWithTimeout(
//       `${API_BASE}/wallet/validate-pin/`,
//       {
//         method: "POST",
//         body: JSON.stringify({ current_pin }),
//       }
//     );
//     return this.handleResponse<{ message: string }>(
//       response,
//       "Failed to validate PIN"
//     );
//   }

//   async withdraw(
//     data: WithdrawalData
//   ): Promise<{ success: string; transaction_id?: number }> {
//     const response = await this.fetchWithTimeout(
//       `${API_BASE}/wallet/withdraw/`,
//       {
//         method: "POST",
//         body: JSON.stringify(data),
//       }
//     );

//     // Clone response to log without consuming the body
//     const clonedResponse = response.clone();
//     const response_data = await clonedResponse.json();
//     console.log("Withdraw response JSON:", response_data);

//     return this.handleResponse<{ success: string; transaction_id?: number }>(
//       response,
//       "Failed to process withdrawal"
//     );
//   }

//   async getTransactions(params: {
//     status?: string;
//     start_date?: string;
//     end_date?: string;
//     transaction_id?: string;
//     amount?: string;
//   }): Promise<Transaction[]> {
//     const query = new URLSearchParams(params as any).toString();
//     const response = await this.fetchWithTimeout(
//       `${API_BASE}/wallet/transactions/?${query}`,
//       {
//         method: "GET",
//       }
//     );
//     return this.handleResponse<Transaction[]>(
//       response,
//       "Failed to fetch transactions"
//     );
//   }

//   async getWalletStatus(): Promise<WalletStatus> {
//     const response = await this.fetchWithTimeout(`${API_BASE}/wallet/status/`, {
//       method: "GET",
//     });
//     return this.handleResponse<WalletStatus>(
//       response,
//       "Failed to fetch wallet status"
//     );
//   }

//   async setupWallet(data: WalletSetupData): Promise<{ message: string }> {
//     const response = await this.fetchWithTimeout(
//       `${API_BASE}/wallet/setup/`,
//       {
//         method: "POST",
//         body: JSON.stringify(data),
//       },
//       60000
//     ); // 30 seconds for this slow external call
//     return this.handleResponse<{ message: string }>(
//       response,
//       "Failed to setup wallet"
//     );
//   }

//   async changePin(data: ChangePinData): Promise<{ message: string }> {
//     const response = await this.fetchWithTimeout(
//       `${API_BASE}/wallet/change-pin/`,
//       { method: "POST", body: JSON.stringify(data) }
//     );
//     return this.handleResponse<{ message: string }>(
//       response,
//       "Failed to change PIN"
//     );
//   }

//   async resetPin(
//     token: string,
//     data: ResetPinData
//   ): Promise<{ message: string }> {
//     const response = await this.fetchWithTimeout(
//       `${API_BASE}/wallet/reset-pin/${token}/`,
//       { method: "POST", body: JSON.stringify(data) }
//     );
//     return this.handleResponse<{ message: string }>(
//       response,
//       "Failed to reset PIN"
//     );
//   }

//   async updateWalletDetails(
//     data: WalletUpdateData
//   ): Promise<{ message: string }> {
//     const response = await this.fetchWithTimeout(`${API_BASE}/wallet/update/`, {
//       method: "PATCH",
//       body: JSON.stringify(data),
//     });
//     return this.handleResponse<{ message: string }>(
//       response,
//       "Failed to update wallet details"
//     );
//   }

//   async submitName(data: NameInfo): Promise<NameInfo> {
//     const response = await this.fetchWithTimeout(
//       `${API_BASE}/verification/name/`,
//       { method: "POST", body: JSON.stringify(data) }
//     );
//     return this.handleResponse<NameInfo>(response, "Failed to submit name");
//   }

//   async submitBvn(
//     data: BvnInfo
//   ): Promise<
//     BvnInfo & { verified: boolean; confidence: string; similarity: number }
//   > {
//     const response = await this.fetchWithTimeout(
//       `${API_BASE}/verification/bvn/`,
//       { method: "POST", body: JSON.stringify(data) }
//     );
//     return this.handleResponse(response, "Failed to submit BVN");
//   }

//   async submitNin(
//     data: NinInfo
//   ): Promise<
//     NinInfo & { verified: boolean; confidence: string; similarity: number }
//   > {
//     const response = await this.fetchWithTimeout(
//       `${API_BASE}/verification/nin/`,
//       { method: "POST", body: JSON.stringify(data) }
//     );
//     return this.handleResponse(response, "Failed to submit NIN");
//   }

//   async submitAddress(data: AddressInfo): Promise<AddressInfo> {
//     const response = await this.fetchWithTimeout(
//       `${API_BASE}/verification/address/`,
//       { method: "POST", body: JSON.stringify(data) }
//     );
//     return this.handleResponse<AddressInfo>(
//       response,
//       "Failed to submit address"
//     );
//   }

//   async getSummary(): Promise<VerificationSummary> {
//     const response = await this.fetchWithTimeout(
//       `${API_BASE}/verification/summary/`,
//       { method: "GET" }
//     );
//     return this.handleResponse<VerificationSummary>(
//       response,
//       "Failed to fetch verification summary"
//     );
//   }

//   async submitFinal(): Promise<{ success: boolean; message: string }> {
//     const response = await this.fetchWithTimeout(
//       `${API_BASE}/verification/submit/`,
//       { method: "POST" }
//     );
//     return this.handleResponse<{ success: boolean; message: string }>(
//       response,
//       "Failed to submit verification"
//     );
//   }
// }

// export const apiClient = APIClient.getInstance(); 



import { API_BASE } from "@/constant/baseUrl";
import {
  AddressInfo,
  BvnInfo,
  NameInfo,
  NinInfo,
  VerificationSummary,
} from "./types";
import { tokenManager } from "@/app/(private)/utils/tokenManager";

interface WalletStatus {
  activated: boolean;
  disabled?: boolean;
  bank_name?: string;
  account_number?: string;
  balance?: number;
  currency?: string;
}

interface WalletSetupData {
  bank_name: string;
  account_number: string;
  pin: string;
  confirm_pin: string;
}

interface WalletUpdateData {
  bank_name?: string;
  account_number?: string;
}

interface ChangePinData {
  old_pin: string;
  new_pin: string;
  confirm_new_pin: string;
}

interface ResetPinData {
  new_pin: string;
  confirm_new_pin: string;
}

interface WithdrawalData {
  amount: number;
  pin: string;
}

interface Transaction {
  id: number;
  type: string;
  amount: number;
  currency: string;
  status: string;
  timestamp: string;
  recipient: string | null;
  category: string | null;
  paystack_reference: string | null;
  description: string;
}

interface ErrorResponse {
  detail?: string;
  message?: string;
}

type TokenChangeListener = (token: string | null) => void;

class APIClient {
  private static instance: APIClient;
  private tokenChangeListeners: Set<TokenChangeListener> = new Set();

  private constructor() {
    // Subscribe to tokenManager changes
    this.initializeTokenListener();
  }

  static getInstance(): APIClient {
    if (!APIClient.instance) {
      APIClient.instance = new APIClient();
    }
    return APIClient.instance;
  }

  private initializeTokenListener(): void {
    // Listen for token changes from tokenManager
    tokenManager.onChange((token: string | null) => {
      this.notifyTokenChangeListeners(token);
    });
  }

  isAuthenticated(): boolean {
    return !!tokenManager.getAccessToken(); // Returns true if a token exists
  }

  setAccessToken(token: string | null): void {
    tokenManager.setAccessToken(token);
  }

  getAccessToken(): string | null {
    return tokenManager.getAccessToken();
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
    tokenManager.setAccessToken(null);
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

      // Add authorization header if token exists
      const accessToken = this.getAccessToken();
      if (accessToken) {
        headers.set("Authorization", `Bearer ${accessToken}`);
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
        const errorData: any = await response.json();

        if (errorData.detail) {
          message = errorData.detail;
        } else if (errorData.message) {
          message = errorData.message;
        } else if (errorData.error) {
          message = errorData.error;
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

  async validatePin(current_pin: string): Promise<{ message: string }> {
    const response = await this.fetchWithTimeout(
      `${API_BASE}/wallet/validate-pin/`,
      {
        method: "POST",
        body: JSON.stringify({ current_pin }),
      }
    );
    return this.handleResponse<{ message: string }>(
      response,
      "Failed to validate PIN"
    );
  }

  async withdraw(
    data: WithdrawalData
  ): Promise<{ success: string; transaction_id?: number }> {
    const response = await this.fetchWithTimeout(
      `${API_BASE}/wallet/withdraw/`,
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );

    // Clone response to log without consuming the body
    const clonedResponse = response.clone();
    const response_data = await clonedResponse.json();
    console.log("Withdraw response JSON:", response_data);

    return this.handleResponse<{ success: string; transaction_id?: number }>(
      response,
      "Failed to process withdrawal"
    );
  }

  async getTransactions(params: {
    status?: string;
    start_date?: string;
    end_date?: string;
    transaction_id?: string;
    amount?: string;
  }): Promise<Transaction[]> {
    const query = new URLSearchParams(params as any).toString();
    const response = await this.fetchWithTimeout(
      `${API_BASE}/wallet/transactions/?${query}`,
      {
        method: "GET",
      }
    );
    return this.handleResponse<Transaction[]>(
      response,
      "Failed to fetch transactions"
    );
  }

  async getWalletStatus(): Promise<WalletStatus> {
    const response = await this.fetchWithTimeout(`${API_BASE}/wallet/status/`, {
      method: "GET",
    });
    return this.handleResponse<WalletStatus>(
      response,
      "Failed to fetch wallet status"
    );
  }

  async setupWallet(data: WalletSetupData): Promise<{ message: string }> {
    const response = await this.fetchWithTimeout(
      `${API_BASE}/wallet/setup/`,
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      60000
    );
    return this.handleResponse<{ message: string }>(
      response,
      "Failed to setup wallet"
    );
  }

  async changePin(data: ChangePinData): Promise<{ message: string }> {
    const response = await this.fetchWithTimeout(
      `${API_BASE}/wallet/change-pin/`,
      { method: "POST", body: JSON.stringify(data) }
    );
    return this.handleResponse<{ message: string }>(
      response,
      "Failed to change PIN"
    );
  }

  async resetPin(
    token: string,
    data: ResetPinData
  ): Promise<{ message: string }> {
    const response = await this.fetchWithTimeout(
      `${API_BASE}/wallet/reset-pin/${token}/`,
      { method: "POST", body: JSON.stringify(data) }
    );
    return this.handleResponse<{ message: string }>(
      response,
      "Failed to reset PIN"
    );
  }

  async updateWalletDetails(
    data: WalletUpdateData
  ): Promise<{ message: string }> {
    const response = await this.fetchWithTimeout(`${API_BASE}/wallet/update/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    return this.handleResponse<{ message: string }>(
      response,
      "Failed to update wallet details"
    );
  }

  async submitName(data: NameInfo): Promise<NameInfo> {
    const response = await this.fetchWithTimeout(
      `${API_BASE}/verification/name/`,
      { method: "POST", body: JSON.stringify(data) }
    );
    return this.handleResponse<NameInfo>(response, "Failed to submit name");
  }

  async submitBvn(
    data: BvnInfo
  ): Promise<
    BvnInfo & { verified: boolean; confidence: string; similarity: number }
  > {
    const response = await this.fetchWithTimeout(
      `${API_BASE}/verification/bvn/`,
      { method: "POST", body: JSON.stringify(data) }
    );
    return this.handleResponse(response, "Failed to submit BVN");
  }

  async submitNin(
    data: NinInfo
  ): Promise<
    NinInfo & { verified: boolean; confidence: string; similarity: number }
  > {
    const response = await this.fetchWithTimeout(
      `${API_BASE}/verification/nin/`,
      { method: "POST", body: JSON.stringify(data) }
    );
    return this.handleResponse(response, "Failed to submit NIN");
  }

  async submitAddress(data: AddressInfo): Promise<AddressInfo> {
    const response = await this.fetchWithTimeout(
      `${API_BASE}/verification/address/`,
      { method: "POST", body: JSON.stringify(data) }
    );
    return this.handleResponse<AddressInfo>(
      response,
      "Failed to submit address"
    );
  }

  async getSummary(): Promise<VerificationSummary> {
    const response = await this.fetchWithTimeout(
      `${API_BASE}/verification/summary/`,
      { method: "GET" }
    );
    return this.handleResponse<VerificationSummary>(
      response,
      "Failed to fetch verification summary"
    );
  }

  async submitFinal(): Promise<{ success: boolean; message: string }> {
    const response = await this.fetchWithTimeout(
      `${API_BASE}/verification/submit/`,
      { method: "POST" }
    );
    return this.handleResponse<{ success: boolean; message: string }>(
      response,
      "Failed to submit verification"
    );
  }
}

export const apiClient = APIClient.getInstance();