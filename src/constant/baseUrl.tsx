import axios from "axios";

// ==========================================
// 1. CONFIGURATION CONSTANTS
// ==========================================

// --- Development Server ---
export const API_BASE_URL = "http://localhost:8000/api";
// export const IMAGE_API_BASE = "http://localhost:8000/";

// --- Production Server (Uncomment when deploying) ---
// export const API_BASE = "https://sellexplore.pythonanywhere.com/api";
// export const IMAGE_API_BASE = "https://sellexplore.pythonanywhere.com/";

// --- Third Party ---
export const CLOUDINARY_BASE =
  "https://339f56ac9c8c40e58b119c93af69401e.r2.cloudflarestorage.com/sellexplore/media/";


// ==========================================
// 2. AXIOS INSTANCE
// ==========================================



// This instance starts "empty" (no tokens).
// AuthContext will inject the token via interceptors.
export const api = axios.create({
  // Prioritize environment variable, fallback to your hardcoded constant logic
  baseURL: process.env.NEXT_PUBLIC_API_URL || API_BASE_URL || "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});