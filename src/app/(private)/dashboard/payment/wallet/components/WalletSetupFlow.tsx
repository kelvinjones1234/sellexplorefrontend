// WalletSetupFlow.tsx
"use client";
import React, { useState } from "react";
import { X } from "lucide-react";
import FloatingLabelInput from "@/app/component/fields/Input";
import FloatingLabelSelect from "@/app/component/fields/Selection";
import { apiClient } from "../../api";
import { useRouter } from "next/navigation";

interface BankAccountSetupScreenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNext: (data: { accountNumber: string; bankCode: string }) => void;
  banks: { value: string; label: string }[];
  onCheckWalletStatus: () => Promise<boolean>;
}

const BankAccountSetupScreenModal: React.FC<
  BankAccountSetupScreenModalProps
> = ({ isOpen, onClose, onNext, banks, onCheckWalletStatus }) => {
  const [accountNumber, setAccountNumber] = useState("");
  const [bankCode, setBankCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();

    if (!accountNumber || accountNumber.length !== 10) {
      setError("Please enter a valid 10-digit account number.");
      return;
    }
    if (!bankCode) {
      setError("Please select a bank.");
      return;
    }

    setError(null);
    onNext({ accountNumber, bankCode });
  };

  const handleClose = async () => {
    const isActivated = await onCheckWalletStatus();
    if (!isActivated) {
      router.push("/dashboard");
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 text-[var(--color-text-secondary)] flex items-center justify-center z-50">
      <div className="bg-[var(--color-bg-surface)] rounded-3xl shadow-xl w-11/12 max-w-md max-h-[80vh] flex flex-col animate-in fade-in-0 zoom-in-95">
        <div className="flex-shrink-0 justify-between items-center p-6 border-b border-[var(--color-border-strong)]">
          <div className="flex justify-between items-center">
            <h2 className="text-md text-[var(--color-text-primary)]">
              Bank Account Setup
            </h2>
            <button
              onClick={handleClose}
              className="p-1 rounded-full hover:bg-[var(--color-bg-secondary)] border border-[var(--color-border-strong)] transition"
              aria-label="Close modal"
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
          <form onSubmit={handleNext}>
            <div className="space-y-4">
              <p className="text-sm text-[var(--color-text-secondary)]">
                Add your bank details to enable withdrawals.
              </p>
              <FloatingLabelInput
                type="text"
                name="accountNumber"
                value={accountNumber}
                onChange={(e) => {
                  setAccountNumber(e.target.value);
                  setError(null);
                }}
                placeholder="Account Number"
              />
              <FloatingLabelSelect
                name="bank"
                value={bankCode}
                onChange={(val) => {
                  setBankCode(val.toString());
                  setError(null);
                }}
                placeholder="Select Bank"
                options={banks}
              />
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-primary)] text-[var(--color-text-secondary)] transition"
                aria-label="Cancel"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg text-sm font-medium bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-hover)] text-[var(--color-on-brand)] transition"
                aria-label="Proceed to next step"
              >
                Next
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

interface PinSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNext: (pin: string) => void;
  onCheckWalletStatus: () => Promise<boolean>;
}

const PinSetupModal: React.FC<PinSetupModalProps> = ({
  isOpen,
  onClose,
  onNext,
  onCheckWalletStatus,
}) => {
  const [pin, setPin] = useState(["", "", "", "", ""]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pinString = pin.join("");
    if (pinString.length !== 5) {
      setError("Please enter a 5-digit PIN");
      return;
    }
    onNext(pinString);
  };

  const handleClose = async () => {
    const isActivated = await onCheckWalletStatus();
    if (!isActivated) {
      router.push("/dashboard");
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 text-[var(--color-text-secondary)] flex items-center justify-center z-50">
      <div className="bg-[var(--color-bg-surface)] rounded-3xl shadow-xl w-11/12 max-w-md max-h-[80vh] flex flex-col animate-in fade-in-0 zoom-in-95">
        <div className="flex-shrink-0 justify-between items-center p-6 border-b border-[var(--color-border-strong)]">
          <div className="flex justify-between items-center">
            <h2 className="text-md text-[var(--color-text-primary)]">
              Set PIN
            </h2>
            <button
              onClick={handleClose}
              className="p-1 rounded-full hover:bg-[var(--color-bg-secondary)] border border-[var(--color-border-strong)] transition"
              aria-label="Close modal"
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
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <p className="text-sm text-[var(--color-text-secondary)]">
                Enter your 5-digit withdrawal PIN
              </p>
              <div className="flex justify-center space-x-2">
                {pin.map((digit, index) => (
                  <input
                    key={index}
                    id={`pin-input-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handlePinChange(index, e.target.value)}
                    className="w-12 h-12 text-center text-[var(--color-text-primary)] border-2 border-[var(--color-border-default)] rounded-lg focus:border-[var(--color-brand-primary)] focus:outline-none transition"
                  />
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-primary)] text-[var(--color-text-secondary)] transition"
                aria-label="Cancel"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg text-sm font-medium bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-hover)] text-[var(--color-on-brand)] transition"
                aria-label="Proceed to next step"
              >
                Next
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

interface ConfirmPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (pin: string) => Promise<void>;
  initialPin: string;
  onCheckWalletStatus: () => Promise<boolean>;
}

const ConfirmPinModal: React.FC<ConfirmPinModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialPin,
  onCheckWalletStatus,
}) => {
  const [pin, setPin] = useState(["", "", "", "", ""]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handlePinChange = (index: number, value: string) => {
    if (/^\d?$/.test(value)) {
      const newPin = [...pin];
      newPin[index] = value;
      setPin(newPin);
      setError(null);

      if (value && index < 4) {
        document.getElementById(`confirm-pin-input-${index + 1}`)?.focus();
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const confirmPinString = pin.join("");
    if (confirmPinString.length !== 5) {
      setError("Please enter a 5-digit PIN");
      return;
    }
    if (confirmPinString !== initialPin) {
      setError("PINs do not match. Please try again.");
      return;
    }

    setLoading(true);
    try {
      await onSubmit(confirmPinString);
    } catch (err: any) {
      setError(err.message || "Failed to confirm PIN");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = async () => {
    const isActivated = await onCheckWalletStatus();
    if (!isActivated) {
      router.push("/dashboard");
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 text-[var(--color-text-secondary)] flex items-center justify-center z-50">
      <div className="bg-[var(--color-bg-surface)] rounded-3xl shadow-xl w-11/12 max-w-md max-h-[80vh] flex flex-col animate-in fade-in-0 zoom-in-95">
        <div className="flex-shrink-0 justify-between items-center p-6 border-b border-[var(--color-border-strong)]">
          <div className="flex justify-between items-center">
            <h2 className="text-md text-[var(--color-text-primary)]">
              Confirm PIN
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
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <p className="text-sm text-[var(--color-text-secondary)]">
                Re-enter your 5-digit withdrawal PIN
              </p>
              <div className="flex justify-center space-x-2">
                {pin.map((digit, index) => (
                  <input
                    key={index}
                    id={`confirm-pin-input-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handlePinChange(index, e.target.value)}
                    className="w-12 h-12 text-center text-[var(--color-text-primary)] border-2 border-[var(--color-border-default)] rounded-lg focus:border-[var(--color-brand-primary)] focus:outline-none transition"
                    disabled={loading}
                  />
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-primary)] text-[var(--color-text-secondary)] transition"
                aria-label="Cancel"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-hover)] text-[var(--color-on-brand)] transition disabled:opacity-50"
                aria-label="Confirm PIN"
              >
                {loading ? "Creating wallet..." : "Confirm PIN"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 text-[var(--color-text-secondary)] flex items-center justify-center z-50">
      <div className="bg-[var(--color-bg-surface)] rounded-3xl shadow-xl w-11/12 max-w-md max-h-[80vh] flex flex-col animate-in fade-in-0 zoom-in-95">
        <div className="flex-shrink-0 justify-between items-center p-6 border-b border-[var(--color-border-strong)]">
          <div className="flex justify-between items-center">
            <h2 className="text-md text-[var(--color-text-primary)]">Success</h2>
            {/* <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-[var(--color-bg-secondary)] border border-[var(--color-border-strong)] transition"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-[var(--color-text-secondary)]" />
            </button> */}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <p className="text-sm text-center text-[var(--color-text-secondary)]">{message}</p>
          <div className="flex justify-center mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-hover)] text-[var(--color-on-brand)] transition"
              aria-label="Close"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

const ErrorModal: React.FC<ErrorModalProps> = ({ isOpen, onClose, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 text-[var(--color-text-secondary)] flex items-center justify-center z-50">
      <div className="bg-[var(--color-bg-surface)] rounded-3xl shadow-xl w-11/12 max-w-md max-h-[80vh] flex flex-col animate-in fade-in-0 zoom-in-95">
        <div className="flex-shrink-0 justify-between items-center p-6 border-b border-[var(--color-border-strong)]">
          <div className="flex justify-between items-center">
            <h2 className="text-md text-[var(--color-text-primary)]">Error</h2>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-[var(--color-bg-secondary)] border border-[var(--color-border-strong)] transition"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-[var(--color-text-secondary)]" />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
            {message}
          </div>
          <div className="flex justify-end mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-hover)] text-[var(--color-on-brand)] transition"
              aria-label="Close"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface WalletSetupFlowProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  banks: { value: string; label: string }[];
}

const WalletSetupFlow: React.FC<WalletSetupFlowProps> = ({
  isOpen,
  onClose,
  onSuccess,
  banks,
}) => {
  const [step, setStep] = useState<"bank" | "pin" | "confirm" | "success" | "error">("bank");
  const [bankData, setBankData] = useState<{
    accountNumber: string;
    bankCode: string;
  } | null>(null);
  const [pin, setPin] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const checkWalletStatus = async () => {
    try {
      const status = await apiClient.getWalletStatus();
      return status.activated;
    } catch (err) {
      console.error("Failed to check wallet status:", err);
      return false;
    }
  };

  const handleBankNext = (data: {
    accountNumber: string;
    bankCode: string;
  }) => {
    setBankData(data);
    setStep("pin");
  };

  const handlePinNext = (pinString: string) => {
    setPin(pinString);
    setStep("confirm");
  };

  const handleConfirmSubmit = async (confirmedPin: string) => {
    if (!bankData || !confirmedPin) return;

    try {
      const response = await apiClient.setupWallet({
        bank_name: bankData.bankCode,
        account_number: bankData.accountNumber,
        pin: confirmedPin,
        confirm_pin: confirmedPin,
      });
      setSuccessMessage(response.message);
      setStep("success");
    } catch (err: any) {
      setErrorMessage(err.message || "Wallet setup failed");
      setStep("error");
    }
  };

  const handleClose = async () => {
    const isActivated = await checkWalletStatus();
    if (!isActivated) {
      router.push("/dashboard");
    }
    onClose();
  };

  const handleSuccessClose = () => {
    onSuccess();
    onClose();
  };

  const handleErrorClose = () => {
    setStep("bank");
    setBankData(null);
    setPin(null);
    setErrorMessage("");
  };

  return (
    <>
      <BankAccountSetupScreenModal
        isOpen={isOpen && step === "bank"}
        onClose={handleClose}
        onNext={handleBankNext}
        banks={banks}
        onCheckWalletStatus={checkWalletStatus}
      />
      <PinSetupModal
        isOpen={isOpen && step === "pin"}
        onClose={handleClose}
        onNext={handlePinNext}
        onCheckWalletStatus={checkWalletStatus}
      />
      <ConfirmPinModal
        isOpen={isOpen && step === "confirm"}
        onClose={handleClose}
        onSubmit={handleConfirmSubmit}
        initialPin={pin || ""}
        onCheckWalletStatus={checkWalletStatus}
      />
      <SuccessModal
        isOpen={isOpen && step === "success"}
        onClose={handleSuccessClose}
        message={successMessage}
      />
      <ErrorModal
        isOpen={isOpen && step === "error"}
        onClose={handleErrorClose}
        message={errorMessage}
      />
    </>
  );
};

export default WalletSetupFlow;