import { Suspense } from "react";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/Footer";
import { apiClient } from "@/app/(public)/api";
import { StoreProvider } from "@/context/StoreContext";
import { CartProvider } from "@/context/CartContext";
import CacheHydrator from "@/context/CacheHydrator";

// Define strict types for Next.js 15+ (where params is a Promise)
interface PublicLayoutProps {
  children: React.ReactNode;
  params: Promise<{ store: string }>;
}

export default async function PublicLayout({
  children,
  params,
}: PublicLayoutProps) {
  // 1. Resolve params
  const { store } = await params;

  if (!store?.trim()) {
    throw new Error("Invalid store identifier");
  }

  // 2. Fetch Data
  // We don't need Promise.all if dehydrateCache is synchronous.
  // If getConfiguration fails, it automatically triggers error.tsx
  const storeConfig = await apiClient.getConfiguration(store);
  
  // 3. Dehydrate cache (Assuming this is a sync operation)
  const dehydratedCache = apiClient.dehydrateCache();

  if (!storeConfig) {
    throw new Error(`Store configuration not found for: ${store}`);
  }

  // 4. Construct CSS variables efficiently
  const themeStyles = {
    "--color-primary": storeConfig.brand_color_dark || "#1E40AF",
    "--color-secondary": storeConfig.brand_color_light || "#9333EA",
  } as React.CSSProperties;

  return (
    <StoreProvider value={storeConfig}>
      <CartProvider>
        <CacheHydrator dehydratedState={dehydratedCache} />
        
        <div className="min-h-screen flex flex-col" style={themeStyles}>
          <header className="px-3 fixed w-full top-5 z-30">
            {/* Suspense only works here if Navbar does its own async fetching. 
              If Navbar is static, you can remove Suspense.
            */}
            <Suspense fallback={<NavbarSkeleton />}>
              <Navbar />
            </Suspense>
          </header>

          <main className="flex-1">
            {children}
          </main>
          
          <Footer />
        </div>
      </CartProvider>
    </StoreProvider>
  );
}

// Small, local skeleton component (or move to a separate file for reusability)
function NavbarSkeleton() {
  return (
    <div className="h-16 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg animate-pulse" />
  );
}