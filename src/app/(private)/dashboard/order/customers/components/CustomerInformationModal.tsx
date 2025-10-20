"use client";

import React from "react";
import { X } from "lucide-react";

interface Customer {
  id?: number;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  totalPurchases?: number;
  purchaseVolume?: string;
  orders?: number;
}

interface CustomerInformationModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | null;
}

const CustomerInformationModal: React.FC<CustomerInformationModalProps> = ({
  isOpen,
  onClose,
  customer,
}) => {
  if (!isOpen || !customer) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 text-[var(--color-text-primary)] flex items-center justify-center z-50">
      <div className="bg-[var(--color-bg-surface)] rounded-3xl shadow-xl w-11/12 max-w-md max-h-[80vh] flex flex-col animate-in fade-in-0 zoom-in-95">
        <div className="flex-shrink-0 justify-between items-center p-6 border-b border-[var(--color-border-strong)]">
          <div className="flex justify-between items-center">
            <h2 className="text-md text-[var(--color-text-primary)] font-semibold">
              Customer Information
            </h2>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-[var(--color-bg-secondary)] border border-[var(--color-border-strong)] transition"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-[var(--color-text-primary)]" />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4 text-sm">
          <div className="space-y-4 pb-6">
            <div className="flex items-center justify-between">
              <span className="text-[var(--color-text-primary)]">Name</span>
              <span className="text-[var(--color-text-secondary)]">
                {customer.name || "Not specified"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--color-text-primary)]">
                Phone Number
              </span>
              <span className="text-[var(--color-text-secondary)]">
                {customer.phone || "Not specified"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--color-text-primary)]">Email</span>
              <span className="text-[var(--color-text-secondary)]">
                {customer.email || "Not specified"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--color-text-primary)]">Address</span>
              <span className="text-[var(--color-text-secondary)]">
                {customer.address || "Not specified"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--color-text-primary)] flex items-center gap-2">
                <span className="bg-orange-500 rounded-full w-3 h-3" /> Total
                Purchases
              </span>
              <span className="text-[var(--color-text-secondary)]">
                {customer.totalPurchases ?? "0"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--color-text-primary)] flex items-center gap-2">
                <span className="bg-green-500 rounded-full w-3 h-3" /> Purchase
                Volume
              </span>
              <span className="text-[var(--color-text-secondary)]">
                {customer.purchaseVolume || "NGN 0"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--color-text-primary)]">Orders</span>
              <span className="text-[var(--color-text-secondary)]">
                {customer.orders || 0} Order{customer.orders !== 1 ? "s" : ""}{" "}
                &gt;
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerInformationModal;
