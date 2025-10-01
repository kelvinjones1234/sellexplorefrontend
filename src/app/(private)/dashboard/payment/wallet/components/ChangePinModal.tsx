"use client";
import React, { useState } from "react";
import { X } from "lucide-react";
import { apiClient } from "../../api";

interface ChangePinModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChangePinModal: React.FC<ChangePinModalProps> = ({ isOpen, onClose }) => {
  const [oldPin, setOldPin] = useState(["", "", "", "", ""]);
  const [newPin, setNewPin] = useState(["", "", "", "", ""]);
  const [confirmNewPin, setConfirmNewPin] = useState(["", "", "", "", ""]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const handlePinChange = (
    index: number,
    value: string,
    setPin: React.Dispatch<React.SetStateAction<string[]>>,
    inputIdPrefix: string
  ) => {
    if (/^\d?$/.test(value)) {
      setPin((prev) => {
        const newPinArray = [...prev];
        newPinArray[index] = value;
        return newPinArray;
      });
      setError(null);

      if (value && index < 4) {
        document.getElementById(`${inputIdPrefix}-${index + 1}`)?.focus();
      }
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
    inputIdPrefix: string
  ) => {
    if (e.key === "Backspace" && index > 0 && !e.currentTarget.value) {
      document.getElementById(`${inputIdPrefix}-${index - 1}`)?.focus();
    }
  };

  const resetFields = () => {
    setOldPin(["", "", "", "", ""]);
    setNewPin(["", "", "", "", ""]);
    setConfirmNewPin(["", "", "", "", ""]);
    setError(null);
    setStep(1);
    setLoading(false);
  };

  const handleClose = () => {
    resetFields();
    onClose();
  };

  const handleNext = async () => {
    const currentPin =
      step === 1 ? oldPin : step === 2 ? newPin : confirmNewPin;
    if (currentPin.join("").length !== 5) {
      setError("Please enter a 5-digit PIN");
      return;
    }

    if (step === 1) {
      setLoading(true);
      try {
        await apiClient.validatePin(oldPin.join(""));
        setStep(2);
        setError(null);
      } catch (err: any) {
        if (err.message === "Wallet is disabled") {
          setError("Your wallet is disabled due to multiple incorrect PIN attempts. Please contact support.");
        } else {
          setError(err.message || "Failed to validate PIN");
        }
      } finally {
        setLoading(false);
      }
    } else if (step === 2) {
      setStep(3);
      setError(null);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newPinString = newPin.join("");
    const confirmNewPinString = confirmNewPin.join("");

    if (newPinString.length !== 5 || confirmNewPinString.length !== 5) {
      setError("Please enter a 5-digit PIN for all fields");
      return;
    }

    if (newPinString !== confirmNewPinString) {
      setError("New PINs do not match");
      return;
    }

    setLoading(true);
    try {
      await apiClient.changePin({
        old_pin: oldPin.join(""),
        new_pin: newPinString,
        confirm_new_pin: confirmNewPinString,
      });
      alert("PIN changed successfully!");
      resetFields();
      onClose();
    } catch (err: any) {
      if (err.message === "Wallet is disabled") {
        setError("Your wallet is disabled due to multiple incorrect PIN attempts. Please contact support.");
      } else {
        setError(err.message || "Failed to change PIN");
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
            <h2 className="text-md font-semibold text-[var(--color-text-primary)]">
              Change PIN
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
          <div>
            {step === 1 && (
              <div className="space-y-4">
                <p className="text-sm text-[var(--color-text-secondary)] text-center">
                  Enter your current 5-digit PIN
                </p>
                <div className="flex justify-center space-x-2">
                  {oldPin.map((digit, index) => (
                    <input
                      key={index}
                      id={`old-pin-input-${index}`}
                      type="password"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) =>
                        handlePinChange(
                          index,
                          e.target.value,
                          setOldPin,
                          "old-pin-input"
                        )
                      }
                      onKeyDown={(e) =>
                        handleKeyDown(e, index, "old-pin-input")
                      }
                      className="w-12 h-12 text-center text-[var(--color-text-primary)] border-2 border-[var(--color-border-default)] rounded-lg focus:border-[var(--color-brand-primary)] focus:outline-none transition"
                      disabled={loading}
                    />
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <p className="text-sm text-[var(--color-text-secondary)] text-center">
                  Enter your new 5-digit PIN
                </p>
                <div className="flex justify-center space-x-2">
                  {newPin.map((digit, index) => (
                    <input
                      key={index}
                      id={`new-pin-input-${index}`}
                      type="password"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) =>
                        handlePinChange(
                          index,
                          e.target.value,
                          setNewPin,
                          "new-pin-input"
                        )
                      }
                      onKeyDown={(e) =>
                        handleKeyDown(e, index, "new-pin-input")
                      }
                      className="w-12 h-12 text-center text-[var(--color-text-primary)] border-2 border-[var(--color-border-default)] rounded-lg focus:border-[var(--color-brand-primary)] focus:outline-none transition"
                      disabled={loading}
                    />
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <p className="text-sm text-[var(--color-text-secondary)] text-center">
                  Confirm your new 5-digit PIN
                </p>
                <div className="flex justify-center space-x-2">
                  {confirmNewPin.map((digit, index) => (
                    <input
                      key={index}
                      id={`confirm-pin-input-${index}`}
                      type="password"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) =>
                        handlePinChange(
                          index,
                          e.target.value,
                          setConfirmNewPin,
                          "confirm-pin-input"
                        )
                      }
                      onKeyDown={(e) =>
                        handleKeyDown(e, index, "confirm-pin-input")
                      }
                      className="w-12 h-12 text-center text-[var(--color-text-primary)] border-2 border-[var(--color-border-default)] rounded-lg focus:border-[var(--color-brand-primary)] focus:outline-none transition"
                      disabled={loading}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-center gap-4 mt-8 mb-6">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-primary)] text-[var(--color-text-secondary)] transition"
                  aria-label="Back"
                  disabled={loading}
                >
                  Back
                </button>
              )}
              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-hover)] text-[var(--color-on-brand)] transition disabled:opacity-50"
                  aria-label="Next"
                  disabled={loading}
                >
                  {loading ? "Validating..." : "Continue"}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-hover)] text-[var(--color-on-brand)] transition disabled:opacity-50"
                  aria-label="Change PIN"
                >
                  {loading ? "Saving..." : "Change PIN"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePinModal;