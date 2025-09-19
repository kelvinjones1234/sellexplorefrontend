// // src/api.ts
// import { API_BASE } from "@/constant/baseUrl";
// import { getStoreNameFromHost } from "./utils/getStoreName";

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || API_BASE;

// export interface ErrorResponse {
//   detail?: string;
//   message?: string;
//   [key: string]: any;
// }

// export interface PaginatedResponse<T> {
//   count: number;
//   next: string | null;
//   previous: string | null;
//   results: T[];
// }

// export interface FilteredProductResponse<T> {
//   count: number;
//   results: T[];
// }

// export interface ProductFilters {
//   search?: string;
//   category?: string;
//   categories?: string;
// }

// interface CacheEntry {
//   data: any;
//   etag?: string;
//   lastModified?: string;
//   timestamp: number;
// }

// const clientCache = new Map<string, CacheEntry>();
// const CACHE_TTL = 5 * 60 * 1000;

// async function fetchWithTimeout(
//   url: string,
//   options: RequestInit = {},
//   timeout = 10000
// ): Promise<Response> {
//   const controller = new AbortController();
//   const timeoutId = setTimeout(() => controller.abort(), timeout);

//   try {
//     const headers = new Headers(options.headers);
//     if (!(options.body instanceof FormData)) {
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
//   if (response.status === 304) {
//     if (cacheKey && clientCache.has(cacheKey)) {
//       const cached = clientCache.get(cacheKey)!;
//       console.log(
//         `🎯 [CACHE HIT] Using cached data for ${cacheKey} (304 Not Modified)`
//       );
//       return cached.data as T;
//     }
//     console.warn(
//       `⚠️ Received 304 Not Modified but no cached data was found for ${cacheKey}`
//     );
//     throw new Error("304 Not Modified but no cached data available");
//   }

//   if (!response.ok) {
//     let message = defaultError;
//     try {
//       const errorData: ErrorResponse = await response.json();
//       message = errorData.detail || errorData.message || defaultError;
//     } catch (parseError) {
//       console.warn("Failed to parse error response body:", parseError);
//     }

//     const error = new Error(message);
//     (error as any).status = response.status;
//     throw error;
//   }

//   if (response.status === 204) {
//     return {} as T;
//   }

//   try {
//     const data = (await response.json()) as T;

//     if (cacheKey && response.status === 200) {
//       const etag = response.headers.get("etag");
//       const lastModified = response.headers.get("last-modified");
//       clientCache.set(cacheKey, {
//         data,
//         etag: etag || undefined,
//         lastModified: lastModified || undefined,
//         timestamp: Date.now(),
//       });
//       console.log(`💾 [CACHE SET] Cached fresh data for ${cacheKey}`);
//     }

//     return data;
//   } catch (parseError) {
//     console.error("Failed to parse response JSON:", parseError);
//     throw new Error("Invalid response format");
//   }
// }

// async function getStoreName(): Promise<string | null> {
//   if (typeof window === "undefined") {
//     try {
//       const { headers } = await import("next/headers");
//       const host = (await headers()).get("host");
//       return getStoreNameFromHost(host || undefined);
//     } catch (e) {
//       console.error("Failed to get store name on server:", e);
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

//   if (cached && now - cached.timestamp < CACHE_TTL) {
//     console.log(`⚡ [CACHE HIT] Returning TTL-valid data for ${cacheKey}`);
//     return cached.data as T;
//   }

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

// export const apiClient = {
//   async getConfiguration(storeIdentifier?: string): Promise<any> {
//     const store_name = storeIdentifier || (await getStoreName());
//     if (!store_name) throw new Error("Could not determine the store name.");
//     const url = `${API_BASE_URL}/stores/${store_name}/`;
//     const cacheKey = `store-config-${store_name}`;
//     const storeData = await cachedFetch<any>(
//       url,
//       cacheKey,
//       "Failed to fetch store configuration"
//     );
//     return storeData.configurations;
//   },

//   async getGroupData(storeIdentifier?: string): Promise<any> {
//     const store_name = storeIdentifier || (await getStoreName());
//     if (!store_name) throw new Error("Could not determine the store name.");
//     const url = `${API_BASE_URL}/item-group/${store_name}/`;
//     const cacheKey = `group-${store_name}`;
//     return cachedFetch<any>(
//       url,
//       cacheKey,
//       "Failed to fetch product group data"
//     );
//   },

//   async getCategoriesAndFeaturedProducts(
//     storeIdentifier?: string
//   ): Promise<any[]> {
//     const store_name = storeIdentifier || (await getStoreName());
//     if (!store_name) throw new Error("Could not determine the store name.");
//     const url = `${API_BASE_URL}/featured-and-category/${store_name}/`;
//     const cacheKey = `featured-and-category-${store_name}`;
//     return cachedFetch<any[]>(
//       url,
//       cacheKey,
//       "Failed to fetch featured products"
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
//     // if (filters.categories) params.append("categories", filters.categories);

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
//     // if (filters.categories) params.append("categories", filters.categories);

//     const queryString = params.toString();
//     const url = `${API_BASE_URL}/items/${store_name}/items/${
//       queryString ? `?${queryString}` : ""
//     }`;
//     const cacheKey = `products-filter-${store_name}-${queryString}`;

//     return cachedFetch<FilteredProductResponse<any>>(
//       url,
//       cacheKey,
//       "Failed to fetch filtered products"
//     );
//   },

//   clearCache(pattern?: string): void {
//     if (typeof window === "undefined") return;
//     if (pattern) {
//       const keysToDelete = Array.from(clientCache.keys()).filter((key) =>
//         key.includes(pattern)
//       );
//       keysToDelete.forEach((key) => clientCache.delete(key));
//       console.log(
//         `🗑️ Cleared ${keysToDelete.length} cache entries matching "${pattern}"`
//       );
//     } else {
//       const count = clientCache.size;
//       clientCache.clear();
//       console.log(`🗑️ Cleared all ${count} cache entries`);
//     }
//   },

//   dehydrateCache(): Record<string, any> {
//     if (typeof window !== "undefined") return {};
//     return Object.fromEntries(clientCache);
//   },

//   hydrateCache(dehydratedState?: Record<string, any>): void {
//     if (
//       typeof window === "undefined" ||
//       !dehydratedState ||
//       Object.keys(dehydratedState).length === 0
//     ) {
//       return;
//     }
//     try {
//       const state = new Map(Object.entries(dehydratedState));
//       state.forEach((value, key) => {
//         if (!clientCache.has(key)) clientCache.set(key, value);
//       });
//       console.log(
//         `💧 [CACHE HYDRATED] Restored ${state.size} entries from server.`
//       );
//     } catch (error) {
//       console.error("[CACHE] Failed to hydrate cache:", error);
//     }
//   },

//   debugCache(): void {
//     if (typeof window === "undefined") {
//       console.log("Cache debugging only available on the client-side.");
//       return;
//     }
//     console.log("📊 Cache Debug Info:");
//     console.log(`Cache size: ${clientCache.size} entries`);
//     if (clientCache.size === 0) {
//       console.log("No cached entries found.");
//       return;
//     }
//     const now = Date.now();
//     clientCache.forEach((value, key) => {
//       const age = Math.round((now - value.timestamp) / 1000);
//       console.log(
//         `- ${key}: age=${age}s, ETag=${!!value.etag}, LastModified=${!!value.lastModified}`
//       );
//     });
//   },
// };







// src/api.ts
import { API_BASE } from "@/constant/baseUrl";
import { getStoreNameFromHost } from "./utils/getStoreName";
import {
  ErrorResponse,
  StoreConfig,
  ProductGroupData,
  CategoriesAndFeaturedProducts,
  FilteredProductResponse,
  ProductFilters,
} from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || API_BASE;

interface CacheEntry {
  data: any;
  etag?: string;
  lastModified?: string;
  timestamp: number;
}

const clientCache = new Map<string, CacheEntry>();
const CACHE_TTL = 5 * 60 * 1000;

// --------------- fetch helpers ---------------

async function fetchWithTimeout(
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

  if (!response.ok) {
    let message = defaultError;
    try {
      const errorData: ErrorResponse = await response.json();
      message = errorData.detail || errorData.message || defaultError;
    } catch {
      // ignore JSON parse error
    }

    const error = new Error(message);
    (error as any).status = response.status;
    throw error;
  }

  if (response.status === 204) {
    return {} as T;
  }

  const data = (await response.json()) as T;

  if (cacheKey && response.status === 200) {
    const etag = response.headers.get("etag");
    const lastModified = response.headers.get("last-modified");
    clientCache.set(cacheKey, {
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
      const host = (await headers()).get("host");
      return getStoreNameFromHost(host || undefined);
    } catch {
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

  if (cached && now - cached.timestamp < CACHE_TTL) {
    console.log(`⚡ [CACHE HIT] Returning TTL-valid data for ${cacheKey}`);
    return cached.data as T;
  }

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

// --------------- API client ---------------

export const apiClient = {
  async getConfiguration(storeIdentifier?: string): Promise<StoreConfig> {
    const store_name = storeIdentifier || (await getStoreName());
    if (!store_name) throw new Error("Could not determine the store name.");

    const url = `${API_BASE_URL}/stores/${store_name}/`;
    const cacheKey = `store-config-${store_name}`;

    const storeData = await cachedFetch<{ configurations: StoreConfig }>(
      url,
      cacheKey,
      "Failed to fetch store configuration"
    );
    return storeData.configurations;
  },

  async getGroupData(storeIdentifier?: string): Promise<ProductGroupData> {
    const store_name = storeIdentifier || (await getStoreName());
    if (!store_name) throw new Error("Could not determine the store name.");

    const url = `${API_BASE_URL}/item-group/${store_name}/`;
    const cacheKey = `group-${store_name}`;

    return cachedFetch<ProductGroupData>(
      url,
      cacheKey,
      "Failed to fetch product group data"
    );
  },

  async getCategoriesAndFeaturedProducts(
    storeIdentifier?: string
  ): Promise<CategoriesAndFeaturedProducts> {
    const store_name = storeIdentifier || (await getStoreName());
    if (!store_name) throw new Error("Could not determine the store name.");
    const url = `${API_BASE_URL}/featured-and-category/${store_name}/`;
    const cacheKey = `featured-and-category-${store_name}`;
    return cachedFetch<CategoriesAndFeaturedProducts>(
      url,
      cacheKey,
      "Failed to fetch featured products"
    );
  },

  async getFilteredProduct(
    filters: ProductFilters = {},
    storeIdentifier?: string
  ): Promise<FilteredProductResponse<any>> {
    const store_name = storeIdentifier || (await getStoreName());
    if (!store_name) throw new Error("Could not determine the store name.");

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
    if (!store_name) throw new Error("Could not determine the store name.");

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

  // cache helpers
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

  dehydrateCache(): Record<string, any> {
    if (typeof window !== "undefined") return {};
    return Object.fromEntries(clientCache);
  },

  hydrateCache(dehydratedState?: Record<string, any>): void {
    if (
      typeof window === "undefined" ||
      !dehydratedState ||
      Object.keys(dehydratedState).length === 0
    ) {
      return;
    }
    try {
      const state = new Map(Object.entries(dehydratedState));
      state.forEach((value, key) => {
        if (!clientCache.has(key)) clientCache.set(key, value);
      });
      console.log(`💧 [CACHE HYDRATED] Restored ${state.size} entries`);
    } catch (error) {
      console.error("[CACHE] Failed to hydrate cache:", error);
    }
  },

  debugCache(): void {
    if (typeof window === "undefined") {
      console.log("Cache debugging only available on the client-side.");
      return;
    }
    console.log("📊 Cache Debug Info:");
    console.log(`Cache size: ${clientCache.size} entries`);
    const now = Date.now();
    clientCache.forEach((value, key) => {
      const age = Math.round((now - value.timestamp) / 1000);
      console.log(
        `- ${key}: age=${age}s, ETag=${!!value.etag}, LastModified=${!!value.lastModified}`
      );
    });
  },
};
