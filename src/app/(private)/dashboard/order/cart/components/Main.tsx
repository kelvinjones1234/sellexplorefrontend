"use client";

import React, { useState, useEffect } from "react";
import { MapPin, ChevronDown, Loader2 } from "lucide-react";
import Link from "next/link";
import FloatingLabelInput from "@/app/component/fields/Input";
import { apiClient } from "../../api";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
import CartDetailsModal from "./CartDetailsModal";

// Type for each order (matching your Django serializer)
export interface DashboardOrder {
  id: number;
  customer: {
    name: string;
    phone: string;
  } | null;
  delivery_area: string; // e.g., "Ikeja" or "Not specified"
  recipient_type: "myself" | "someone_else";
  order_notes: string | null;
  status:
    | "pending"
    | "processing"
    | "confirmed"
    | "fulfilled"
    | "cancelled"
    | "abandoned";
  subtotal_amount: string;
  discount_amount: string;
  total_amount: string;
  items_count: number;
  created_at: string;
  updated_at: string;
  o_id: string;
}

// UI status colors
const statusColors: Record<string, { bg: string; text: string }> = {
  pending: { bg: "bg-yellow-100 text-yellow-800", text: "text-yellow-600" },
  processing: { bg: "bg-blue-100 text-blue-800", text: "text-blue-600" },
  confirmed: { bg: "bg-green-100 text-green-800", text: "text-green-600" },
  fulfilled: { bg: "bg-purple-100 text-purple-800", text: "text-purple-600" },
  cancelled: { bg: "bg-red-100 text-red-800", text: "text-red-600" },
  abandoned: { bg: "bg-gray-100 text-gray-800", text: "text-gray-600" },
};

const Main: React.FC = () => {
  const { isAuthenticated, accessToken, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [orders, setOrders] = useState<DashboardOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<DashboardOrder | null>(
    null
  );
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Fetch orders from backend
  const fetchOrders = async () => {
    if (!isAuthenticated) {
      setError("Authentication required");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.getOrders(searchTerm);
      console.log("Fetched Orders:", response);

      const formattedOrders = response.map((order: DashboardOrder) => ({
        ...order,
        delivery_area: order.delivery_area || "Not specified",
        items_count: order.items_count || 0,
      }));

      setOrders(formattedOrders);
    } catch (err: any) {
      const errorMessage = err.message || "Failed to fetch orders";
      setError(errorMessage);
      toast.error(errorMessage);
      if (err.status === 401) {
        setError("Session expired. Please log in again.");
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  // Apply access token to API client
  useEffect(() => {
    if (accessToken) {
      apiClient.setAccessToken(accessToken);
    }
  }, [accessToken]);

  // Fetch orders on auth or search change
  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    } else {
      setError("Please log in to access this page.");
      setLoading(false);
    }
  }, [isAuthenticated, searchTerm]);

  const filteredOrders = orders.filter((order) =>
    order.customer?.name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase().trim())
  );

  const totalPages = Math.ceil(filteredOrders.length / pageSize);
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, filteredOrders.length);

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-[var(--color-brand-primary)]" />
          <span className="text-[var(--color-text-secondary)]">
            Loading orders...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">Error: {error}</div>
          <Link
            href="/login"
            className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-secondary)]">
      {/* Header */}
      <header className="sticky top-0 bg-[var(--color-bg-primary)] border-b border-[var(--color-border-default)] px-4 py-3 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
            <Link href="/dashboard/my-store/">
              <span className="font-medium hover:text-[var(--color-brand-primary)] transition-colors">
                Orders
              </span>
            </Link>
            <span>›</span>
            <span>Carts</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[var(--color-brand-primary)]">⚡</span>
            <span className="text-sm font-medium">Quick Actions</span>
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </header>

      <div className="pb-8">
        {/* Search */}
        <div className="flex justify-between items-center py-3 px-4">
          <div className="font-medium">All Carts</div>
          <div className="relative flex-1 max-w-md hidden lg:block">
            <FloatingLabelInput
              type="text"
              name="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search carts"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-[var(--color-bg)] overflow-hidden mb-6">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--color-border-default)] text-[var(--color-text-primary)] bg-[var(--color-bg-secondary)]">
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Items
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Location
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider">
                  Last Update
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border-default)]">
              {paginatedOrders.map((order) => (
                <tr
                  key={order.id}
                  onClick={() => {
                    setSelectedOrder(order);
                    setIsDetailsModalOpen(true);
                  }}
                  className="hover:bg-[var(--color-bg-surface)] cursor-pointer transition-colors"
                >
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-[var(--color-brand-primary)] rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {order.customer?.name
                          ? order.customer.name.charAt(0).toUpperCase()
                          : "?"}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium capitalize">
                          {order.customer?.name || "Unknown"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {order.customer?.phone || "No phone"}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    {order.items_count} items
                  </td>

                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      {order.delivery_area}
                    </div>
                  </td>

                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center">{order.o_id}</div>
                  </td>

                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        statusColors[order.status]?.bg ||
                        "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>

                  <td className="px-4 py-4 whitespace-nowrap text-right text-sm">
                    {new Date(order.updated_at).toLocaleString("en-US", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                      hour12: true,
                      timeZone: "Africa/Lagos",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredOrders.length > 0 && (
          <div className="flex px-4 flex-col sm:flex-row justify-between items-center text-sm">
            <div>
              Showing {startItem}-{endItem} of {filteredOrders.length} carts
            </div>
            <div className="flex items-center gap-2 mt-4 sm:mt-0">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 border rounded-lg disabled:opacity-50"
              >
                Previous
              </button>
              <span>
                {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-2 border rounded-lg disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Modal */}
        {selectedOrder && (
          <CartDetailsModal
            isOpen={isDetailsModalOpen}
            onClose={() => setIsDetailsModalOpen(false)}
            cart={selectedOrder}
          />
        )}
      </div>
    </div>
  );
};

export default Main;
