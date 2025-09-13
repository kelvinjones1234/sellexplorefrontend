import type { Metadata } from "next";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/Footer";
import { apiClient } from "./api";
import { StoreProvider } from "@/context/StoreContext";
import CacheHydrator from "@/context/CacheHydrator";

export async function generateMetadata(): Promise<Metadata> {
  return {
    icons: { icon: "/favicon.png" },
  };
}

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeConfig = await apiClient.getConfiguration();
  const dehydratedCache = apiClient.dehydrateCache();

  return (
    <StoreProvider value={storeConfig}>
      <CacheHydrator dehydratedState={dehydratedCache} />
      <div
        style={{
          ["--color-primary" as any]: storeConfig.brand_color_dark || "#1E40AF",
          ["--color-secondary" as any]:
            storeConfig.brand_color_light || "#9333EA",
        }}
        className="min-h-screen flex flex-col"
      >
        <div className="px-3 fixed w-full top-5 z-30">
          <Navbar />
        </div>
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </StoreProvider>
  );
}
