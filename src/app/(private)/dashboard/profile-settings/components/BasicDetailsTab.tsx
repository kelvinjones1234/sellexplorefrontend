

import React from "react";

// --- Interfaces ---
interface BasicDetails {
  name: string;
  email: string;
  phone: string;
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
  const [isFocused, setIsFocused] = React.useState(false);
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

// Icon component
const User = ({ className }: { className?: string }) => (
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
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

interface BasicDetailsTabProps {
  basicDetails: BasicDetails;
  setBasicDetails: React.Dispatch<React.SetStateAction<BasicDetails>>;
  errors: { [key: string]: string };
  isSubmitting: boolean;
}

const BasicDetailsTab: React.FC<BasicDetailsTabProps> = ({
  basicDetails,
  setBasicDetails,
  errors,
  isSubmitting,
}) => {
  return (
    <div className="space-y-8 text-[var(--color-text-secondary)]">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-[var(--card-bg-1)] rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-[var(--card-text-1)]" />
        </div>
        <h3 className="text-lg font-semibold text-[var(--color-heading)] mb-2">
          Basic Details
        </h3>
        <p className="text-sm text-[var(--color-text-secondary)]">
          Manage your personal information
        </p>
      </div>

      <div className="grid">
        <FloatingLabelInput
          type="text"
          name="name"
          value={basicDetails.name}
          onChange={(e) =>
            setBasicDetails((prev) => ({ ...prev, name: e.target.value }))
          }
          placeholder="Full Name"
          error={errors.name}
          disabled={isSubmitting}
        />
        <FloatingLabelInput
          type="email"
          name="email"
          value={basicDetails.email}
          onChange={(e) =>
            setBasicDetails((prev) => ({ ...prev, email: e.target.value }))
          }
          placeholder="Email Address"
          error={errors.email}
          disabled={isSubmitting}
        />
        <FloatingLabelInput
          type="tel"
          name="phone"
          value={basicDetails.phone}
          onChange={(e) =>
            setBasicDetails((prev) => ({ ...prev, phone: e.target.value }))
          }
          placeholder="Phone Number"
          error={errors.phone}
          disabled={isSubmitting}
        />
      </div>
    </div>
  );
};

export default BasicDetailsTab;