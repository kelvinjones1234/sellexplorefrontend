// import { API_BASE } from "@/constant/baseUrl";
// import { getStoreNameFromHost } from "./utils/getStoreName";
// import {
//   ErrorResponse,
//   StoreConfig,
//   ProductGroupData,
//   CategoriesAndFeaturedProducts,
//   FilteredProductResponse,
//   ProductFilters,
//   CouponResponse,
// } from "./types";

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || API_BASE;

// interface CacheEntry {
//   data: any;
//   etag?: string;
//   lastModified?: string;
//   timestamp: number;
// }

// // Use WeakMap for better memory management and Map for main cache
// const clientCache = new Map<string, CacheEntry>();
// const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
// const MAX_CACHE_SIZE = 100; // Prevent unlimited cache growth

// // --------------- Cache Management ---------------

// function evictOldestEntries(): void {
//   if (clientCache.size <= MAX_CACHE_SIZE) return;

//   const entries = Array.from(clientCache.entries());
//   entries.sort((a, b) => a[1].timestamp - b[1].timestamp);

//   const entriesToRemove = entries.slice(0, clientCache.size - MAX_CACHE_SIZE);
//   entriesToRemove.forEach(([key]) => clientCache.delete(key));

//   console.log(`🗑️ Evicted ${entriesToRemove.length} old cache entries`);
// }

// function setCacheEntry(key: string, entry: CacheEntry): void {
//   clientCache.set(key, entry);
//   evictOldestEntries();
// }

// // --------------- Fetch Helpers ---------------

// async function fetchWithTimeout(
//   url: string,
//   options: RequestInit = {},
//   timeout = 10000
// ): Promise<Response> {
//   const controller = new AbortController();
//   const timeoutId = setTimeout(() => controller.abort(), timeout);

//   try {
//     const headers = new Headers(options.headers);

//     // Only set Content-Type if not FormData and not already set
//     if (!(options.body instanceof FormData) && !headers.has("Content-Type")) {
//       headers.set("Content-Type", "application/json");
//     }

//     const response = await fetch(url, {
//       ...options,
//       signal: controller.signal,
//       headers,
//     });

//     clearTimeout(timeoutId);
//     return response;
//   } catch (error) {
//     clearTimeout(timeoutId);
//     if (error instanceof DOMException && error.name === "AbortError") {
//       throw new Error(`Request timed out after ${timeout / 1000} seconds`);
//     }
//     throw error;
//   }
// }

// async function handleResponse<T>(
//   response: Response,
//   defaultError: string,
//   cacheKey?: string
// ): Promise<T> {
//   // Handle 304 Not Modified
//   if (response.status === 304) {
//     if (cacheKey && clientCache.has(cacheKey)) {
//       const cached = clientCache.get(cacheKey)!;
//       console.log(
//         `🎯 [CACHE HIT] Using cached data for ${cacheKey} (304 Not Modified)`
//       );
//       return cached.data as T;
//     }
//     throw new Error("304 Not Modified but no cached data available");
//   }

//   // Handle non-OK responses
//   if (!response.ok) {
//     let message = defaultError;
//     try {
//       const errorData: ErrorResponse = await response.json();
//       message = errorData.detail || errorData.message || defaultError;
//     } catch {
//       // Ignore JSON parse error and use default message
//     }

//     const error = new Error(message);
//     (error as any).status = response.status;
//     throw error;
//   }

//   // Handle 204 No Content
//   if (response.status === 204) {
//     return {} as T;
//   }

//   const data = (await response.json()) as T;

//   // Cache successful responses
//   if (cacheKey && response.status === 200) {
//     const etag = response.headers.get("etag");
//     const lastModified = response.headers.get("last-modified");

//     setCacheEntry(cacheKey, {
//       data,
//       etag: etag || undefined,
//       lastModified: lastModified || undefined,
//       timestamp: Date.now(),
//     });

//     console.log(`💾 [CACHE SET] Cached fresh data for ${cacheKey}`);
//   }

//   return data;
// }

// async function getStoreName(): Promise<string | null> {
//   if (typeof window === "undefined") {
//     try {
//       const { headers } = await import("next/headers");
//       const headersList = await headers();
//       const host = headersList.get("host");
//       return getStoreNameFromHost(host || undefined);
//     } catch (error) {
//       console.error("Failed to get store name from headers:", error);
//       return null;
//     }
//   } else {
//     return getStoreNameFromHost();
//   }
// }

// async function cachedFetch<T>(
//   url: string,
//   cacheKey: string,
//   defaultError: string,
//   options: RequestInit = {}
// ): Promise<T> {
//   const cached = clientCache.get(cacheKey);
//   const now = Date.now();

//   // Return cached data if it's still valid
//   if (cached && now - cached.timestamp < CACHE_TTL) {
//     console.log(`⚡ [CACHE HIT] Returning TTL-valid data for ${cacheKey}`);
//     return cached.data as T;
//   }

//   // Prepare conditional request headers
//   const headers = new Headers(options.headers);
//   if (cached?.etag) headers.set("If-None-Match", cached.etag);
//   if (cached?.lastModified)
//     headers.set("If-Modified-Since", cached.lastModified);

//   const response = await fetchWithTimeout(url, {
//     ...options,
//     headers,
//     cache: "no-cache",
//   });

//   return handleResponse<T>(response, defaultError, cacheKey);
// }

// // --------------- API Client ---------------

// export const apiClient = {
//   async getGroupData(storeIdentifier?: string): Promise<ProductGroupData> {
//     const store_name = storeIdentifier || (await getStoreName());

//     if (!store_name) {
//       throw new Error("Could not determine the store name.");
//     }

//     const url = `${API_BASE_URL}/item-group/${store_name}/`;
//     const cacheKey = `group-${store_name}`;

//     return cachedFetch<ProductGroupData>(
//       url,
//       cacheKey,
//       "Failed to fetch product group data"
//     );
//   },

//   async getConfiguration(storeIdentifier?: string): Promise<StoreConfig> {
//     const store_name = storeIdentifier || (await getStoreName());

//     if (!store_name) {
//       throw new Error("Could not determine the store name.");
//     }

//     const url = `${API_BASE_URL}/stores/${store_name}/`;
//     const cacheKey = `store-config-${store_name}`;

//     const storeData = await cachedFetch<{ configurations: StoreConfig }>(
//       url,
//       cacheKey,
//       "Failed to fetch store configuration"
//     );

//     return storeData.configurations;
//   },

//   async getCategoriesAndFeaturedProducts(
//     storeIdentifier?: string
//   ): Promise<CategoriesAndFeaturedProducts> {
//     const store_name = storeIdentifier || (await getStoreName());

//     if (!store_name) {
//       throw new Error("Could not determine the store name.");
//     }

//     const url = `${API_BASE_URL}/featured-and-category/${store_name}/`;
//     const cacheKey = `featured-and-category-${store_name}`;

//     return cachedFetch<CategoriesAndFeaturedProducts>(
//       url,
//       cacheKey,
//       "Failed to fetch featured products and categories"
//     );
//   },

//   async getFilteredProduct(
//     filters: ProductFilters = {},
//     storeIdentifier?: string
//   ): Promise<FilteredProductResponse<any>> {
//     const store_name = storeIdentifier || (await getStoreName());

//     if (!store_name) {
//       throw new Error("Could not determine the store name.");
//     }

//     const params = new URLSearchParams();
//     if (filters.search) params.append("search", filters.search);
//     if (filters.category) params.append("category", filters.category);
//     if (filters.categories) params.append("categories", filters.categories);

//     const queryString = params.toString();
//     const url = `${API_BASE_URL}/items/${store_name}/filtered/${
//       queryString ? `?${queryString}` : ""
//     }`;
//     const cacheKey = `products-filter-${store_name}-${queryString}`;

//     return cachedFetch<FilteredProductResponse<any>>(
//       url,
//       cacheKey,
//       "Failed to fetch filtered products"
//     );
//   },

//   async getProductsByCat(
//     filters: ProductFilters = {},
//     storeIdentifier?: string
//   ): Promise<FilteredProductResponse<any>> {
//     const store_name = storeIdentifier || (await getStoreName());

//     if (!store_name) {
//       throw new Error("Could not determine the store name.");
//     }

//     const params = new URLSearchParams();
//     if (filters.search) params.append("search", filters.search);
//     if (filters.category) params.append("category", filters.category);
//     if (filters.categories) params.append("categories", filters.categories);

//     const queryString = params.toString();
//     const url = `${API_BASE_URL}/items/${store_name}/items/${
//       queryString ? `?${queryString}` : ""
//     }`;
//     const cacheKey = `products-by-cat-${store_name}-${queryString}`;

//     return cachedFetch<FilteredProductResponse<any>>(
//       url,
//       cacheKey,
//       "Failed to fetch products by category"
//     );
//   },

//   async getDeliveryAreaOptions(storeIdentifier?: string): Promise<{
//     store_name: string;
//     delivery_locations: {
//       id: number;
//       location: string;
//       delivery_fee: string;
//     }[];
//   }> {
//     const store_name = storeIdentifier || (await getStoreName());

//     if (!store_name) {
//       throw new Error("Could not determine the store name.");
//     }

//     const url = `${API_BASE_URL}/delivery-locations/${store_name}/`;
//     const cacheKey = `delivery-locations-${store_name}`;

//     return cachedFetch<{
//       store_name: string;
//       delivery_locations: {
//         id: number;
//         location: string;
//         delivery_fee: string;
//       }[];
//     }>(url, cacheKey, "Failed to fetch delivery locations");
//   },

//   async applyCoupon(code: string, storeIdentifier?: string): Promise<CouponResponse> {
//     const store_name = storeIdentifier || (await getStoreName());

//     if (!store_name) {
//       throw new Error("Could not determine the store name.");
//     }

//     const url = `${API_BASE_URL}/coupon-check/${store_name}/`;
//     const cacheKey = `coupon-${store_name}-${code}`;

//     const response = await fetchWithTimeout(url, {
//       method: "POST",
//       body: JSON.stringify({ code }),
//     });

//     return handleResponse<CouponResponse>(
//       response,
//       "Failed to apply coupon",
//       cacheKey
//     );
//   },

//   // --------------- Cache Management Methods ---------------

//   clearCache(pattern?: string): void {
//     if (typeof window === "undefined") return;

//     if (pattern) {
//       const keysToDelete = Array.from(clientCache.keys()).filter((key) =>
//         key.includes(pattern)
//       );
//       keysToDelete.forEach((key) => clientCache.delete(key));
//       console.log(
//         `🗑️ Cleared ${keysToDelete.length} entries matching "${pattern}"`
//       );
//     } else {
//       const count = clientCache.size;
//       clientCache.clear();
//       console.log(`🗑️ Cleared all ${count} cache entries`);
//     }
//   },

//   dehydrateCache(): Record<string, CacheEntry> {
//     if (typeof window !== "undefined") return {};

//     const dehydrated: Record<string, CacheEntry> = {};
//     clientCache.forEach((value, key) => {
//       dehydrated[key] = value;
//     });

//     return dehydrated;
//   },

//   hydrateCache(dehydratedState?: Record<string, CacheEntry>): void {
//     if (
//       typeof window === "undefined" ||
//       !dehydratedState ||
//       Object.keys(dehydratedState).length === 0
//     ) {
//       return;
//     }

//     try {
//       let hydratedCount = 0;
//       Object.entries(dehydratedState).forEach(([key, value]) => {
//         if (!clientCache.has(key) && this.isValidCacheEntry(value)) {
//           clientCache.set(key, value);
//           hydratedCount++;
//         }
//       });

//       if (hydratedCount > 0) {
//         console.log(`💧 [CACHE HYDRATED] Restored ${hydratedCount} entries`);
//         evictOldestEntries(); // Clean up if needed
//       }
//     } catch (error) {
//       console.error("[CACHE] Failed to hydrate cache:", error);
//     }
//   },

//   isValidCacheEntry(entry: any): entry is CacheEntry {
//     return (
//       entry &&
//       typeof entry === "object" &&
//       typeof entry.timestamp === "number" &&
//       entry.data !== undefined
//     );
//   },

//   debugCache(): void {
//     if (typeof window === "undefined") {
//       console.log("Cache debugging only available on the client-side.");
//       return;
//     }

//     console.log("📊 Cache Debug Info:");
//     console.log(`Cache size: ${clientCache.size}/${MAX_CACHE_SIZE} entries`);

//     const now = Date.now();
//     const entries = Array.from(clientCache.entries()).sort(
//       (a, b) => b[1].timestamp - a[1].timestamp
//     );

//     entries.forEach(([key, value]) => {
//       const age = Math.round((now - value.timestamp) / 1000);
//       const isExpired = now - value.timestamp > CACHE_TTL;
//       console.log(
//         `- ${key}: age=${age}s${
//           isExpired ? " (EXPIRED)" : ""
//         }, ETag=${!!value.etag}, LastModified=${!!value.lastModified}`
//       );
//     });
//   },

//   getCacheStats() {
//     return {
//       size: clientCache.size,
//       maxSize: MAX_CACHE_SIZE,
//       ttl: CACHE_TTL / 1000, // in seconds
//       entries: Array.from(clientCache.keys()),
//     };
//   },
// };

import { API_BASE } from "@/constant/baseUrl";
import { getStoreNameFromHost } from "./utils/getStoreName";
import {
  ErrorResponse,
  StoreConfig,
  ProductGroupData,
  CategoriesAndFeaturedProducts,
  FilteredProductResponse,
  ProductFilters,
  CouponResponse,
} from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || API_BASE;

interface CacheEntry {
  data: any;
  etag?: string;
  lastModified?: string;
  timestamp: number;
}

// Use WeakMap for better memory management and Map for main cache
const clientCache = new Map<string, CacheEntry>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const MAX_CACHE_SIZE = 100; // Prevent unlimited cache growth

// --------------- Cache Management ---------------

function evictOldestEntries(): void {
  if (clientCache.size <= MAX_CACHE_SIZE) return;

  const entries = Array.from(clientCache.entries());
  entries.sort((a, b) => a[1].timestamp - b[1].timestamp);

  const entriesToRemove = entries.slice(0, clientCache.size - MAX_CACHE_SIZE);
  entriesToRemove.forEach(([key]) => clientCache.delete(key));

  console.log(`🗑️ Evicted ${entriesToRemove.length} old cache entries`);
}

function setCacheEntry(key: string, entry: CacheEntry): void {
  clientCache.set(key, entry);
  evictOldestEntries();
}

// --------------- Fetch Helpers ---------------

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
    if (cacheKey && clientCache.has(cacheKey)) {
      const cached = clientCache.get(cacheKey)!;
      console.log(
        `🎯 [CACHE HIT] Using cached data for ${cacheKey} (304 Not Modified)`
      );
      return cached.data as T;
    }
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

  // Cache successful responses
  if (cacheKey && response.status === 200) {
    const etag = response.headers.get("etag");
    const lastModified = response.headers.get("last-modified");

    setCacheEntry(cacheKey, {
      data,
      etag: etag || undefined,
      lastModified: lastModified || undefined,
      timestamp: Date.now(),
    });

    console.log(`💾 [CACHE SET] Cached fresh data for ${cacheKey}`);
  }

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

async function cachedFetch<T>(
  url: string,
  cacheKey: string,
  defaultError: string,
  options: RequestInit = {}
): Promise<T> {
  const cached = clientCache.get(cacheKey);
  const now = Date.now();

  // Return cached data if it's still valid
  if (cached && now - cached.timestamp < CACHE_TTL) {
    console.log(`⚡ [CACHE HIT] Returning TTL-valid data for ${cacheKey}`);
    return cached.data as T;
  }

  // Prepare conditional request headers
  const headers = new Headers(options.headers);
  if (cached?.etag) headers.set("If-None-Match", cached.etag);
  if (cached?.lastModified)
    headers.set("If-Modified-Since", cached.lastModified);

  const response = await fetchWithTimeout(url, {
    ...options,
    headers,
    cache: "no-cache",
  });

  return handleResponse<T>(response, defaultError, cacheKey);
}

// --------------- API Client ---------------

export const apiClient = {
  async getGroupData(storeIdentifier?: string): Promise<ProductGroupData> {
    const store_name = storeIdentifier || (await getStoreName());

    if (!store_name) {
      throw new Error("Could not determine the store name.");
    }

    const url = `${API_BASE_URL}/item-group/${store_name}/`;
    const cacheKey = `group-${store_name}`;

    return cachedFetch<ProductGroupData>(
      url,
      cacheKey,
      "Failed to fetch product group data"
    );
  },

  async getConfiguration(storeIdentifier?: string): Promise<StoreConfig> {
    const store_name = storeIdentifier || (await getStoreName());

    if (!store_name) {
      throw new Error("Could not determine the store name.");
    }

    const url = `${API_BASE_URL}/stores/${store_name}/`;
    const cacheKey = `store-config-${store_name}`;

    const storeData = await cachedFetch<{ configurations: StoreConfig }>(
      url,
      cacheKey,
      "Failed to fetch store configuration"
    );

    return storeData.configurations;
  },

  async getCategoriesAndFeaturedProducts(
    storeIdentifier?: string
  ): Promise<CategoriesAndFeaturedProducts> {
    const store_name = storeIdentifier || (await getStoreName());

    if (!store_name) {
      throw new Error("Could not determine the store name.");
    }

    const url = `${API_BASE_URL}/featured-and-category/${store_name}/`;
    const cacheKey = `featured-and-category-${store_name}`;

    return cachedFetch<CategoriesAndFeaturedProducts>(
      url,
      cacheKey,
      "Failed to fetch featured products and categories"
    );
  },

  async getFilteredProduct(
    filters: ProductFilters = {},
    storeIdentifier?: string
  ): Promise<FilteredProductResponse<any>> {
    const store_name = storeIdentifier || (await getStoreName());

    if (!store_name) {
      throw new Error("Could not determine the store name.");
    }

    const params = new URLSearchParams();
    if (filters.search) params.append("search", filters.search);
    if (filters.category) params.append("category", filters.category);
    if (filters.categories) params.append("categories", filters.categories);

    const queryString = params.toString();
    const url = `${API_BASE_URL}/items/${store_name}/filtered/${
      queryString ? `?${queryString}` : ""
    }`;
    const cacheKey = `products-filter-${store_name}-${queryString}`;

    return cachedFetch<FilteredProductResponse<any>>(
      url,
      cacheKey,
      "Failed to fetch filtered products"
    );
  },

  async getProductsByCat(
    filters: ProductFilters = {},
    storeIdentifier?: string
  ): Promise<FilteredProductResponse<any>> {
    const store_name = storeIdentifier || (await getStoreName());

    if (!store_name) {
      throw new Error("Could not determine the store name.");
    }

    const params = new URLSearchParams();
    if (filters.search) params.append("search", filters.search);
    if (filters.category) params.append("category", filters.category);
    if (filters.categories) params.append("categories", filters.categories);

    const queryString = params.toString();
    const url = `${API_BASE_URL}/items/${store_name}/items/${
      queryString ? `?${queryString}` : ""
    }`;
    const cacheKey = `products-by-cat-${store_name}-${queryString}`;

    return cachedFetch<FilteredProductResponse<any>>(
      url,
      cacheKey,
      "Failed to fetch products by category"
    );
  },

  async getDeliveryAreaOptions(storeIdentifier?: string): Promise<{
    store_name: string;
    delivery_locations: {
      id: number;
      location: string;
      delivery_fee: string;
    }[];
  }> {
    const store_name = storeIdentifier || (await getStoreName());

    if (!store_name) {
      throw new Error("Could not determine the store name.");
    }

    const url = `${API_BASE_URL}/delivery-locations/${store_name}/`;
    const cacheKey = `delivery-locations-${store_name}`;

    return cachedFetch<{
      store_name: string;
      delivery_locations: {
        id: number;
        location: string;
        delivery_fee: string;
      }[];
    }>(url, cacheKey, "Failed to fetch delivery locations");
  },

  async applyCoupon(
    code: string,
    storeIdentifier?: string
  ): Promise<CouponResponse> {
    const store_name = storeIdentifier || (await getStoreName());

    if (!store_name) {
      throw new Error("Could not determine the store name.");
    }

    const url = `${API_BASE_URL}/coupon-check/${store_name}/`;
    const cacheKey = `coupon-${store_name}-${code}`;

    const response = await fetchWithTimeout(url, {
      method: "POST",
      body: JSON.stringify({ code }),
    });

    return handleResponse<CouponResponse>(
      response,
      "Failed to apply coupon",
      cacheKey
    );
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

  // --------------- Cache Management Methods ---------------

  clearCache(pattern?: string): void {
    if (typeof window === "undefined") return;

    if (pattern) {
      const keysToDelete = Array.from(clientCache.keys()).filter((key) =>
        key.includes(pattern)
      );
      keysToDelete.forEach((key) => clientCache.delete(key));
      console.log(
        `🗑️ Cleared ${keysToDelete.length} entries matching "${pattern}"`
      );
    } else {
      const count = clientCache.size;
      clientCache.clear();
      console.log(`🗑️ Cleared all ${count} cache entries`);
    }
  },

  dehydrateCache(): Record<string, CacheEntry> {
    if (typeof window !== "undefined") return {};

    const dehydrated: Record<string, CacheEntry> = {};
    clientCache.forEach((value, key) => {
      dehydrated[key] = value;
    });

    return dehydrated;
  },

  hydrateCache(dehydratedState?: Record<string, CacheEntry>): void {
    if (
      typeof window === "undefined" ||
      !dehydratedState ||
      Object.keys(dehydratedState).length === 0
    ) {
      return;
    }

    try {
      let hydratedCount = 0;
      Object.entries(dehydratedState).forEach(([key, value]) => {
        if (!clientCache.has(key) && this.isValidCacheEntry(value)) {
          clientCache.set(key, value);
          hydratedCount++;
        }
      });

      if (hydratedCount > 0) {
        console.log(`💧 [CACHE HYDRATED] Restored ${hydratedCount} entries`);
        evictOldestEntries(); // Clean up if needed
      }
    } catch (error) {
      console.error("[CACHE] Failed to hydrate cache:", error);
    }
  },

  isValidCacheEntry(entry: any): entry is CacheEntry {
    return (
      entry &&
      typeof entry === "object" &&
      typeof entry.timestamp === "number" &&
      entry.data !== undefined
    );
  },

  debugCache(): void {
    if (typeof window === "undefined") {
      console.log("Cache debugging only available on the client-side.");
      return;
    }

    console.log("📊 Cache Debug Info:");
    console.log(`Cache size: ${clientCache.size}/${MAX_CACHE_SIZE} entries`);

    const now = Date.now();
    const entries = Array.from(clientCache.entries()).sort(
      (a, b) => b[1].timestamp - a[1].timestamp
    );

    entries.forEach(([key, value]) => {
      const age = Math.round((now - value.timestamp) / 1000);
      const isExpired = now - value.timestamp > CACHE_TTL;
      console.log(
        `- ${key}: age=${age}s${
          isExpired ? " (EXPIRED)" : ""
        }, ETag=${!!value.etag}, LastModified=${!!value.lastModified}`
      );
    });
  },

  getCacheStats() {
    return {
      size: clientCache.size,
      maxSize: MAX_CACHE_SIZE,
      ttl: CACHE_TTL / 1000, // in seconds
      entries: Array.from(clientCache.keys()),
    };
  },
};
