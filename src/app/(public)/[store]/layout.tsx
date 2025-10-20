import Navbar from "../components/navbar/Navbar";
import Footer from "../components/Footer";
import { apiClient } from "@/app/(public)/api";
import { StoreProvider } from "@/context/StoreContext";
import { CartProvider } from "@/context/CartContext";
import CacheHydrator from "@/context/CacheHydrator";
import { Suspense } from "react";

export default async function PublicLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ store: string }>;
}) {
  try {
    const { store } = await params;

    if (!store || typeof store !== "string") {
      throw new Error("Invalid store identifier");
    }

    const [storeConfig, dehydratedCache] = await Promise.all([
      apiClient.getConfiguration(store),
      Promise.resolve(apiClient.dehydrateCache()),
    ]);

    if (!storeConfig) {
      throw new Error("Store configuration is missing");
    }

    const styles: Record<string, string> = {
      "--color-primary": storeConfig.brand_color_dark || "#1E40AF",
      "--color-secondary": storeConfig.brand_color_light || "#9333EA",
    };

    return (
      <StoreProvider value={storeConfig}>
        <CartProvider>
          <CacheHydrator dehydratedState={dehydratedCache} />
          <div className="min-h-screen flex flex-col">
            {/* <div style={styles} className="min-h-screen flex flex-col"> */}
            <div className="px-3 fixed w-full top-5 z-30">
              <Suspense
                fallback={
                  <div className="h-16 bg-gray-100 animate-pulse rounded" />
                }
              >
                <Navbar />
              </Suspense>
            </div>
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </CartProvider>
      </StoreProvider>
    );
  } catch (error) {
    console.error("Layout error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Error Loading Store
          </h1>
          <p className="text-gray-600 mb-4">{errorMessage}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
}
