"use client";

import { createContext, useContext } from "react";

export interface StoreConfig {
  title: string;
  description: string;
  darkModeColor?: string;
  lightModeColor?: string;
  [key: string]: any;
}

const StoreContext = createContext<StoreConfig | null>(null);

export function StoreProvider({
  value,
  children,
}: {
  value: StoreConfig;
  children: React.ReactNode;
}) {
  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useStoreConfig() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStoreConfig must be used inside StoreProvider");
  }
  return context;
}
 