// import { API_BASE_URL } from "@/constant/baseUrl";
// import { ErrorResponse, Customer, Order } from "./types";
// import { tokenManager } from "../../utils/tokenManager";


// type TokenChangeListener = (token: string | null) => void;

// interface OrderDetails {
//   id: number;
//   o_id: string;
//   customer: {
//     id: number;
//     name: string;
//     phone: string;
//     email: string;
//     address: string;
//     purchases: number;
//     volume: string;
//     created_at: string;
//     updated_at: string;
//   };
//   delivery_area: {
//     id: number;
//     location: string;
//     delivery_fee: string;
//   };
//   recipient_type: string;
//   order_notes: string;
//   status: "abandoned" | "processing" | "pending" | "fulfilled" | "cancelled";
//   subtotal_amount: string;
//   discount_amount: string;
//   total_amount: string;
//   created_at: string;
//   updated_at: string;
//   items: Array<{
//     id: number;
//     product: {
//       id: number;
//       name: string;
//       price: string;
//       discount_price: string | null;
//       images: Array<{
//         id: number;
//         image: string;
//         is_thumbnail: boolean;
//       }>;
//       product_options: any[];
//     };
//     option: string;
//     quantity: number;
//     price: string;
//     discount_price: string | null;
//     subtotal: string;
//   }>;
// }

// class APIClient {
//   private accessToken: string | null = null;
//   private static instance: APIClient;
//   private tokenChangeListeners: Set<TokenChangeListener> = new Set();

//   private constructor() {
//     this.initializeToken();
//     // Register with TokenManager to listen for token changes
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
//       } catch (err) {
//         console.error("Error in token change listener:", err);
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
//     } catch (err) {
//       clearTimeout(timeoutId);
//       throw err;
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
//         if (errorData.detail) message = errorData.detail;
//         else if (errorData.message) message = errorData.message;
//       } catch {
//         // keep default
//       }
//       const error = new Error(message);
//       (error as any).status = response.status;
//       throw error;
//     }

//     if (response.status === 204) {
//       return {} as T;
//     }

//     return response.json() as Promise<T>;
//   }

//   // -------------------
//   // Customer API methods
//   // -------------------
//   async getCustomers(search: string = ""): Promise<Customer[]> {
//     const url = search
//       ? `${API_BASE_URL}/customers/?search=${encodeURIComponent(search)}`
//       : `${API_BASE_URL}/customers/`;
//     const response = await this.fetchWithTimeout(url, {
//       method: "GET",
//     });
//     return this.handleResponse<Customer[]>(
//       response,
//       "Failed to fetch customers"
//     );
//   }

//   async createCustomer(data: Partial<Customer>): Promise<Customer> {
//     const response = await this.fetchWithTimeout(`${API_BASE_URL}/customers/`, {
//       method: "POST",
//       body: JSON.stringify(data),
//     });
//     return this.handleResponse<Customer>(response, "Failed to create customer");
//   }

//   async updateCustomer(id: number, data: Partial<Customer>): Promise<Customer> {
//     const response = await this.fetchWithTimeout(
//       `${API_BASE_URL}/customers/${id}/`,
//       {
//         method: "PUT",
//         body: JSON.stringify(data),
//       }
//     );
//     return this.handleResponse<Customer>(response, "Failed to update customer");
//   }

//   async deleteCustomer(id: number): Promise<void> {
//     const response = await this.fetchWithTimeout(
//       `${API_BASE_URL}/customers/${id}/`,
//       {
//         method: "DELETE",
//       }
//     );
//     if (!response.ok) {
//       throw new Error("Failed to delete customer");
//     }
//   }

//   // -------------------
//   // Order API methods
//   // -------------------
//   async getOrders(search: string = ""): Promise<Order[]> {
//     const url = search
//       ? `${API_BASE_URL}/orders/?search=${encodeURIComponent(search)}`
//       : `${API_BASE_URL}/orders/`;
//     const response = await this.fetchWithTimeout(url, {
//       method: "GET",
//     });

//     return this.handleResponse<Order[]>(response, "Failed to fetch orders");
//   }

//   async getOrder(id: number): Promise<Order> {
//     const response = await this.fetchWithTimeout(
//       `${API_BASE_URL}/orders/${id}/`,
//       {
//         method: "GET",
//       }
//     );
//     return this.handleResponse<Order>(response, "Failed to fetch order");
//   }

//   async getOrderDetails(orderId: string): Promise<OrderDetails> {
//     const response = await this.fetchWithTimeout(
//       `${API_BASE_URL}/order-details/${orderId}/`,
//       {
//         method: "GET",
//       }
//     );
//     return this.handleResponse<OrderDetails>(response, "Failed to fetch order details");
//   }

//   async updateOrderStatus(
//     orderId: string,
//     status: "cancelled" | "fulfilled"
//   ): Promise<OrderDetails> {
//     const response = await this.fetchWithTimeout(
//       `${API_BASE_URL}/order-details/${orderId}/`,
//       {
//         method: "PATCH",
//         body: JSON.stringify({ status }),
//       }
//     );
//     return this.handleResponse<OrderDetails>(
//       response,
//       `Failed to update order status to ${status}`
//     );
//   }

//   isAuthenticated(): boolean {
//     return Boolean(this.accessToken);
//   }
// }

// // Export singleton
// export const apiClient = APIClient.getInstance();






import { api } from "@/constant/baseUrl";
import { ErrorResponse, Customer, Order } from "./types";
import { AxiosError } from "axios";

// --- Types ---
interface OrderDetails {
  id: number;
  o_id: string;
  customer: {
    id: number;
    name: string;
    phone: string;
    email: string;
    address: string;
    purchases: number;
    volume: string;
    created_at: string;
    updated_at: string;
  };
  delivery_area: {
    id: number;
    location: string;
    delivery_fee: string;
  };
  recipient_type: string;
  order_notes: string;
  status: "abandoned" | "processing" | "pending" | "fulfilled" | "cancelled";
  subtotal_amount: string;
  discount_amount: string;
  total_amount: string;
  created_at: string;
  updated_at: string;
  items: Array<{
    id: number;
    product: {
      id: number;
      name: string;
      price: string;
      discount_price: string | null;
      images: Array<{
        id: number;
        image: string;
        is_thumbnail: boolean;
      }>;
      product_options: any[];
    };
    option: string;
    quantity: number;
    price: string;
    discount_price: string | null;
    subtotal: string;
  }>;
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
  // This wraps Axios promises to return cleaner data or throw formatted errors
  private async request<T>(promise: Promise<any>): Promise<T> {
    try {
      const response = await promise;
      return response.data;
    } catch (error: any) {
      const axiosError = error as AxiosError<ErrorResponse>;
      let message = "An unexpected error occurred";

      if (axiosError.response?.data) {
        // Handle Django Rest Framework error format
        const data = axiosError.response.data;
        message = data.detail || data.message || message;
      } else if (axiosError.message) {
        message = axiosError.message;
      }

      throw new Error(message);
    }
  }

  // -------------------
  // Customer API methods
  // -------------------
  async getCustomers(search: string = ""): Promise<Customer[]> {
    return this.request(
      api.get("/customers/", {
        params: { search: search.trim() || undefined },
      })
    );
  }

  async createCustomer(data: Partial<Customer>): Promise<Customer> {
    return this.request(api.post("/customers/", data));
  }

  async updateCustomer(id: number, data: Partial<Customer>): Promise<Customer> {
    return this.request(api.put(`/customers/${id}/`, data));
  }

  async deleteCustomer(id: number): Promise<void> {
    return this.request(api.delete(`/customers/${id}/`));
  }

  // -------------------
  // Order API methods
  // -------------------
  async getOrders(search: string = ""): Promise<Order[]> {
    return this.request(
      api.get("/orders/", {
        params: { search: search.trim() || undefined },
      })
    );
  }

  async getOrder(id: number): Promise<Order> {
    return this.request(api.get(`/orders/${id}/`));
  }

  async getOrderDetails(orderId: string): Promise<OrderDetails> {
    return this.request(api.get(`/order-details/${orderId}/`));
  }

  async updateOrderStatus(
    orderId: string,
    status: "cancelled" | "fulfilled"
  ): Promise<OrderDetails> {
    return this.request(
      api.patch(`/order-details/${orderId}/`, { status })
    );
  }

  // --- Utility ---
  isAuthenticated(): boolean {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem("access");
  }
}

// Export singleton
export const apiClient = APIClient.getInstance();