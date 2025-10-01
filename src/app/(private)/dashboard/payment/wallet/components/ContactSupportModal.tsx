"use client";
import React from "react";
import { X, Shield } from "lucide-react";

const ContactSupportModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[var(--color-bg-surface)] rounded-3xl shadow-xl w-11/12 max-w-md animate-in fade-in-0 zoom-in-95 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] transition"
          aria-label="Close modal"
        >
          <X className="w-5 h-5 text-[var(--color-text-secondary)]" />
        </button>

        {/* Content */}
        <div className="p-8 text-center">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-[var(--color-brand-primary)] bg-opacity-10 flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-3">
            Contact Support to Reset PIN
          </h2>

          {/* Description */}
          <p className="text-sm text-[var(--color-text-secondary)] mb-8">
            For security reasons, you must contact support before you can reset
            your PIN.
          </p>

          {/* Action Button */}
          <h3 className="text-[var(--color-brand-primary)]">
            <span className="text-[var(--color-text-primary)]">Send and a mail to <br/> </span> sellexplore.shop@gmail.com
          </h3>
        </div>
      </div>
    </div>
  );
};

export default ContactSupportModal;
