// app/(public)/api/index.ts - DYNAMIC CACHE VERSION

import { API_BASE_URL } from "@/constant/baseUrl";
import { getStoreNameFromHost } from "./utils/getStoreName";
import { notFound } from "next/navigation";
import {
  ErrorResponse,
  StoreConfig,
  ProductGroupData,
  CategoriesAndFeaturedProducts,
  FilteredProductResponse,
  ProductFilters,
  Product,
} from "./types";

// ============================================================================
// TYPES
// ============================================================================

interface CacheEntry {
  data: any;
  etag?: string;
  lastModified?: string;
  timestamp: number;
}

// ============================================================================
// CACHE CONFIGURATION
// ============================================================================

const clientCache = new Map<string, CacheEntry>();

const CACHE_MAX_AGE = 12 * 60 * 60 * 1000; // 12 hours - only cleanup after this
const MAX_CACHE_SIZE = 100;

// Cache update listeners
type CacheListener = (key: string, data: any) => void;
const cacheListeners = new Set<CacheListener>();

// Request deduplication - prevent multiple simultaneous requests for same resource
const pendingRequests = new Map<string, Promise<any>>();

// ============================================================================
// CACHE MANAGEMENT
// ============================================================================

function evictOldestEntries(): void {
  if (clientCache.size <= MAX_CACHE_SIZE) return;

  const entries = Array.from(clientCache.entries());
  entries.sort((a, b) => a[1].timestamp - b[1].timestamp);

  const entriesToRemove = entries.slice(0, clientCache.size - MAX_CACHE_SIZE);
  entriesToRemove.forEach(([key]) => clientCache.delete(key));

  if (process.env.NODE_ENV === "development") {
    console.log(`🗑️ Evicted ${entriesToRemove.length} old cache entries`);
  }
}

function setCacheEntry(key: string, entry: CacheEntry): void {
  clientCache.set(key, entry);
  evictOldestEntries();
}

function notifyCacheUpdate(key: string, data: any): void {
  cacheListeners.forEach((listener) => {
    try {
      listener(key, data);
    } catch (error) {
      console.error("Cache listener error:", error);
    }
  });
}

// ============================================================================
// FETCH UTILITIES
// ============================================================================

async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeout = 10000
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const headers = new Headers(options.headers);

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

async function getStoreName(): Promise<string> {
  let storeName: string | null = null;

  if (typeof window === "undefined") {
    try {
      const { headers } = await import("next/headers");
      const headersList = await headers();
      const host = headersList.get("host");
      storeName = getStoreNameFromHost(host || undefined);
    } catch (error) {
      console.error("Failed to get store name from headers:", error);
    }
  } else {
    storeName = getStoreNameFromHost();
  }

  if (!storeName) {
    throw new Error("Could not determine store name from host or headers");
  }

  return storeName;
}

// ============================================================================
// CORE CACHING LOGIC - SMART CACHE
// ============================================================================

async function cachedFetch<T>(
  url: string,
  cacheKey: string,
  defaultError: string,
  options: RequestInit = {}
): Promise<T> {
  const cached = clientCache.get(cacheKey);
  const now = Date.now();

  // Check if we have valid cached data (less than 12 hours old)
  if (cached && now - cached.timestamp < CACHE_MAX_AGE) {
    if (process.env.NODE_ENV === "development") {
      const ageInMinutes = Math.round((now - cached.timestamp) / 60000);
      console.log(
        `⚡ [CACHE HIT] Using cached data for ${cacheKey} (${ageInMinutes}m old)`
      );
    }

    // Make conditional request to check if data changed
    const headers = new Headers(options.headers);
    if (cached.etag) headers.set("If-None-Match", cached.etag);
    if (cached.lastModified)
      headers.set("If-Modified-Since", cached.lastModified);

    try {
      const response = await fetchWithTimeout(
        url,
        {
          ...options,
          headers,
          cache: "no-cache",
        },
        5000 // Shorter timeout for cache validation
      );

      // 304 Not Modified - server confirms cache is still valid
      if (response.status === 304) {
        if (process.env.NODE_ENV === "development") {
          console.log(
            `✅ [304] Cache valid for ${cacheKey}, extending lifetime`
          );
        }

        // Update timestamp to extend cache lifetime
        cached.timestamp = now;

        // Update cache headers if server sent new ones
        const newEtag = response.headers.get("etag");
        const newLastModified = response.headers.get("last-modified");
        if (newEtag) cached.etag = newEtag;
        if (newLastModified) cached.lastModified = newLastModified;

        clientCache.set(cacheKey, cached);
        return cached.data as T;
      }

      // 200 OK - new data available
      if (response.status === 200) {
        const freshData = await response.json();

        if (process.env.NODE_ENV === "development") {
          console.log(`🔄 [200] New data for ${cacheKey}, updating cache`);
        }

        setCacheEntry(cacheKey, {
          data: freshData,
          etag: response.headers.get("etag") || undefined,
          lastModified: response.headers.get("last-modified") || undefined,
          timestamp: now,
        });

        notifyCacheUpdate(cacheKey, freshData);
        return freshData;
      }
    } catch (error) {
      // Network error during validation - use stale cache
      if (process.env.NODE_ENV === "development") {
        console.warn(
          `⚠️ [CACHE] Validation failed for ${cacheKey}, using stale cache`,
          error
        );
      }
      return cached.data as T;
    }
  }

  // No cache or expired - fetch fresh data
  if (process.env.NODE_ENV === "development") {
    console.log(`🌐 [FETCHING] Fresh data for ${cacheKey}`);
  }

  const response = await fetchWithTimeout(url, {
    ...options,
    cache: "no-cache",
  });

  if (!response.ok) {
    let message = defaultError;
    try {
      const errorData: ErrorResponse = await response.json();
      message = errorData.detail || errorData.message || defaultError;
    } catch {
      // Ignore parse error
    }

    const error = new Error(message);
    (error as any).status = response.status;
    throw error;
  }

  const data = (await response.json()) as T;

  setCacheEntry(cacheKey, {
    data,
    etag: response.headers.get("etag") || undefined,
    lastModified: response.headers.get("last-modified") || undefined,
    timestamp: now,
  });

  return data;
}

// ============================================================================
// API CLIENT
// ============================================================================

export const apiClient = {
  // ----------- DATA FETCHING METHODS -----------

  async getProductDetail(
    productSlug: string,
    storeIdentifier?: string
  ): Promise<any> {
    if (!productSlug) throw new Error("Product slug is required");

    const store_name = storeIdentifier || (await getStoreName());
    const url = `${API_BASE_URL}/stores/${store_name}/product/${productSlug}/`;
    const cacheKey = `product-detail-${store_name}-${productSlug}`;

    return cachedFetch<any>(
      url,
      cacheKey,
      `Failed to fetch product detail for slug: ${productSlug}`
    );
  },

  async getGroupData(storeIdentifier?: string): Promise<ProductGroupData> {
    const store_name = storeIdentifier || (await getStoreName());
    const url = `${API_BASE_URL}/item-group/${store_name}/`;
    const cacheKey = `group-${store_name}`;

    return cachedFetch<ProductGroupData>(
      url,
      cacheKey,
      "Failed to fetch product group data"
    );
  },

  // async getConfiguration(storeIdentifier?: string): Promise<StoreConfig> {
  //   const store_name = storeIdentifier || (await getStoreName());
  //   const url = `${API_BASE_URL}/stores/${store_name}/`;
  //   const cacheKey = `store-config-${store_name}`;

  //   const storeData = await cachedFetch<{ configurations: StoreConfig }>(
  //     url,
  //     cacheKey,
  //     "Failed to fetch store configuration"
  //   );
  //   return storeData.configurations;
  // },


async getConfiguration(storeIdentifier?: string): Promise<StoreConfig> {
  const store_name = storeIdentifier || (await getStoreName());
  const url = `${API_BASE_URL}/stores/${store_name}/`;
  const cacheKey = `store-config-${store_name}`;

  try {
    const storeData = await cachedFetch<{ configurations?: StoreConfig }>(
      url,
      cacheKey,
      "Failed to fetch store configuration"
    );

    if (!storeData?.configurations) {
      throw new Error("Store configuration missing");
    }

    return storeData.configurations;
  } catch (error: any) {
    if (error?.status === 404) {
      notFound(); // ⬅ Next.js canonical solution
    }
    throw error;
  }
},
 



  async getCategoriesAndFeaturedProducts(
    storeIdentifier?: string
  ): Promise<CategoriesAndFeaturedProducts> {
    const store_name = storeIdentifier || (await getStoreName());
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

  async getProducts(
    filters: ProductFilters = {},
    storeIdentifier?: string
  ): Promise<FilteredProductResponse<any>> {
    const store_name = storeIdentifier || (await getStoreName());

    const params = new URLSearchParams();
    if (filters.search) params.append("search", filters.search);
    if (filters.category) params.append("category", filters.category);
    if (filters.categories) params.append("categories", filters.categories);

    const queryString = params.toString();
    const url = `${API_BASE_URL}/items/${store_name}/items/${
      queryString ? `?${queryString}` : ""
    }`;
    const cacheKey = `products-filter-${store_name}-${queryString}`;

    return cachedFetch<FilteredProductResponse<any>>(
      url,
      cacheKey,
      "Failed to fetch filtered products"
    );
  },

  async getRecommendedProducts(
    catSlug: string,
    storeIdentifier?: string
  ): Promise<Product[]> {
    const store_name = storeIdentifier || (await getStoreName());
    const url = `${API_BASE_URL}/recommended/${store_name}/products/${catSlug}/`;
    const cacheKey = `recommended-${store_name}-${catSlug}`;

    return cachedFetch<Product[]>(
      url,
      cacheKey,
      "Failed to fetch recommended products"
    );
  },

  async getProductsByCat(
    filters: ProductFilters = {},
    storeIdentifier?: string
  ): Promise<FilteredProductResponse<any>> {
    const store_name = storeIdentifier || (await getStoreName());
    const { category, ...otherFilters } = filters;

    console.group("🔍 getProductsByCat");

    if (!category || category === "__all__") {
      console.log("✅ Using general products endpoint");
      console.groupEnd();
      // Make sure getFilteredProduct ALSO uses this new native fetch logic
      return this.getFilteredProduct(otherFilters, storeIdentifier);
    }

    // Build query parameters
    const params = new URLSearchParams();
    if (otherFilters.search) params.append("search", otherFilters.search);
    if (otherFilters.page) params.append("page", otherFilters.page.toString());
    if (otherFilters.page_size)
      params.append("page_size", otherFilters.page_size.toString());

    const queryString = params.toString();
    const url = `${API_BASE_URL}/stores/${store_name}/categories/${category}/products/${
      queryString ? `?${queryString}` : ""
    }`;

    console.log("📡 Fetching category-specific products:", url);

    try {
      // ✅ SOLUTION: Use native fetch.
      // REMOVE cachedFetch and cacheKey.
      // The browser will now respect the ETag headers from your Django backend.
      const response = await fetch(url, {
        // 'default' is the standard cache policy that respects ETag headers.
        // You don't even need to specify it, but it's good to be explicit.
        cache: "default",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          // Add any other necessary headers (like Authorization)
        },
      });

      // Native fetch automatically handles 304 Not Modified.
      // If you get here, the browser has either fetched new data (200 OK)
      // or has already loaded the data from its cache.
      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.statusText}`);
      }

      // Handle case where API might return nothing for an empty list
      if (response.status === 204) {
        console.log("✅ Received 204 No Content, returning empty list.");
        console.groupEnd();
        return { count: 0, next: null, previous: null, results: [] };
      }

      const result = await response.json();

      console.group("🔍 VERIFICATION CHECK");
      console.log("Category Requested:", category);
      console.log("Products Returned:", result?.results?.length);
      console.log(
        "First Product Category:",
        result?.results?.[0]?.category?.slug
      );
      console.groupEnd();
      console.groupEnd();

      return result;
    } catch (error) {
      console.error("❌ Error fetching products:", error);
      console.groupEnd();
      throw error;
    }
  },

  async getDeliveryAreaOptions(storeIdentifier?: string): Promise<{
    store_name: string;
    delivery_locations: {
      id: number;
      location: string;
      delivery_fee: string;
    }[];
  }> {
    try {
      const store_name = storeIdentifier || (await getStoreName());
      const url = `${API_BASE_URL}/delivery-locations/${store_name}/`;
      const cacheKey = `delivery-locations-${store_name}`;

      const data = await cachedFetch<{
        store_name: string;
        delivery_locations: {
          id: number;
          location: string;
          delivery_fee: string;
        }[];
      }>(url, cacheKey, "Failed to fetch delivery locations");

      if (!data?.delivery_locations || data.delivery_locations.length === 0) {
        return { store_name, delivery_locations: [] };
      }

      return data;
    } catch (error: any) {
      if (error.status === 404) {
        const store_name = storeIdentifier || (await getStoreName());
        return { store_name, delivery_locations: [] };
      }

      console.error("Error fetching delivery locations:", error);
      return {
        store_name: storeIdentifier || "Unknown Store",
        delivery_locations: [],
      };
    }
  },

  // ----------- CACHE MANAGEMENT METHODS -----------

  clearCache(pattern?: string): void {
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
    if (typeof window !== "undefined") return {}; // Skip on client

    const dehydrated: Record<string, CacheEntry> = {};
    const now = Date.now();

    clientCache.forEach((value, key) => {
      // Only dehydrate entries that aren't expired
      if (now - value.timestamp < CACHE_MAX_AGE) {
        dehydrated[key] = value;
      }
    });

    if (
      Object.keys(dehydrated).length > 0 &&
      process.env.NODE_ENV === "development"
    ) {
      console.log(
        `📤 [DEHYDRATE] Prepared ${
          Object.keys(dehydrated).length
        } entries for client`
      );
    }

    return dehydrated;
  },

  hydrateCache(dehydratedState?: Record<string, CacheEntry>): void {
    if (typeof window === "undefined") return; // Skip on server

    if (!dehydratedState || Object.keys(dehydratedState).length === 0) {
      return;
    }

    try {
      let hydratedCount = 0;
      const now = Date.now();

      Object.entries(dehydratedState).forEach(([key, value]) => {
        // Only hydrate if valid and not expired
        if (
          !clientCache.has(key) &&
          this.isValidCacheEntry(value) &&
          now - value.timestamp < CACHE_MAX_AGE
        ) {
          clientCache.set(key, value);
          hydratedCount++;
        }
      });

      if (hydratedCount > 0) {
        console.log(`💧 [CACHE HYDRATED] Restored ${hydratedCount} entries`);
        evictOldestEntries();
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

  onCacheUpdate(listener: CacheListener): () => void {
    cacheListeners.add(listener);
    return () => cacheListeners.delete(listener);
  },

  getCacheStats() {
    const now = Date.now();
    const entries = Array.from(clientCache.entries());

    const expired = entries.filter(
      ([_, v]) => now - v.timestamp >= CACHE_MAX_AGE
    ).length;

    return {
      size: clientCache.size,
      maxSize: MAX_CACHE_SIZE,
      maxAge: CACHE_MAX_AGE / (60 * 60 * 1000), // in hours
      entries: Array.from(clientCache.keys()),
      environment: typeof window === "undefined" ? "server" : "client",
      expired,
    };
  },

  cleanupExpiredEntries(): number {
    const now = Date.now();
    const keysToDelete: string[] = [];

    clientCache.forEach((entry, key) => {
      if (now - entry.timestamp >= CACHE_MAX_AGE) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach((key) => clientCache.delete(key));

    if (keysToDelete.length > 0) {
      console.log(
        `🗑️ [CLEANUP] Removed ${keysToDelete.length} expired entries (>12h old)`
      );
    }

    return keysToDelete.length;
  },

  debugCache(): void {
    console.log("📊 Cache Debug Info:");
    console.log(`Cache size: ${clientCache.size}/${MAX_CACHE_SIZE} entries`);
    console.log(
      `Environment: ${typeof window === "undefined" ? "SERVER" : "CLIENT"}`
    );
    console.log(`Max age: ${CACHE_MAX_AGE / (60 * 60 * 1000)} hours`);

    const now = Date.now();
    const entries = Array.from(clientCache.entries()).sort(
      (a, b) => b[1].timestamp - a[1].timestamp
    );

    entries.forEach(([key, value]) => {
      const ageHours = Math.round((now - value.timestamp) / (60 * 60 * 1000));
      const ageMinutes = Math.round((now - value.timestamp) / 60000);
      const isExpired = now - value.timestamp >= CACHE_MAX_AGE;

      console.log(
        `- ${key}:\n` +
          `  Age: ${ageHours}h ${ageMinutes % 60}m\n` +
          `  Status: ${isExpired ? "EXPIRED" : "VALID"}\n` +
          `  ETag: ${!!value.etag}, Last-Modified: ${!!value.lastModified}`
      );
    });
  },
};

// ============================================================================
// AUTOMATIC CLEANUP (SERVER-SIDE ONLY)
// ============================================================================

if (typeof window === "undefined") {
  const cleanupInterval = setInterval(() => {
    const now = Date.now();
    const keysToDelete: string[] = [];

    clientCache.forEach((entry, key) => {
      if (now - entry.timestamp > CACHE_MAX_AGE) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach((key) => clientCache.delete(key));

    if (keysToDelete.length > 0 && process.env.NODE_ENV === "development") {
      console.log(
        `🗑️ [AUTO-CLEANUP] Removed ${keysToDelete.length} expired entries`
      );
    }
  }, CACHE_MAX_AGE);

  if (cleanupInterval.unref) {
    cleanupInterval.unref();
  }
}
