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
} from "lucide-react";
import FloatingLabelInput from "@/app/component/fields/Input";

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

  const handleSave = () => {
    // Handle save logic here
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Header */}
      <header className="sticky top-0 bg-[var(--color-bg)] border-b border-[var(--color-border)] px-4 py-3">
        <div className="flex items-center justify-between mx-auto">
          <div className="flex justify-start gap-2 text-sm text-[var(--color-text-secondary)]">
            <span className="font-medium text-[var(--color-heading)]">
              Store settings
            </span>
            <span>›</span>
            <span>Checkout Options</span>
          </div>
          <div className="flex justify-start gap-2">
            <span className="text-[var(--color-primary)]">⚡</span>
            <span className="text-sm font-medium text-[var(--color-text)]">
              Quick Actions
            </span>
            <ChevronDown className="w-4 h-4 text-[var(--color-text-muted)]" />
          </div>
        </div>
      </header>

      <div className="px-4 pb-8 pt-[4rem]">
        <div className="max-w-[900px] mx-auto">
          {/* Checkout Options */}
          <div className="flex flex-col items-center justify-between mb-6">
            <span className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <Check className="w-4 h-4 text-white" />
            </span>
            <div className="flex justify-start gap-2">
              <h3 className="font-semibold text-sm text-[var(--color-heading)]">
                Checkout Options
              </h3>
            </div>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Configure how customers checkout
            </p>
          </div>
          <div className="bg-[var(--color-bg)] rounded-xl shadow-sm border-[var(--color-border)] py-6 mb-8">
            {/* Require Emails */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex justify-start gap-2">
                <span className="w-6 h-6 bg-yellow-500 rounded-lg flex items-center justify-center">
                  <Mail className="w-4 h-4 text-white" />
                </span>
                <div>
                  <p className="font-semibold text-sm text-[var(--color-heading)]">
                    Require Emails
                  </p>
                  <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                    Collect emails from customers at checkout
                  </p>
                </div>
              </div>
              <button
                onClick={() => setRequireEmails(!requireEmails)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  requireEmails
                    ? "bg-[var(--color-primary)]"
                    : "bg-[var(--color-border)]"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-[var(--color-bg)] transition-transform ${
                    requireEmails ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Enable Delivery */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex justify-start gap-2">
                <span className="w-6 h-6 bg-green-500 rounded-lg flex items-center justify-center">
                  <Truck className="w-4 h-4 text-white" />
                </span>
                <div>
                  <p className="font-semibold text-sm text-[var(--color-heading)]">
                    Enable Delivery
                  </p>
                  <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                    Enable if your business makes deliveries
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEnableDelivery(!enableDelivery)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  enableDelivery
                    ? "bg-[var(--color-primary)]"
                    : "bg-[var(--color-border)]"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-[var(--color-bg)] transition-transform ${
                    enableDelivery ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Allow Pick Up */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex justify-start gap-2">
                <span className="w-6 h-6 bg-red-500 rounded-lg flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-white" />
                </span>
                <div>
                  <p className="font-semibold text-sm text-[var(--color-heading)]">
                    Allow Customer Pick Up
                  </p>
                  <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                    Allow customers pick up from your address
                  </p>
                </div>
              </div>
              <button
                onClick={() => setAllowPickUp(!allowPickUp)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  allowPickUp
                    ? "bg-[var(--color-primary)]"
                    : "bg-[var(--color-border)]"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-[var(--color-bg)] transition-transform ${
                    allowPickUp ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Payment Validates Order */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex justify-start gap-2">
                <span className="w-6 h-6 bg-pink-500 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-white" />
                </span>
                <div>
                  <p className="font-semibold text-sm text-[var(--color-heading)]">
                    Payment Validates Order
                  </p>
                  <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                    Orders not paid within specified time will be cancelled
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-start px-8 items-center gap-2 mb-4">
              <input
                type="number"
                value={paymentTimeout}
                onChange={(e) => setPaymentTimeout(Number(e.target.value))}
                className="w-ful bg-[var(--color-bg)] p-1 border border-[var(--color-border)] rounded-lg text-center"
                min="1"
              />
              <span className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                mins
              </span>
            </div>

            {/* WhatsApp Options */}
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <div className="flex justify-start gap-2">
                  <span className="w-6 h-6 bg-green-500 rounded-lg flex items-center justify-center">
                    <Phone className="w-4 h-4 text-white" />
                  </span>
                  <div>
                    <p className="font-semibold text-sm text-[var(--color-heading)]">
                      WhatsApp Options
                    </p>
                    <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                      Phone numbers customers can checkout to
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2 mt-4">
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
              </div>
            </div>

            {/* Instagram Checkout */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex justify-start gap-2">
                <span className="w-6 h-6 bg-red-500 rounded-lg flex items-center justify-center">
                  <Instagram className="w-4 h-4 text-white" />
                </span>
                <div>
                  <p className="font-semibold text-sm text-[var(--color-heading)]">
                    Allow customers send orders to Instagram
                  </p>
                </div>
              </div>
              <button
                onClick={() => setAllowInstagram(!allowInstagram)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  allowInstagram
                    ? "bg-[var(--color-primary)]"
                    : "bg-[var(--color-border)]"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-[var(--color-bg)] transition-transform ${
                    allowInstagram ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg font-medium hover:bg-[var(--color-primary-hover)] transition-colors"
            >
              Save Checkout Options
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
