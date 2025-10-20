"use client";

import React, { useState } from "react";
import {
  Check,
  MapPin,
  Clock,
  Instagram,
  Truck,
  Mail,
  ChevronDown,
  Phone,
  Settings,
  Loader2,
} from "lucide-react";
import FloatingLabelInput from "@/app/component/fields/Input";
import Link from "next/link";
import { toast } from "react-toastify";

const Main: React.FC = () => {
  const [requireEmails, setRequireEmails] = useState(false);
  const [enableDelivery, setEnableDelivery] = useState(false);
  const [allowPickUp, setAllowPickUp] = useState(false);
  const [paymentTimeout, setPaymentTimeout] = useState(15);
  const [whatsappOptions, setWhatsappOptions] = useState({
    main: "0814772672",
    option: "und#id#ed",
  });
  const [allowInstagram, setAllowInstagram] = useState(false);
  const [updating, setUpdating] = useState<boolean>(false);

  const handleUpdate = async () => {
    try {
      setUpdating(true);
      // Handle update logic here
      toast.success("Checkout options updated successfully!");
    } catch (err: any) {
      const errorMessage = err.message || "Failed to update checkout options";
      toast.error(errorMessage);
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = () => {
    // Refresh the page or reset to original values
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-secondary)]">
      {/* Header */}
      <header className="sticky top-0 bg-[var(--color-bg-primary)] border-b border-[var(--color-border-default)] px-4 py-3 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
            <Link href="http://localhost:3000/dashboard/my-store/">
              <span className="font-medium text-[var(--color-text-primary)] hover:text-[var(--color-brand-primary)] transition-colors">
                Store settings
              </span>
            </Link>
            <span>›</span>
            <span>Checkout Options</span>
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
        <div className="bg-[var(--color-bg)] mb-8">
          <div className="py-6 md:py-8 px-4 max-w-[900px] mx-auto">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-[var(--card-bg-1)] rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-[var(--card-text-1)]" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--color-heading)] mb-2">
                Checkout Options
              </h3>
              <p className="text-[var(--color-text-secondary)]">
                Configure how customers checkout
              </p>
            </div>
            <div className="space-y-6">
              {/* Require Emails */}
              <div className="flex items-start justify-between">
                <div className="flex justify-start gap-2">
                  <span className="w-6 h-6 bg-[var(--color-brand-primary)] rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Mail className="w-4 h-4 text-[var(--color-on-brand)]" />
                  </span>
                  <div>
                    <p className="font-medium text-sm text-[var(--color-text-primary)]">
                      Require Emails
                    </p>
                    <p className="text-xs text-[var(--color-brand-primary)] leading-relaxed">
                      Collect emails from customers at checkout
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setRequireEmails(!requireEmails)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    requireEmails
                      ? "bg-[var(--color-brand-primary)]"
                      : "bg-[var(--color-border-default)]"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-[var(--color-on-brand)] transition-transform ${
                      requireEmails ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Enable Delivery */}
              <div className="flex items-start justify-between">
                <div className="flex justify-start gap-2">
                  <span className="w-6 h-6 bg-[var(--color-brand-primary)] rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Truck className="w-4 h-4 text-[var(--color-on-brand)]" />
                  </span>
                  <div>
                    <p className="font-medium text-sm text-[var(--color-text-primary)]">
                      Enable Delivery
                    </p>
                    <p className="text-xs text-[var(--color-brand-primary)] leading-relaxed">
                      Enable if your business makes deliveries
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setEnableDelivery(!enableDelivery)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    enableDelivery
                      ? "bg-[var(--color-brand-primary)]"
                      : "bg-[var(--color-border-default)]"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-[var(--color-on-brand)] transition-transform ${
                      enableDelivery ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Allow Pick Up */}
              <div className="flex items-start justify-between">
                <div className="flex justify-start gap-2">
                  <span className="w-6 h-6 bg-[var(--color-brand-primary)] rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4 text-[var(--color-on-brand)]" />
                  </span>
                  <div>
                    <p className="font-medium text-sm text-[var(--color-text-primary)]">
                      Allow Customer Pick Up
                    </p>
                    <p className="text-xs text-[var(--color-brand-primary)] leading-relaxed">
                      Allow customers pick up from your address
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setAllowPickUp(!allowPickUp)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    allowPickUp
                      ? "bg-[var(--color-brand-primary)]"
                      : "bg-[var(--color-border-default)]"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-[var(--color-on-brand)] transition-transform ${
                      allowPickUp ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Payment Validates Order */}
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex justify-start gap-2">
                    <span className="w-6 h-6 bg-[var(--color-brand-primary)] rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Clock className="w-4 h-4 text-[var(--color-on-brand)]" />
                    </span>
                    <div>
                      <p className="font-medium text-sm text-[var(--color-text-primary)]">
                        Payment Validates Order
                      </p>
                      <p className="text-xs text-[var(--color-brand-primary)] leading-relaxed">
                        Orders not paid within specified time will be cancelled
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 pl-8">
                  <input
                    type="number"
                    value={paymentTimeout}
                    onChange={(e) => setPaymentTimeout(Number(e.target.value))}
                    className="flex-1 px-3 py-2 border border-[var(--color-border-default)] rounded-xl text-[var(--color-text-primary)] text-center"
                    min="1"
                  />
                  <span className="text-xs text-[var(--color-brand-primary)] leading-relaxed whitespace-nowrap">
                    mins
                  </span>
                </div>
              </div>

              {/* WhatsApp Options */}
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex justify-start gap-2">
                    <span className="w-6 h-6 bg-[var(--color-brand-primary)] rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Phone className="w-4 h-4 text-[var(--color-on-brand)]" />
                    </span>
                    <div>
                      <p className="font-medium text-sm text-[var(--color-text-primary)]">
                        WhatsApp Options
                      </p>
                      <p className="text-xs text-[var(--color-brand-primary)] leading-relaxed">
                        Phone numbers customers can checkout to
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 pl-8">
                  <FloatingLabelInput
                    type="tel"
                    name="mainWhatsapp"
                    value={whatsappOptions.main}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setWhatsappOptions({
                        ...whatsappOptions,
                        main: e.target.value,
                      })
                    }
                    placeholder="Main WhatsApp Number"
                  />
                  <FloatingLabelInput
                    type="text"
                    name="optionWhatsapp"
                    value={whatsappOptions.option}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setWhatsappOptions({
                        ...whatsappOptions,
                        option: e.target.value,
                      })
                    }
                    placeholder="Option WhatsApp Number"
                  />
                </div>
              </div>

              {/* Instagram Checkout */}
              <div className="flex items-start justify-between">
                <div className="flex justify-start gap-2">
                  <span className="w-6 h-6 bg-[var(--color-brand-primary)] rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Instagram className="w-4 h-4 text-[var(--color-on-brand)]" />
                  </span>
                  <div>
                    <p className="font-medium text-sm text-[var(--color-text-primary)]">
                      Allow customers send orders to Instagram
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setAllowInstagram(!allowInstagram)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    allowInstagram
                      ? "bg-[var(--color-brand-primary)]"
                      : "bg-[var(--color-border-default)]"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-[var(--color-on-brand)] transition-transform ${
                      allowInstagram ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex max-w-[900px] mx-auto text-sm gap-3 justify-end px-4">
          <button
            className="px-6 py-3 bg-[var(--color-brand-primary)] text-[var(--color-on-brand)] justify-center rounded-xl font-medium hover:bg-[var(--color-brand-hover)] transition-colors disabled:opacity-50 flex items-center gap-2"
            onClick={handleUpdate}
            disabled={updating}
          >
            {updating && <Loader2 className="w-4 h-4 animate-spin" />}
            {updating ? "Updating..." : "Save Checkout Options"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Main;
