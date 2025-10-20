"use client";

import React, { useState, useEffect } from "react";
import { Edit3, Trash2, ChevronDown, Loader2 } from "lucide-react";
import Link from "next/link";
import FloatingLabelInput from "@/app/component/fields/Input";
import { apiClient } from "../../api";
import { useAuth } from "@/context/AuthContext";
import { Customer } from "../../types";
import { toast } from "react-toastify";
import CustomerInformationModal from "./CustomerInformationModal";
import EditCustomerModal from "./EditCustomerModal";

const Main: React.FC = () => {
  const { isAuthenticated, accessToken, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchCustomers = async () => {
    if (!isAuthenticated) {
      setError("Authentication required");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await apiClient.getCustomers(searchTerm);
      setCustomers(data);
    } catch (err: any) {
      const errorMessage = err.message || "Failed to fetch customers";
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

  useEffect(() => {
    if (accessToken) {
      apiClient.setAccessToken(accessToken);
    }
  }, [accessToken]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCustomers();
    } else {
      setError("Please log in to access this page.");
      setLoading(false);
    }
  }, [isAuthenticated, searchTerm]);

  const handleAddCustomer = async () => {
    if (!isAuthenticated || !accessToken) {
      setError("Authentication failed. Please log in again.");
      logout();
      return;
    }

    try {
      const newCustomer = await apiClient.createCustomer({
        name: "New Customer",
        phone: "",
      });
      setCustomers((prev) => [newCustomer, ...prev]);
      toast.success("Customer added successfully!");
    } catch (err: any) {
      const errorMessage = err.message || "Failed to add customer";
      setError(errorMessage);
      toast.error(errorMessage);
      if (err.status === 401) {
        setError("Session expired. Please log in again.");
        logout();
      }
    }
  };

  const handleUpdateCustomer = async (id: number, data: Partial<Customer>) => {
    if (!isAuthenticated || !accessToken) {
      setError("Authentication failed. Please log in again.");
      logout();
      return;
    }

    try {
      const updatedCustomer = await apiClient.updateCustomer(id, data);
      setCustomers((prev) =>
        prev.map((customer) =>
          customer.id === id ? updatedCustomer : customer
        )
      );
      toast.success("Customer updated successfully!");
      setIsEditModalOpen(false);
    } catch (err: any) {
      const errorMessage = err.message || "Failed to update customer";
      setError(errorMessage);
      toast.error(errorMessage);
      if (err.status === 401) {
        setError("Session expired. Please log in again.");
        logout();
      }
    }
  };

  const handleDeleteCustomer = async (id: number) => {
    if (!isAuthenticated || !accessToken) {
      setError("Authentication failed. Please log in again.");
      logout();
      return;
    }

    try {
      await apiClient.deleteCustomer(id);
      setCustomers((prev) => prev.filter((customer) => customer.id !== id));
      toast.success("Customer deleted successfully!");
    } catch (err: any) {
      const errorMessage = err.message || "Failed to delete customer";
      setError(errorMessage);
      toast.error(errorMessage);
      if (err.status === 401) {
        setError("Session expired. Please log in again.");
        logout();
      }
    }
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCustomers.length / pageSize);
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, filteredCustomers.length);

  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-[var(--color-brand-primary)]" />
          <span className="text-[var(--color-text-secondary)]">
            Loading customers...
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
              <span className="font-medium text-[var(--color-text-primary)] hover:text-[var(--color-brand-primary)] transition-colors">
                Orders
              </span>
            </Link>
            <span>›</span>
            <span>Customers</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[var(--color-brand-primary)]">⚡</span>
            <span className="text-sm font-medium text-[var(--color-text-secondary)]">
              Quick Actions
            </span>
            <ChevronDown className="w-4 h-4 text-[var(--color-text-secondary)]" />
          </div>
        </div>
      </header>

      <div className="pb-8">
        <div className="">
          {/* Search and Filters */}
          <div className="flex justify-between items-center py-6 px-4">
            <div className="text-[var(--color-text-primary)] font-medium">
              All Customers
            </div>
            <div className="flex justify-between items-center">
              <div className="flex gap-x-4 items-center">
                <div className="relative flex-1 max-w-md lg:block hidden">
                  <FloatingLabelInput
                    type="text"
                    name="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search customers"
                  />
                </div>
                <button
                  onClick={handleAddCustomer}
                  className="flex-shrink-0 flex items-center justify-center bg-[var(--color-brand-primary)] text-[var(--color-on-brand)] text-sm font-medium hover:bg-[var(--color-brand-hover)] transition-colors rounded-lg px-4 py-2.5"
                >
                  Add Customer
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-[var(--color-bg)] rounded-xl overflow-hidden mb-6">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--color-border-default)]">
                  <th className="px-4 py-3 text-left text-xs font-medium text-[var(--color-text-primary)] uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[var(--color-text-primary)] uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[var(--color-text-primary)] uppercase tracking-wider">
                    Purchases
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[var(--color-text-primary)] uppercase tracking-wider">
                    Volume
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-[var(--color-text-primary)] uppercase tracking-wider">
                    Options
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[var(--color-border-default)]">
                {paginatedCustomers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="hover:bg-[var(--color-bg-surface)] cursor-pointer"
                    onClick={() => {
                      setSelectedCustomer(customer);
                      setIsInfoModalOpen(true);
                    }}
                  >
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-[var(--color-brand-primary)] rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {customer.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-[var(--color-text-primary)]">
                            {customer.name}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap text-sm text-[var(--color-text-secondary)]">
                      {customer.phone}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-[var(--color-text-primary)]">
                      {customer.purchases}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-[var(--color-text-primary)]">
                      {customer.volume}
                    </td>

                    <td
                      className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium"
                      onClick={(e) => e.stopPropagation()} // Prevent opening info modal when clicking icons
                    >
                      <div className="flex items-center justify-end gap-6">
                        <Edit3
                          className="w-4 h-4 text-[var(--color-text-secondary)] cursor-pointer hover:text-[var(--color-brand-primary)]"
                          onClick={() => {
                            setSelectedCustomer(customer);
                            setIsEditModalOpen(true);
                          }}
                        />
                        <Trash2
                          className="w-4 h-4 text-[var(--color-text-secondary)] cursor-pointer hover:text-red-500"
                          onClick={() => {
                            if (
                              confirm(
                                `Are you sure you want to delete ${customer.name}?`
                              )
                            ) {
                              handleDeleteCustomer(customer.id);
                            }
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredCustomers.length > 0 && (
            <div className="flex px-4 flex-col sm:flex-row justify-between items-center text-sm text-[var(--color-text-secondary)]">
              <div>
                Showing {startItem}-{endItem} of {filteredCustomers.length}{" "}
                customers
              </div>
              <div className="flex items-center gap-2 mt-4 sm:mt-0">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="px-3 py-2 border border-[var(--color-border-default)] rounded-lg disabled:opacity-50"
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
                  className="px-3 py-2 border border-[var(--color-border-default)] rounded-lg disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modals */}
        {selectedCustomer && (
          <CustomerInformationModal
            isOpen={isInfoModalOpen}
            onClose={() => setIsInfoModalOpen(false)}
            customer={selectedCustomer}
          />
        )}
        {selectedCustomer && (
          <EditCustomerModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onSave={(data) => handleUpdateCustomer(selectedCustomer.id, data)}
            initialData={selectedCustomer}
          />
        )}
      </div>
    </div>
  );
};

export default Main;
