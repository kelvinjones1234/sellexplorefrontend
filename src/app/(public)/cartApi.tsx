import { API_BASE_URL } from "@/constant/baseUrl";
import { getStoreNameFromHost } from "./utils/getStoreName";
import { ErrorResponse, CouponResponse } from "./types"; // Adjust import path as needed


async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeout = 10000
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const headers = new Headers(options.headers);

    // Only set Content-Type if not FormData and not already set
    if (!(options.body instanceof FormData) && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
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
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error(`Request timed out after ${timeout / 1000} seconds`);
    }
    throw error;
  }
}

async function handleResponse<T>(
  response: Response,
  defaultError: string,
  cacheKey?: string
): Promise<T> {
  // Handle 304 Not Modified
  if (response.status === 304) {
    // Note: Caching logic would need to be implemented if desired for cart operations
    throw new Error("304 Not Modified but no cached data available");
  }

  // Handle non-OK responses
  if (!response.ok) {
    let message = defaultError;
    try {
      const errorData: ErrorResponse = await response.json();
      message = errorData.detail || errorData.message || defaultError;
    } catch {
      // Ignore JSON parse error and use default message
    }

    const error = new Error(message);
    (error as any).status = response.status;
    throw error;
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  const data = (await response.json()) as T;

  return data;
}

async function getStoreName(): Promise<string | null> {
  if (typeof window === "undefined") {
    try {
      const { headers } = await import("next/headers");
      const headersList = await headers();
      const host = headersList.get("host");
      return getStoreNameFromHost(host || undefined);
    } catch (error) {
      console.error("Failed to get store name from headers:", error);
      return null;
    }
  } else {
    return getStoreNameFromHost();
  }
}

// --------------- Cart API ---------------

export const cartApi = {
  async applyCoupon(
    code: string,
    storeIdentifier?: string
  ): Promise<CouponResponse> {
    const store_name = storeIdentifier || (await getStoreName());

    if (!store_name) {
      throw new Error("Could not determine the store name.");
    }

    const url = `${API_BASE_URL}/coupon-check/${store_name}/`;

    const response = await fetchWithTimeout(url, {
      method: "POST",
      body: JSON.stringify({ code }),
    });

    return handleResponse<CouponResponse>(response, "Failed to apply coupon");
  },

  async createCustomer(data: any, storeIdentifier?: string): Promise<any> {
    const store_name = storeIdentifier || (await getStoreName());

    if (!store_name) {
      throw new Error("Could not determine the store name.");
    }

    const url = `${API_BASE_URL}/customers/${store_name}/`;

    const response = await fetchWithTimeout(url, {
      method: "POST",
      body: JSON.stringify(data),
    });

    return handleResponse<any>(response, "Failed to create customer");
  },

  async createOrder(data: any, storeIdentifier?: string): Promise<any> {
    const store_name = storeIdentifier || (await getStoreName());

    if (!store_name) {
      throw new Error("Could not determine the store name.");
    }

    console.log("order data:", data);

    const url = `${API_BASE_URL}/orders/${store_name}/`;

    const response = await fetchWithTimeout(url, {
      method: "POST",
      body: JSON.stringify(data),
    });

    return handleResponse<any>(response, "Failed to create order");
  },

  async updateOrderStatus(
    orderId: number,
    status: string,
    storeIdentifier?: string
  ): Promise<any> {
    const store_name = storeIdentifier || (await getStoreName());

    if (!store_name) {
      throw new Error("Could not determine the store name.");
    }

    const url = `${API_BASE_URL}/orders/${store_name}/${orderId}/status/`;

    const response = await fetchWithTimeout(url, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });

    return handleResponse<any>(response, "Failed to update order status");
  },

  async updateOrderItem(
    orderId: number,
    itemId: number,
    data: {
      quantity?: number;
      option?: string;
      discount_price?: number | null;
    },
    storeIdentifier?: string
  ): Promise<any> {
    const store_name = storeIdentifier || (await getStoreName());

    if (!store_name) {
      throw new Error("Could not determine the store name.");
    }

    const url = `${API_BASE_URL}/orders/${store_name}/${orderId}/items/${itemId}/`;

    const response = await fetchWithTimeout(url, {
      method: "PATCH",
      body: JSON.stringify(data),
    });

    return handleResponse<any>(response, "Failed to update order item");
  },
};