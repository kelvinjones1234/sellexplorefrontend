"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import CustomerInformationModal from "../../customers/components/CustomerInformationModal";
import Link from "next/link";

// Updated Order and OrderItem types to match the provided data structure
export interface DashboardOrder {
  id: number;
  customer: {
    name: string;
    phone: string;
  };
  delivery_area: string;
  recipient_type: string;
  order_notes: string | null;
  status: string;
  subtotal_amount: string;
  discount_amount: string;
  total_amount: string;
  created_at: string;
  updated_at: string;
  items_count: number; // total number of order items
  o_id: string;
}

interface DashboardOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: DashboardOrder | null;
}

const CartDetailsModal: React.FC<DashboardOrderModalProps> = ({
  isOpen,
  onClose,
  cart,
}) => {
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);

  if (!isOpen || !cart) return null;

  console.log("ddddd", cart);

  const formattedDate = new Date(cart.updated_at).toLocaleString();
  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 text-[var(--color-text-secondary)] flex items-center justify-center z-50">
        <div className="bg-[var(--color-bg-surface)] rounded-3xl shadow-xl w-11/12 max-w-md max-h-[80vh] flex flex-col animate-in fade-in-0 zoom-in-95">
          <div className="flex-shrink-0 justify-between items-center p-6 border-b border-[var(--color-border-strong)]">
            <div className="flex justify-between items-center">
              <h2 className="text-md text-[var(--color-text-secondary)] font-semibold">
                Cart Details
              </h2>
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-[var(--color-bg-secondary)] border border-[var(--color-border-strong)] transition"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 text-[var(--color-text-secondary)]" />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-4 text-sm">
            <div className="space-y-6 pb-6">
              {/* Customer Info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-[var(--color-bg-secondary)] rounded-full flex items-center justify-center text-[var(--color-text-secondary)] text-sm font-medium">
                    {cart.customer.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-semibold capitalize text-[var(--color-text-secondary)]">
                      {cart.customer.name}
                    </div>
                    <div className="text-xs text-[var(--color-text-secondary)]">
                      {cart.customer.phone || "No phone provided"}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsCustomerModalOpen(true)}
                  className="text-[var(--color-brand-primary)] text-sm font-medium hover:text-[var(--color-brand-hover)] transition"
                >
                  View Profile →
                </button>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between">
                <span className="text-[var(--color-text-primary)]">Status</span>
                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)]">
                  {cart.status}
                </span>
              </div>

              {/* Location */}
              <div className="flex items-center justify-between">
                <span className="text-[var(--color-text-primary)]">
                  Location
                </span>
                <span className="text-[var(--color-text-secondary)]">
                  {cart.delivery_area || "Not specified"}
                </span>
              </div>

              {/* Currency */}
              <div className="flex items-center justify-between">
                <span className="text-[var(--color-text-primary)]">
                  Currency
                </span>
                <span className="text-[var(--color-text-secondary)]">NGN</span>
              </div>

              {/* Last Update */}
              <div className="flex items-center justify-between">
                <span className="text-[var(--color-text-primary)]">
                  Last Update
                </span>
                <span className="text-[var(--color-text-secondary)]">
                  {formattedDate}
                </span>
              </div>

              {/* Order */}
              <div className="flex items-center justify-between">
                <span className="text-[var(--color-text-secondary)]">
                  Order: {cart.items_count}
                </span>
                <Link
                  href={`/dashboard/order/${cart.o_id}`}
                  className="text-[var(--color-brand-primary)] text-sm font-medium hover:text-[var(--color-brand-hover)] transition"
                >
                  View Order →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CustomerInformationModal
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        customer={cart.customer}
      />
    </>
  );
};

export default CartDetailsModal;
