"use client";

import { useEffect, useRef } from "react";
import { apiClient } from "@/app/(public)/api";

interface CacheEntry {
  data: any;
  etag?: string;
  lastModified?: string;
  timestamp: number;
}

export default function CacheHydrator({
  dehydratedState,
}: {
  dehydratedState: Record<string, CacheEntry>;
}) {
  const hasHydrated = useRef(false);

  useEffect(() => {
    // Prevent double hydration
    if (hasHydrated.current) return;
    
    if (dehydratedState && Object.keys(dehydratedState).length > 0) {
      apiClient.hydrateCache(dehydratedState);
      hasHydrated.current = true;
    }
  }, []); // Remove dehydratedState from dependencies to prevent re-hydration

  return null;
}