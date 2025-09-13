// src/context/CacheHydrator.tsx
"use client";

import { useEffect } from "react";
import { apiClient } from "@/app/(public)/api";

export default function CacheHydrator({
  dehydratedState,
}: {
  dehydratedState: Record<string, unknown>;
}) {
  useEffect(() => {
    if (dehydratedState) {
      apiClient.hydrateCache(dehydratedState);
    }
  }, [dehydratedState]);

  return null;
}
 