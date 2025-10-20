"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const checkAuthStatus = async () => {
      // Check if access token exists in localStorage
      const accessToken = localStorage.getItem("access");

      if (!accessToken) {
        console.log(
          "ProtectedRoute: No access token found in localStorage, logging out and redirecting to signin"
        );
        await logout();
        router.push("/authentication/signin");
        return;
      }
    };

    checkAuthStatus(); 
  }, [router, logout]);

  return <>{children}</>;
};

export default ProtectedRoute;
