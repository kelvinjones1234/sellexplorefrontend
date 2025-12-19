"use client";

import ProtectedRoute from "./utils/PrivateRoute";
import DashboardNavbar from "./components/navbar/DashboardNavbar";
import Sidebar from "./components/DesktopSidebar";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "@/context/AuthContext";

export default function PrivateLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <div className="flex h-screen">
          {/* Sidebar - only visible on md and up */}
          <div className="hidden md:flex w-[300px] border-r border-[var(--color-border-strong)]">
            <Sidebar />
          </div>

          {/* Main content */}
          <main className="flex-1 flex flex-col min-w-0">
            <DashboardNavbar />
            <hr className="border-[var(--color-border-strong)]" />
            <div className="overflow-y-auto">{children}</div>
          </main>

          {/* Toast notifications */}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
        </div>
      </ProtectedRoute>
    </AuthProvider>
  );
}
