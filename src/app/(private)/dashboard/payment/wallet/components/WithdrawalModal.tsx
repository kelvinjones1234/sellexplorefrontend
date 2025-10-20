"use client";
import React, { useState } from "react";
import { X } from "lucide-react";
import { apiClient } from "../../api";
import FloatingLabelInput from "@/app/component/fields/Input";

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  balance: number;
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({
  isOpen,
  onClose,
  balance,
}) => {
  const [step, setStep] = useState<"amount" | "pin">("amount");
  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState(["", "", "", "", ""]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d{0,2}$/.test(value)) {
      setAmount(value);
      setError(null);
    }
  };

  const handlePinChange = (index: number, value: string) => {
    if (/^\d?$/.test(value)) {
      const newPin = [...pin];
      newPin[index] = value;
      setPin(newPin);
      setError(null);

      if (value && index < 4) {
        document.getElementById(`pin-input-${index + 1}`)?.focus();
      }
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && index > 0 && !pin[index]) {
      document.getElementById(`pin-input-${index - 1}`)?.focus();
    }
  };

  const resetFields = () => {
    setAmount("");
    setPin(["", "", "", "", ""]);
    setError(null);
    setStep("amount");
    setLoading(false);
  };

  const handleClose = () => {
    resetFields();
    onClose();
  };

  const handleNext = () => {
    const numAmount = Number(amount);
    if (!amount || numAmount <= 0) {
      setError("Please enter a valid amount");
      return;
    }
    if (numAmount > balance) {
      setError("Amount exceeds available balance");
      return;
    }
    setStep("pin");
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const pinString = pin.join("");
    if (pinString.length !== 5) {
      setError("Please enter a 5-digit PIN");
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.withdraw({
        amount: Number(amount),
        pin: pinString,
      });
      alert(
        `Withdrawal successful! Transaction ID: ${response.transaction_id}`
      );
      resetFields();
      onClose();
    } catch (err: any) {
      if (err.message === "Wallet is disabled") {
        setError(
          "Your wallet is disabled due to multiple incorrect PIN attempts. Please contact support."
        );
      } else {
        console.log("Error", err);

        setError(err.message || "Failed to process withdrawal");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 text-[var(--color-text-secondary)] flex items-center justify-center z-50">
      <div className="bg-[var(--color-bg-surface)] rounded-3xl shadow-xl w-11/12 max-w-md max-h-[80vh] flex flex-col animate-in fade-in-0 zoom-in-95">
        <div className="flex-shrink-0 justify-between items-center p-6 border-b border-[var(--color-border-strong)]">
          <div className="flex justify-between items-center">
            <h2 className="text-md text-[var(--color-text-primary)]">
              {step === "amount" ? "Withdraw Funds" : "Enter PIN"}
            </h2>
            <button
              onClick={handleClose}
              className="p-1 rounded-full hover:bg-[var(--color-bg-secondary)] border border-[var(--color-border-strong)] transition"
              aria-label="Close modal"
              disabled={loading}
            >
              <X className="w-5 h-5 text-[var(--color-text-secondary)]" />
            </button>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {step === "amount" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleNext();
              }}
            >
              <div className="space-y-4 w-[250px] mx-auto">
                <p className="text-sm text-center text-[var(--color-text-secondary)]">
                  Enter the amount to withdraw
                </p>
                <FloatingLabelInput
                  type="text"
                  name="amount"
                  value={amount}
                  onChange={handleAmountChange}
                  placeholder="Amount"
                />
              </div>
              <div className="flex justify-center gap-4 mt-6">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-hover)] text-[var(--color-on-brand)] transition disabled:opacity-50"
                  aria-label="Next"
                  disabled={loading}
                >
                  Next
                </button>
              </div>
            </form>
          )}

          {step === "pin" && (
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <p className="text-sm text-center text-[var(--color-text-secondary)]">
                  Enter your 5-digit withdrawal PIN
                </p>
                <div className="flex justify-center space-x-2">
                  {pin.map((digit, index) => (
                    <input
                      key={index}
                      id={`pin-input-${index}`}
                      type="password"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handlePinChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      className="w-12 h-12 text-center text-[var(--color-text-primary)] border-2 border-[var(--color-border-default)] rounded-lg focus:border-[var(--color-brand-primary)] focus:outline-none transition"
                      disabled={loading}
                    />
                  ))}
                </div>
              </div>
              <div className="flex justify-center gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setStep("amount")}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-primary)] text-[var(--color-text-secondary)] transition"
                  aria-label="Back"
                  disabled={loading}
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-hover)] text-[var(--color-on-brand)] transition disabled:opacity-50"
                  aria-label="Withdraw"
                >
                  {loading ? "Processing..." : "Withdraw"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default WithdrawModal;
