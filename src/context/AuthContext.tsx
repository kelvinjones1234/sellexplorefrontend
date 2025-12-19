// "use client";

// import React, {
//   createContext,
//   useContext,
//   useState,
//   useEffect,
//   useCallback,
//   useRef,
//   useLayoutEffect,
//   ReactNode,
// } from "react";
// import { useRouter } from "next/navigation";
// import {api} from "@/constant/baseUrl"
// import { tokenManager } from "@/app/(private)/utils/tokenManager"; // Keeping this to sync with your class-based services
// import { FormErrors } from "@/app/types/AuthTypes";

// // ==== Types ====
// interface TokenResponse {
//   access: string;
//   refresh: string;
// }

// interface AuthContextType {
//   register: (
//     email: string,
//     store_name: string,
//     password: string,
//     location: string,
//     niche: string,
//     full_name: string
//   ) => Promise<boolean>;
//   login: (email: string, password: string) => Promise<boolean>;
//   logout: () => void;
//   error: FormErrors | null;
//   accessToken: string | null;
//   refreshToken: string | null;
//   loading: boolean;
//   isAuthenticated: boolean;
//   clearError: () => void;
//   isInitialized: boolean;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// // Use env var or fallback
// const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
//   const router = useRouter();

//   // ==== State ====
//   const [accessToken, setAccessToken] = useState<string | null>(null);
//   const [refreshToken, setRefreshToken] = useState<string | null>(null);
//   const [error, setError] = useState<FormErrors | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [isInitialized, setIsInitialized] = useState(false);

//   // ==== Refs (to handle race conditions) ====
//   const isRefreshingRef = useRef(false);

//   const clearError = useCallback(() => setError(null), []);

//   // ==== 1. Centralized Token Management ====
//   const saveTokens = useCallback((access: string, refresh: string) => {
//     // 1. Save to LocalStorage (Persistence)
//     localStorage.setItem("access", access);
//     localStorage.setItem("refresh", refresh);

//     // 2. Update React State (Re-renders UI)
//     setAccessToken(access);
//     setRefreshToken(refresh);

//     // 3. Update TokenManager (Syncs with legacy/class-based services)
//     tokenManager.setAccessToken(access);
//   }, []);

//   const clearAuthData = useCallback(() => {
//     localStorage.removeItem("access");
//     localStorage.removeItem("refresh");
//     setAccessToken(null);
//     setRefreshToken(null);
//     tokenManager.setAccessToken(null);
//     setError(null);
//   }, []);

//   const logout = useCallback(() => {
//     clearAuthData();
//     router.push("/authentication/signin");
//   }, [clearAuthData, router]);

//   // ==== 2. Token Refresh Logic ====
//   // We use raw 'fetch' here to avoid circular loops with Axios interceptors
//   const refreshAccessToken = useCallback(async (): Promise<string | null> => {
//     // Check if we are already refreshing to prevent duplicate calls
//     if (isRefreshingRef.current) return null;
    
//     // Always read the latest refresh token from storage
//     const currentRefresh = localStorage.getItem("refresh");
//     if (!currentRefresh) {
//       logout();
//       return null;
//     }

//     isRefreshingRef.current = true;

//     try {
//       const response = await fetch(`${API_URL}/api/token/refresh/`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ refresh: currentRefresh }),
//       });

//       if (!response.ok) {
//         throw new Error(`Refresh failed with status ${response.status}`);
//       }

//       const data: TokenResponse = await response.json();
      
//       // Save new tokens. 
//       // Note: Some backends rotate the refresh token too; some only return access.
//       // If data.refresh exists, use it; otherwise keep the old one.
//       const newRefresh = data.refresh || currentRefresh;
//       saveTokens(data.access, newRefresh);
      
//       return data.access;
//     } catch (err) {
//       console.error("Auto-refresh failed:", err);
//       logout(); // If refresh fails, session is dead.
//       return null;
//     } finally {
//       isRefreshingRef.current = false;
//     }
//   }, [logout, saveTokens]);

//   // ==== 3. Axios Interceptors (The Core Logic) ====
//   // useLayoutEffect ensures this runs synchronously before browser paint, 
//   // setting up the interceptors before any children components might fire requests.
//   useLayoutEffect(() => {
//     // -- Request Interceptor --
//     // Automatically injects the token into every request made by 'api'
//     const reqInterceptor = api.interceptors.request.use((config) => {
//       // Use the latest token from state
//       if (accessToken) {
//         config.headers.Authorization = `Bearer ${accessToken}`;
//       }
//       return config;
//     });

//     // -- Response Interceptor --
//     // Catches 401 errors and attempts to auto-fix them
//     const resInterceptor = api.interceptors.response.use(
//       (response) => response, // Pass through successful responses
//       async (error) => {
//         const originalRequest = error.config;

//         // Check if it's a 401 (Unauthorized) and we haven't retried yet
//         if (
//           error.response?.status === 401 && 
//           !originalRequest._retry && 
//           // Ensure we don't retry the login endpoint itself
//           !originalRequest.url?.includes("/signin") 
//         ) {
//           originalRequest._retry = true; // Mark as retried

//           try {
//             const newToken = await refreshAccessToken();
//             if (newToken) {
//               // Update header and retry the original request
//               originalRequest.headers.Authorization = `Bearer ${newToken}`;
//               return api(originalRequest);
//             }
//           } catch (refreshError) {
//             // Refresh failed, promise rejection propagates to component
//             return Promise.reject(refreshError);
//           }
//         }
        
//         return Promise.reject(error);
//       }
//     );

//     // Cleanup: Eject interceptors when component unmounts or token changes
//     return () => {
//       api.interceptors.request.eject(reqInterceptor);
//       api.interceptors.response.eject(resInterceptor);
//     };
//   }, [accessToken, refreshAccessToken]);


//   // ==== 4. Login Action ====
//   const login = async (email: string, password: string): Promise<boolean> => {
//     setLoading(true);
//     setError(null);
//     try {
//       // We use 'api' here. Even though we don't have a token yet, 
//       // the interceptor will just skip adding the header.
//       const response = await api.post("/signin/", { email, password });
      
//       // Adjust this destructuring based on your exact API response shape
//       const { access, refresh } = response.data.tokens || response.data;
      
//       if (!access || !refresh) {
//         throw new Error("Invalid response from server");
//       }

//       saveTokens(access, refresh);
//       router.push("/dashboard");
//       return true;
//     } catch (err: any) {
//       console.error("Login error:", err);
//       // Handle Axios error structure
//       const msg = err.response?.data?.error || 
//                   (err.response?.data?.detail) || 
//                   "Login failed. Please check your credentials.";
//       setError({ global: msg });
//       return false;
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ==== 5. Register Action ====
//   const register = async (
//     email: string,
//     store_name: string,
//     password: string,
//     location: string,
//     niche: string,
//     full_name: string
//   ): Promise<boolean> => {
//     setLoading(true);
//     setError(null);
//     try {
//       await api.post("/api/signup/", {
//         email,
//         store_name,
//         password,
//         location,
//         niche,
//         full_name,
//       });
//       // Assuming registration doesn't auto-login, otherwise call saveTokens here
//       return true;
//     } catch (err: any) {
//       console.error("Registration error:", err);
//       const msg = err.response?.data?.error || "Registration failed. Try again.";
//       setError({ global: msg });
//       return false;
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ==== 6. Initialization (On Mount) ====
//   useEffect(() => {
//     const initAuth = () => {
//       const storedAccess = localStorage.getItem("access");
//       const storedRefresh = localStorage.getItem("refresh");
      
//       if (storedAccess && storedRefresh) {
//         setAccessToken(storedAccess);
//         setRefreshToken(storedRefresh);
//         tokenManager.setAccessToken(storedAccess);
//       }
//       setIsInitialized(true);
//     };
//     initAuth();
//   }, []);

//   // ==== 7. Cross-Tab Synchronization ====
//   useEffect(() => {
//     const syncAcrossTabs = (e: StorageEvent) => {
//       if (e.key === "access") {
//         setAccessToken(e.newValue);
//         tokenManager.setAccessToken(e.newValue);
//         if (!e.newValue) {
//            // If another tab logged out (cleared token), we logout too
//            setRefreshToken(null);
//            router.push("/authentication/signin");
//         }
//       }
//       if (e.key === "refresh") {
//         setRefreshToken(e.newValue);
//       }
//     };

//     window.addEventListener("storage", syncAcrossTabs);
//     return () => window.removeEventListener("storage", syncAcrossTabs);
//   }, [router]);

//   // ==== Value Exposure ====
//   const value: AuthContextType = {
//     register,
//     login,
//     logout,
//     error,
//     accessToken,
//     refreshToken,
//     loading,
//     isAuthenticated: !!accessToken,
//     clearError,
//     isInitialized,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

// // ==== Hook ====
// export const useAuth = () => {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
//   return ctx;
// }; 











"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  useLayoutEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { api } from "@/constant/baseUrl"; 
import { FormErrors } from "@/app/types/AuthTypes";

interface TokenResponse {
  access: string;
  refresh: string;
}

// Simple types for the queue
interface QueueItem {
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}

interface AuthContextType {
  register: (data: any) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  error: FormErrors | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  clearError: () => void;
  isInitialized: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const router = useRouter();

  // ==== State ====
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [error, setError] = useState<FormErrors | null>(null);
  const [loading, setLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // ==== Refs ====
  // Holds the latest token so interceptors can read it without needing a re-render
  const accessTokenRef = useRef<string | null>(null);
  const isRefreshingRef = useRef(false);
  const failedQueueRef = useRef<QueueItem[]>([]);

  const clearError = useCallback(() => setError(null), []);

  // Helper: Process the queue of failed requests
  const processQueue = (error: any, token: string | null = null) => {
    failedQueueRef.current.forEach((prom) => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    });
    failedQueueRef.current = [];
  };

  // ==== 1. Centralized Token Management ====
  const saveTokens = useCallback((access: string, refresh: string) => {
    localStorage.setItem("access", access);
    localStorage.setItem("refresh", refresh);

    setAccessToken(access);
    accessTokenRef.current = access; // Sync ref
    setRefreshToken(refresh);
  }, []);

  const clearAuthData = useCallback(() => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    
    setAccessToken(null);
    accessTokenRef.current = null; // Sync ref
    setRefreshToken(null);
    setError(null);
  }, []);

  const logout = useCallback(() => {
    clearAuthData();
    router.push("/authentication/signin");
  }, [clearAuthData, router]);

  // ==== 2. Token Refresh Logic ====
  const refreshAccessToken = useCallback(async (): Promise<string> => {
    const currentRefresh = localStorage.getItem("refresh");
    
    if (!currentRefresh) {
      throw new Error("No refresh token available");
    }

    const response = await fetch(`${API_URL}/api/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: currentRefresh }),
    });

    if (!response.ok) {
      throw new Error(`Refresh failed: ${response.status}`);
    }

    const data: TokenResponse = await response.json();
    const newRefresh = data.refresh || currentRefresh;
    
    saveTokens(data.access, newRefresh);
    return data.access;
  }, [saveTokens]);

  // ==== 3. Axios Interceptors ====
  useLayoutEffect(() => {
    // A. Request Interceptor
    const reqInterceptor = api.interceptors.request.use((config) => {
      if (accessTokenRef.current) {
        config.headers.Authorization = `Bearer ${accessTokenRef.current}`;
      }
      return config;
    });

    // B. Response Interceptor
    const resInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          !originalRequest.url?.includes("/signin")
        ) {
          if (isRefreshingRef.current) {
            return new Promise((resolve, reject) => {
              failedQueueRef.current.push({ resolve, reject });
            })
              .then((token) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return api(originalRequest);
              })
              .catch((err) => Promise.reject(err));
          }

          originalRequest._retry = true;
          isRefreshingRef.current = true;

          try {
            const newToken = await refreshAccessToken();
            processQueue(null, newToken);
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return api(originalRequest);
          } catch (refreshError) {
            processQueue(refreshError, null);
            logout(); 
            return Promise.reject(refreshError);
          } finally {
            isRefreshingRef.current = false;
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.request.eject(reqInterceptor);
      api.interceptors.response.eject(resInterceptor);
    };
  }, [refreshAccessToken, logout]);

  // ==== 4. Login Action ====
  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post("/signin/", { email, password });
      const { access, refresh } = response.data.tokens || response.data;
      
      if (!access || !refresh) throw new Error("Invalid response");

      saveTokens(access, refresh);
      router.push("/dashboard");
      return true;
    } catch (err: any) {
      console.error("Login error:", err);
      const msg = err.response?.data?.error || "Login failed.";
      setError({ global: msg });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ==== 5. Initialization ====
  useEffect(() => {
    const initAuth = () => {
      const storedAccess = localStorage.getItem("access");
      const storedRefresh = localStorage.getItem("refresh");
      
      if (storedAccess && storedRefresh) {
        setAccessToken(storedAccess);
        accessTokenRef.current = storedAccess;
        setRefreshToken(storedRefresh);
      }
      setIsInitialized(true);
    };
    initAuth();
  }, []);

  const value: AuthContextType = {
    register: async () => true, // Placeholder
    login,
    logout,
    error,
    accessToken,
    refreshToken,
    loading,
    isAuthenticated: !!accessToken,
    clearError,
    isInitialized,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};