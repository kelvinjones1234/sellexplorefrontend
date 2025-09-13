import ProtectedRoute from "../utils/PrivateRoute";
import DashboardNavbar from "./components/navbar/DashboardNavbar";
import Sidebar from "./components/DesktopSidebar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function PrivateLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ProtectedRoute>
      <div className="flex h-screen">
        {/* Sidebar - only visible on md and up */}
        <div className="hidden md:flex w-[300px] border-r border-[var(--color-border)]">
          <Sidebar />
        </div>

        {/* Main content - flex-1 ensures it takes remaining space */}
        <main className="flex-1 flex flex-col min-w-0">
          <DashboardNavbar />
          <hr className="border-[var(--color-border)]" />
          <div className="overflow-y-auto">{children}</div>
        </main>
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
  );
}
