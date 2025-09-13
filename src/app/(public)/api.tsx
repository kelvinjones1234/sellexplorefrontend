// src/api.ts
import { API_BASE } from "@/constant/baseUrl";
import { ErrorResponse } from "./types";
import { getStoreNameFromHost } from "./utils/getStoreName";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || API_BASE;

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Cache storage for client-side caching
const clientCache = new Map<
  string,
  {
    data: any;
    etag?: string;
    lastModified?: string;
    timestamp: number;
  }
>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes client-side TTL

// --- Helpers ---
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
  // ✅ Handle 304 Not Modified explicitly - return cached data
  if (response.status === 304) {
    if (cacheKey && clientCache.has(cacheKey)) {
      const cached = clientCache.get(cacheKey)!;
      console.log(
        `🎯 [CACHE HIT] Using cached data for ${cacheKey} (304 Not Modified)`
      );
      return cached.data as T;
    }
    // This case is unlikely but good to handle
    console.warn(
      `⚠️ Received 304 Not Modified but no cached data was found for ${cacheKey}`
    );
    throw new Error("304 Not Modified but no cached data available");
  }

  if (!response.ok) {
    let message = defaultError;
    try {
      const errorData: ErrorResponse = await response.json();
      message = errorData.detail || errorData.message || defaultError;
    } catch (parseError) {
      console.warn("Failed to parse error response body:", parseError);
    }

    const error = new Error(message);
    (error as any).status = response.status;
    throw error;
  }

  if (response.status === 204) {
    return {} as T;
  }

  try {
    const data = (await response.json()) as T;

    // Cache the new response data along with headers for future conditional requests
    if (cacheKey && response.status === 200) {
      const etag = response.headers.get("etag");
      const lastModified = response.headers.get("last-modified");

      // NEW: Added detailed logging to diagnose missing headers.
      // This is crucial for debugging CORS issues.
      if (!etag) {
        console.warn(
          `[CACHE WARNING] No 'ETag' header received for ${cacheKey}. The server must expose it via 'Access-Control-Expose-Headers'.`
        );
      }
      if (!lastModified) {
        console.warn(
          `[CACHE WARNING] No 'Last-Modified' header received for ${cacheKey}. The server must expose it via 'Access-Control-Expose-Headers'.`
        );
      }

      clientCache.set(cacheKey, {
        data,
        etag: etag || undefined,
        lastModified: lastModified || undefined,
        timestamp: Date.now(),
      });

      console.log(`💾 [CACHE SET] Cached fresh data for ${cacheKey}`, {
        etag,
        lastModified,
      });
    }

    return data;
  } catch (parseError) {
    console.error("Failed to parse response JSON:", parseError);
    throw new Error("Invalid response format");
  }
}

async function getStoreName(): Promise<string | null> {
  if (typeof window === "undefined") {
    // Server-side
    try {
      const { headers } = await import("next/headers");
      const host = (await headers()).get("host");
      return getStoreNameFromHost(host || undefined);
    } catch (e) {
      console.error("Failed to get store name on server:", e);
      return null;
    }
  } else {
    // Client-side
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
    console.log(`⚡ [CACHE HIT] Returning cached data for ${cacheKey}`);
    return cached.data as T;
  }

  if (!cached) {
    console.log(`❌ [CACHE MISS] No cache entry found for ${cacheKey}`);
  } else {
    console.log(
      `⏳ [CACHE STALE] Cache expired for ${cacheKey} (age: ${Math.round(
        (now - cached.timestamp) / 1000
      )}s), revalidating`
    );
  }

  const headers = new Headers(options.headers);
  if (cached?.etag) headers.set("If-None-Match", cached.etag);
  if (cached?.lastModified)
    headers.set("If-Modified-Since", cached.lastModified);

  console.log(`🚀 [FETCH] Requesting ${url}`, {
    "If-None-Match": headers.get("If-None-Match"),
    "If-Modified-Since": headers.get("If-Modified-Since"),
  });

  const response = await fetchWithTimeout(url, {
    ...options,
    headers,
    cache: "no-cache",
  });

  return handleResponse<T>(response, defaultError, cacheKey);
}

// --- API Client (explicit functions) ---
export const apiClient = {
  async getConfiguration(storeIdentifier?: string): Promise<any> {
    const store_name = storeIdentifier || (await getStoreName());
    if (!store_name) {
      throw new Error("Could not determine the store name.");
    }

    const url = `${API_BASE_URL}/stores/${store_name}/`;
    const cacheKey = `store-config-${store_name}`;

    const storeData = await cachedFetch<any>(
      url,
      cacheKey,
      "Failed to fetch store configuration"
    );
    // Extract the configurations object from the full store response
    return storeData.configurations;
  },

  async getGroupData(storeIdentifier?: string): Promise<any> {
    const store_name = storeIdentifier || (await getStoreName());
    if (!store_name) {
      throw new Error("Could not determine the store name.");
    }

    const url = `${API_BASE_URL}/item-group/${store_name}/`;
    const cacheKey = `group-${store_name}`;

    return cachedFetch<any>(
      url,
      cacheKey,
      "Failed to fetch product group data"
    );
  },

  async getCategoriesAndFeaturedProducts(storeIdentifier?: string): Promise<any[]> {
    const store_name = storeIdentifier || (await getStoreName());
    if (!store_name) {
      throw new Error("Could not determine the store name.");
    }

    const url = `${API_BASE_URL}/featured-and-category/${store_name}/`;
    const cacheKey = `featured-and-category-${store_name}`;

    return cachedFetch<any[]>(
      url,
      cacheKey,
      "Failed to fetch featured products"
    );
  },

  async getProducts(page = 1): Promise<PaginatedResponse<any>> {
    const url = `${API_BASE_URL}/products/?page=${page}`;
    const cacheKey = `products-page-${page}`;

    return cachedFetch<PaginatedResponse<any>>(
      url, 
      cacheKey,
      "Failed to fetch products"
    );
  },

  clearCache(pattern?: string): void {
    if (typeof window === "undefined") return;

    if (pattern) {
      const keysToDelete: string[] = [];
      for (const key of clientCache.keys()) {
        if (key.includes(pattern)) {
          keysToDelete.push(key);
        }
      }
      keysToDelete.forEach((key) => clientCache.delete(key));
      console.log(
        `🗑️ Cleared ${keysToDelete.length} cache entries matching "${pattern}"`
      );
    } else {
      const count = clientCache.size;
      clientCache.clear();
      console.log(`🗑️ Cleared all ${count} cache entries`);
    }
  },

  /**
   * Serializes the server-side cache into a plain object for JSON stringification.
   * This should be called in `getServerSideProps` after data fetching.
   * @returns A JSON-serializable representation of the cache.
   */
  dehydrateCache(): Record<string, any> {
    // This should only run on the server. On the client, it's a no-op.
    if (typeof window !== "undefined") {
      console.warn(
        "[CACHE] dehydrateCache should only be called on the server."
      );
      return {};
    }
    return Object.fromEntries(clientCache);
  },

  /**
   * Populates the client-side cache with state dehydrated from the server.
   * This should be called once on the client when the app initializes.
   * @param dehydratedState - The cache state from server props.
   */
  hydrateCache(dehydratedState?: Record<string, any>): void {
    // This should only run on the client. On the server, it's a no-op.
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
        // Avoid overwriting a value that might have been freshly fetched on the client
        if (!clientCache.has(key)) {
          clientCache.set(key, value);
        }
      });
      console.log(
        `💧 [CACHE HYDRATED] Restored ${state.size} entries from server.`
      );
    } catch (error) {
      console.error("[CACHE] Failed to hydrate cache:", error);
    }
  },
  getCacheInfo(): Array<{
    key: string;
    age: number;
    hasEtag: boolean;
    hasLastModified: boolean;
  }> {
    if (typeof window === "undefined") return [];

    const now = Date.now();
    return Array.from(clientCache.entries()).map(([key, value]) => ({
      key,
      age: now - value.timestamp,
      hasEtag: !!value.etag,
      hasLastModified: !!value.lastModified,
    }));
  },

  // Debug method to inspect cache
  debugCache(): void {
    if (typeof window === "undefined") {
      console.log("Cache debugging only available on client-side");
      return;
    }

    console.log("📊 Cache Debug Info:");
    console.log(`Cache size: ${clientCache.size} entries`);

    const cacheInfo = this.getCacheInfo();
    cacheInfo.forEach((info) => {
      console.log(
        `- ${info.key}: age=${Math.round(info.age / 1000)}s, ETag=${
          info.hasEtag
        }, LastModified=${info.hasLastModified}`
      );
    });

    if (cacheInfo.length === 0) {
      console.log("No cached entries found");
    }
  },
};
