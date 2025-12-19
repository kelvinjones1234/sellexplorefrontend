
"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isInitialized, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only run this logic if auth has finished initializing
    if (isInitialized && !isAuthenticated) {
       router.replace("/authentication/signin");
    }
  }, [isInitialized, isAuthenticated, router]);

  // 1. Show loading while AuthContext reads from LocalStorage
  if (!isInitialized || loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 text-gray-700">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p>Loading session...</p>
        </div>
      </div>
    );
  }

  // 2. If initialized but not authenticated, render nothing (useEffect will redirect)
  if (!isAuthenticated) {
    return null; 
  }

  // 3. Authenticated: Render the protected page
  return <>{children}</>;
};

export default ProtectedRoute;