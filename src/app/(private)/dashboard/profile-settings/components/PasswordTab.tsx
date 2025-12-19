import React, { useState } from "react";

// --- Interfaces ---
interface PasswordUpdate {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// FloatingLabelInput component
interface FloatingLabelInputProps {
  type: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  disabled?: boolean;
  margin?: string;
  error?: string;
}

const FloatingLabelInput: React.FC<FloatingLabelInputProps> = ({
  type,
  name,
  value,
  onChange,
  placeholder,
  disabled = false,
  margin,
  error,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <div className={`relative ${margin || "mb-6"}`}>
      <div
        className={`relative border rounded-xl transition-all ${
          error
            ? "border-red-500"
            : isFocused
            ? "border-[var(--color-brand-primary)]"
            : "border-[var(--color-border-default)]"
        }`}
      >
        <input
          type={type}
          name={name}
          id={name}
          value={value || ""}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          className={`block w-full h-[3rem] pt-5 px-4 pb-2 bg-transparent rounded-xl outline-none text-[var(--color-text-secondary)] ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
        />
        <label
          htmlFor={name}
          className={`absolute left-4 text-[var(--color-text-secondary)] transition-all duration-300 transform ${
            isFocused || value
              ? "top-2 text-xs scale-75 -translate-y-0.5"
              : "top-1/2 text-sm -translate-y-1/2"
          } origin-[0] pointer-events-none`}
        >
          {placeholder}
        </label>
      </div>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};

// Icon components
const Lock = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
    />
  </svg>
);

const Eye = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />
  </svg>
);

const EyeOff = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
    />
  </svg>
);

interface PasswordTabProps {
  passwordData: PasswordUpdate;
  setPasswordData: React.Dispatch<React.SetStateAction<PasswordUpdate>>;
  errors: { [key: string]: string };
  isSubmitting: boolean;
}

const PasswordTab: React.FC<PasswordTabProps> = ({
  passwordData,
  setPasswordData,
  errors,
  isSubmitting,
}) => {
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  return (
    <div className="space-y-6 text-[var(--color-text-secondary)]">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-[var(--card-bg-2)] rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8 text-[var(--card-text-2)]" />
        </div>
        <h3 className="text-lg font-semibold text-[var(--color-heading)] mb-2">
          Update Password
        </h3>
        <p className="text-sm text-[var(--color-text-secondary)]">
          Change your account password for better security
        </p>
      </div>

      <div className="max-w-md mx-auto space-y-6">
        <div className="relative">
          <FloatingLabelInput
            type={showPasswords.old ? "text" : "password"}
            name="oldPassword"
            value={passwordData.oldPassword}
            onChange={(e) =>
              setPasswordData((prev) => ({
                ...prev,
                oldPassword: e.target.value,
              }))
            }
            placeholder="Current Password"
            error={errors.oldPassword}
            disabled={isSubmitting}
          />
          <button
            type="button"
            onClick={() =>
              setShowPasswords((prev) => ({ ...prev, old: !prev.old }))
            }
            className="absolute right-3 top-4 text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors"
            disabled={isSubmitting}
          >
            {showPasswords.old ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>

        <div className="relative">
          <FloatingLabelInput
            type={showPasswords.new ? "text" : "password"}
            name="newPassword"
            value={passwordData.newPassword}
            onChange={(e) =>
              setPasswordData((prev) => ({
                ...prev,
                newPassword: e.target.value,
              }))
            }
            placeholder="New Password"
            error={errors.newPassword}
            disabled={isSubmitting}
          />
          <button
            type="button"
            onClick={() =>
              setShowPasswords((prev) => ({ ...prev, new: !prev.new }))
            }
            className="absolute right-3 top-4 text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors"
            disabled={isSubmitting}
          >
            {showPasswords.new ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>

        <div className="relative">
          <FloatingLabelInput
            type={showPasswords.confirm ? "text" : "password"}
            name="confirmPassword"
            value={passwordData.confirmPassword}
            onChange={(e) =>
              setPasswordData((prev) => ({
                ...prev,
                confirmPassword: e.target.value,
              }))
            }
            placeholder="Confirm New Password"
            error={errors.confirmPassword}
            disabled={isSubmitting}
          />
          <button
            type="button"
            onClick={() =>
              setShowPasswords((prev) => ({ ...prev, confirm: !prev.confirm }))
            }
            className="absolute right-3 top-4 text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors"
            disabled={isSubmitting}
          >
            {showPasswords.confirm ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordTab;