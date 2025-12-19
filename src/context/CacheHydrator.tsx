// context/CacheHydrator.tsx
"use client";

import { useEffect, useRef } from "react";
import { apiClient } from "@/app/(public)/api";

interface CacheEntry {
  data: any;
  etag?: string;
  lastModified?: string;
  timestamp: number;
}

interface CacheHydratorProps {
  dehydratedState?: Record<string, CacheEntry> | null;
}

export default function CacheHydrator({ dehydratedState }: CacheHydratorProps) {
  const hasHydrated = useRef(false);

  useEffect(() => {
    if (hasHydrated.current) return;
    if (!dehydratedState || Object.keys(dehydratedState).length === 0) {
      hasHydrated.current = true;
      return;
    } 

    try {
      apiClient.hydrateCache(dehydratedState);
      hasHydrated.current = true;

      if (process.env.NODE_ENV === "development") {
        const stats = apiClient.getCacheStats();
        console.log(`[CacheHydrator] ✅ Hydrated ${stats.size} cache entries`);
      }
    } catch (error) {
      console.error("[CacheHydrator] Failed to hydrate cache:", error);
      hasHydrated.current = true;
    }
  }, [dehydratedState]);

  // ✅ REMOVED: All monitoring intervals to prevent noise

  return null;
}
