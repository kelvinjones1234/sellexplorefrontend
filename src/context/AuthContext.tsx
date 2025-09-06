import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { FormErrors } from "@/app/types/AuthTypes";
import { useRouter } from "next/navigation";
import { apiClient } from "@/app/(private)/dashboard/products/api";

// Define types for token response
interface TokenResponse {
  access: string;
  refresh: string;
}

interface LoginResponse {
  tokens: TokenResponse;
}

interface AuthContextType {
  register: (
    email: string,
    store_name: string,
    password: string,
    location: string,
    niche: string,
    full_name: string
  ) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  error: FormErrors | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const REFRESH_INTERVAL = 14 * 60 * 1000; // 14 minutes

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [error, setError] = useState<FormErrors | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  const router = useRouter();
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isRefreshingRef = useRef<boolean>(false);

  // Clear any error state
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Clear refresh timer utility
  const clearRefreshTimer = useCallback(() => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
  }, []);

  // Check if user is authenticated
  const isAuthenticated = Boolean(accessToken && refreshToken);

  // Initialize tokens from localStorage on mount
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedAccess = localStorage.getItem("access");
        const storedRefresh = localStorage.getItem("refresh");

        if (storedAccess && storedRefresh) {
          setAccessToken(storedAccess);
          setRefreshToken(storedRefresh);
          // Sync with API client
          apiClient.setAccessToken(storedAccess);
        }
      } catch (error) {
        console.error("Failed to initialize auth from localStorage:", error);
        // Clear potentially corrupted data
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
      } finally {
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, []);

  // Save tokens to localStorage and sync with API client
  const saveTokens = useCallback((access: string, refresh: string) => {
    try {
      // Save to localStorage
      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);

      // Update state
      setAccessToken(access);
      setRefreshToken(refresh);

      // Sync with API client
      apiClient.setAccessToken(access);
    } catch (error) {
      console.error("Failed to save tokens:", error);
      throw new Error("Failed to save authentication tokens");
    }
  }, []);

  // Clear all authentication data
  const clearAuthData = useCallback(() => {
    try {
      // Clear localStorage
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");

      // Clear state
      setAccessToken(null);
      setRefreshToken(null);

      // Clear API client token
      apiClient.clearTokens();

      // Clear refresh timer
      clearRefreshTimer();

      // Clear errors
      setError(null);

      // Reset refresh flag
      isRefreshingRef.current = false;
    } catch (error) {
      console.error("Failed to clear auth data:", error);
    }
  }, [clearRefreshTimer]);

  // Logout function
  const logout = useCallback(() => {
    clearAuthData();
    router.push("/authentication/signin");
  }, [clearAuthData, router]);

  // Refresh access token
  const refreshAccessToken = useCallback(
    async (refresh: string): Promise<boolean> => {
      // Prevent concurrent refresh attempts
      if (isRefreshingRef.current) {
        return false;
      }

      // Only proceed if user is still authenticated
      if (!accessToken || !refreshToken) {
        return false;
      }

      isRefreshingRef.current = true;

      try {
        const response = await fetch(`${API_URL}/api/token/refresh/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refresh }),
        });

        if (!response.ok) {
          throw new Error(`Token refresh failed: ${response.status}`);
        }

        const data: TokenResponse = await response.json();

        if (!data.access) {
          throw new Error("No access token in refresh response");
        }

        // Only save tokens if user is still authenticated
        if (accessToken && refreshToken) {
          saveTokens(data.access, refresh);
          return true;
        }

        return false;
      } catch (error) {
        console.error("Token refresh failed:", error);
        logout();
        return false;
      } finally {
        isRefreshingRef.current = false;
      }
    },
    [accessToken, refreshToken, saveTokens, logout]
  );

  // Schedule token refresh
  useEffect(() => {
    // Clear any existing timer
    clearRefreshTimer();

    // Only set up refresh timer if user is authenticated and initialized
    if (!isAuthenticated || !refreshToken || !isInitialized) {
      return;
    }

    const scheduleRefresh = () => {
      refreshTimerRef.current = setTimeout(async () => {
        const success = await refreshAccessToken(refreshToken);
        if (success) {
          // Schedule next refresh
          scheduleRefresh();
        }
      }, REFRESH_INTERVAL);
    };

    scheduleRefresh();

    // Cleanup function
    return () => {
      clearRefreshTimer();
    };
  }, [
    refreshToken,
    isAuthenticated,
    isInitialized,
    refreshAccessToken,
    clearRefreshTimer,
  ]);

  // Register user
  const register = async (
    email: string,
    store_name: string,
    password: string,
    location: string,
    niche: string,
    full_name: string
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/signup/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          store_name: store_name.trim(),
          password,
          location: location.trim(),
          niche: niche.trim(),
          full_name: full_name.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const serverErrors: FormErrors = {};

        // Handle specific error cases
        if (errorData.error) {
          if (errorData.error.includes("Email")) {
            serverErrors.email = errorData.error;
          } else if (errorData.error.includes("Store name")) {
            serverErrors.store_name = errorData.error;
          } else {
            serverErrors.global = errorData.error;
          }
        } else if (errorData.email) {
          serverErrors.email = Array.isArray(errorData.email)
            ? errorData.email[0]
            : errorData.email;
        } else if (errorData.store_name) {
          serverErrors.store_name = Array.isArray(errorData.store_name)
            ? errorData.store_name[0]
            : errorData.store_name;
        } else {
          serverErrors.global = "Registration failed. Please try again.";
        }

        setError(serverErrors);
        return false;
      }

      setError(null);
      return true;
    } catch (networkError) {
      console.error("Registration network error:", networkError);
      setError({
        global: "Network error. Please check your connection and try again.",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/signin/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const serverErrors: FormErrors = {};

        if (errorData.error) {
          if (errorData.error.includes("Invalid credentials")) {
            serverErrors.global = "Invalid email or password";
          } else {
            serverErrors.global = errorData.error;
          }
        } else {
          serverErrors.global = "Login failed. Please try again.";
        }

        setError(serverErrors);
        return false;
      }

      const data: LoginResponse = await response.json();
      const { access, refresh } = data.tokens;

      if (!access || !refresh) {
        setError({ global: "Invalid response from server. Please try again." });
        return false;
      }

      saveTokens(access, refresh);
      setError(null);

      // Navigate to dashboard after successful login
      router.push("/dashboard");
      return true;
    } catch (networkError) {
      console.error("Login network error:", networkError);
      setError({
        global: "Network error. Please check your connection and try again.",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Context value
  const contextValue: AuthContextType = {
    register,
    login,
    logout,
    error,
    accessToken,
    refreshToken,
    loading,
    isAuthenticated,
    clearError,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
