"use client";

import React, { useState, useRef } from "react";

// --- Interfaces ---
interface BasicDetails {
  fullName: string;
  email: string;
  phoneNumber: string;
  profilePic: string | null;
}

interface PasswordUpdate {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface Tab {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

// --- Data ---
// Icon components
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

const Settings = ({ className }: { className?: string }) => (
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
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const Camera = ({ className }: { className?: string }) => (
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
      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
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

const ChevronDown = ({ className }: { className?: string }) => (
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
      d="M19 9l-7 7-7-7"
    />
  </svg>
);

const AlertTriangle = ({ className }: { className?: string }) => (
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
      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
    />
  </svg>
);

const Trash2 = ({ className }: { className?: string }) => (
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
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
);

const UserX = ({ className }: { className?: string }) => (
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
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M18 8l-4 4m0-4l4 4"
    />
  </svg>
);

const tabs: Tab[] = [
  { id: "basic", label: "Basic Details", icon: User },
  { id: "password", label: "Update Password", icon: Lock },
  { id: "preferences", label: "Manage Preferences", icon: Settings },
];

// Your existing FloatingLabelInput component
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
    <div className={`relative mb- ${margin || ""}`}>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      <div
        className={`relative border rounded-2xl ${
          error
            ? "border-red-500"
            : isFocused
            ? "border-[var(--color-primary)]"
            : "border-[var(--color-border)]"
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
          className={`block w-full h-[3.2rem] pt-6 px-4 pb-2 bg-transparent rounded-2xl outline-none transition-all ${
            disabled ? "opacity-70" : ""
          }`}
        />
        <label
          htmlFor={name}
          className={`absolute duration-300 transform ${
            isFocused || value
              ? "text-xs top-3 scale-75 -translate-y-1 z-10"
              : "text-[.9rem] top-1/2 -translate-y-1/2"
          } left-4 origin-[0] pointer-events-none`}
        >
          {placeholder}
        </label>
      </div>
    </div>
  );
};

// --- Component Definitions ---
interface BasicDetailsTabProps {
  basicDetails: BasicDetails;
  setBasicDetails: React.Dispatch<React.SetStateAction<BasicDetails>>;
}

const BasicDetailsTab: React.FC<BasicDetailsTabProps> = ({
  basicDetails,
  setBasicDetails,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setBasicDetails((prev) => ({
            ...prev,
            profilePic: e.target?.result as string,
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-[var(--card-bg-1)] rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-[var(--card-text-1)]" />
        </div>
        <h3 className="text-lg font-semibold text-[var(--color-heading)] mb-2">
          Basic Details
        </h3>
        <p className="text-[var(--color-text-secondary)]">
          Manage your personal information and profile picture
        </p>
      </div>

      {/* Profile Picture */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative mb-4">
          <div className="w-24 h-24 rounded-full bg-[var(--color-bg-secondary)] border-4 border-[var(--color-border)] overflow-hidden">
            {basicDetails.profilePic ? (
              <img
                src={basicDetails.profilePic}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className="w-8 h-8 text-[var(--color-text-muted)]" />
              </div>
            )}
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute -bottom-1 -right-1 w-8 h-8 bg-[var(--color-primary)] text-white rounded-full flex items-center justify-center hover:bg-[var(--color-primary-hover)] transition-colors"
          >
            <Camera className="w-4 h-4" />
          </button>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="text-sm text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] font-medium"
        >
          Change Profile Picture
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>

      {/* Form Fields */}
      <div className="grid gap-6">
        <FloatingLabelInput
          type="text"
          name="fullName"
          value={basicDetails.fullName}
          onChange={(e) =>
            setBasicDetails((prev) => ({ ...prev, fullName: e.target.value }))
          }
          placeholder="Full Name"
        />
        <FloatingLabelInput
          type="email"
          name="email"
          value={basicDetails.email}
          onChange={(e) =>
            setBasicDetails((prev) => ({ ...prev, email: e.target.value }))
          }
          placeholder="Email Address"
        />
        <div className="">
          <FloatingLabelInput
            type="tel"
            name="phoneNumber"
            value={basicDetails.phoneNumber}
            onChange={(e) =>
              setBasicDetails((prev) => ({
                ...prev,
                phoneNumber: e.target.value,
              }))
            }
            placeholder="Phone Number"
          />
        </div>
      </div>
    </div>
  );
};

interface PasswordTabProps {
  passwordData: PasswordUpdate;
  setPasswordData: React.Dispatch<React.SetStateAction<PasswordUpdate>>;
}

const PasswordTab: React.FC<PasswordTabProps> = ({
  passwordData,
  setPasswordData,
}) => {
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-[var(--card-bg-2)] rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8 text-[var(--card-text-2)]" />
        </div>
        <h3 className="text-lg font-semibold text-[var(--color-heading)] mb-2">
          Update Password
        </h3>
        <p className="text-[var(--color-text-secondary)]">
          Change your account password for better security
        </p>
      </div>

      <div className="max-w-m mx-auto space-y-6">
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
          />
          <button
            type="button"
            onClick={() =>
              setShowPasswords((prev) => ({ ...prev, old: !prev.old }))
            }
            className="absolute right-3 top-4 text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
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
          />
          <button
            type="button"
            onClick={() =>
              setShowPasswords((prev) => ({ ...prev, new: !prev.new }))
            }
            className="absolute right-3 top-4 text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
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
          />
          <button
            type="button"
            onClick={() =>
              setShowPasswords((prev) => ({ ...prev, confirm: !prev.confirm }))
            }
            className="absolute right-3 top-4 text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
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

const PreferencesTab: React.FC = () => {
  const [showDisableConfirm, setShowDisableConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-[var(--card-bg-3)] rounded-full flex items-center justify-center mx-auto mb-4">
          <Settings className="w-8 h-8 text-[var(--card-text-3)]" />
        </div>
        <h3 className="text-lg font-semibold text-[var(--color-heading)] mb-2">
          Manage Preferences
        </h3>
        <p className="text-[var(--color-text-secondary)]">
          Control your account status and data management
        </p>
      </div>

      <div className="max-w-[900px] mx-auto space-y-6">
        {/* Disable Account */}
        <div className="bg-[var(--color-bg)] border border-[var(--color-border-secondary)] rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <UserX className="w-5 h-5 text-orange-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-[var(--color-heading)] mb-2">
                Disable Account
              </h4>
              <p className="text-sm text-[var(--color-text-secondary)] mb-4">
                Temporarily disable your account. You can reactivate it anytime
                by logging in.
              </p>
              {!showDisableConfirm ? (
                <button
                  onClick={() => setShowDisableConfirm(true)}
                  className="px-4 py-2 bg-orange-50 text-orange-600 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors text-sm font-medium"
                >
                  Disable Account
                </button>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-orange-600 text-sm">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Are you sure you want to disable your account?</span>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        // Handle disable account
                        setShowDisableConfirm(false);
                      }}
                      className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium"
                    >
                      Yes, Disable
                    </button>
                    <button
                      onClick={() => setShowDisableConfirm(false)}
                      className="px-4 py-2 bg-[var(--color-bg-secondary)] text-[var(--color-text)] border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-surface)] transition-colors text-sm font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Delete Account */}
        <div className="bg-[var(--color-bg)] border border-[var(--color-border-secondary)] rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-red-100 rounded-lg">
              <Trash2 className="w-5 h-5 text-red-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-[var(--color-heading)] mb-2">
                Delete Account
              </h4>
              <p className="text-sm text-[var(--color-text-secondary)] mb-4">
                Permanently delete your account and all associated data. This
                action cannot be undone.
              </p>
              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                >
                  Delete Account
                </button>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertTriangle className="w-4 h-4" />
                    <span>
                      This will permanently delete your account and all data!
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        // Handle delete account
                        setShowDeleteConfirm(false);
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                    >
                      Yes, Delete Forever
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="px-4 py-2 bg-[var(--color-bg-secondary)] text-[var(--color-text)] border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-surface)] transition-colors text-sm font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---
const ProfileManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("basic");

  const [basicDetails, setBasicDetails] = useState<BasicDetails>({
    fullName: "Praise Godwin",
    email: "sellexplore.ng@gmail.com",
    phoneNumber: "+234 8141772672",
    profilePic: null,
  });

  const [passwordData, setPasswordData] = useState<PasswordUpdate>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Header */}
      <header className="sticky top-0 bg-[var(--color-bg)] border-b border-[var(--color-border-secondary)] px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="font-semibold">My Profile</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[var(--color-primary)]">⚡</span>
            <span className="text-sm font-medium text-[var(--color-text)]">
              Quick Actions
            </span>
            <ChevronDown className="w-4 h-4 text-[var(--color-text-muted)]" />
          </div>
        </div>
      </header>

      <div className="px-4 pb-8">
        {/* Tab Navigation */}
        <div className="bg-[var(--color-bg)] rounded-xl shadow-sm border-[var(--color-border)] mb-8">
          <div className="border-b border-[var(--color-border-secondary)] rounded-t-xl overflow-hidden">
            <nav className="flex overflow-x-auto no-scrollbar gap-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-all
                    ${
                      activeTab === tab.id
                        ? "border-[var(--color-primary)] text-[var(--color-primary)]"
                        : "border-transparent hover:bg-[var(--color-bg-secondary)]"
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="py-6 md:py-8 max-w-[900px] mx-auto">
            {activeTab === "basic" && (
              <BasicDetailsTab
                basicDetails={basicDetails}
                setBasicDetails={setBasicDetails}
              />
            )}
            {activeTab === "password" && (
              <PasswordTab
                passwordData={passwordData}
                setPasswordData={setPasswordData}
              />
            )}
            {activeTab === "preferences" && <PreferencesTab />}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex max-w-[900px] mx-auto flex-col text-sm sm:flex-row gap-3 justify-end">
          <button className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg font-medium hover:bg-[var(--color-primary-hover)] transition-colors">
            {activeTab === "basic"
              ? "Update basic details"
              : activeTab === "password"
              ? "Update Password"
              : "Save Preferences"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileManagement;
