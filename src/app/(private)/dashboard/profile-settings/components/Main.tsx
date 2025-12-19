

"use client";

import React, { useState, useEffect } from "react";
import { apiClient } from "../api";
import BasicDetailsTab from "./BasicDetailsTab";
import PasswordTab from "./PasswordTab";
import PreferencesTab from "./PreferencesTab";

// --- Interfaces ---
interface BasicDetails {
  name: string;
  email: string;
  phone: string;
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
// Icon components (unchanged)
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

const tabs: Tab[] = [
  { id: "basic", label: "Basic Details", icon: User },
  { id: "password", label: "Update Password", icon: Lock },
  { id: "preferences", label: "Manage Preferences", icon: Settings },
];

// --- Main Component ---
const Main: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("basic");
  const [basicDetails, setBasicDetails] = useState<BasicDetails>({
    name: "",
    email: "",
    phone: "",
  });
  const [passwordData, setPasswordData] = useState<PasswordUpdate>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isBasicSubmitting, setIsBasicSubmitting] = useState(false);
  const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false);

  // Fetch user profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const profile = await apiClient.getUserProfile();
        setBasicDetails({
          name: profile.full_name || "",
          email: profile.email || "",
          phone: profile.phone || "",
        });
      } catch (error: any) {
        setErrors({ general: error.message || "Failed to fetch profile data" });
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Handle update basic details
  const handleUpdateBasicDetails = async () => {
    try {
      setIsBasicSubmitting(true);
      setErrors({});
      const payload = {
        full_name: basicDetails.name,
        email: basicDetails.email,
        phone: basicDetails.phone,
      };
      const updatedProfile = await apiClient.updateUserProfile(payload);
      setBasicDetails({
        name: updatedProfile.full_name || "",
        email: updatedProfile.email || "",
        phone: updatedProfile.phone || "",
      });
    } catch (error: any) {
      setErrors({ general: error.message || "Failed to update profile" });
    } finally {
      setIsBasicSubmitting(false);
    }
  };

  // Handle update password
  const handleUpdatePassword = async () => {
    try {
      setIsPasswordSubmitting(true);
      setErrors({});
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setErrors({ confirmPassword: "Passwords do not match" });
        return;
      }
      await apiClient.updatePassword({
        old_password: passwordData.oldPassword,
        new_password: passwordData.newPassword,
        confirm_password: passwordData.confirmPassword,
      });
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      setErrors({ general: error.message || "Failed to update password" });
    } finally {
      setIsPasswordSubmitting(false);
    }
  };

  // Handle disable account
  const handleDisableAccount = async () => {
    try {
      setErrors({});
      await apiClient.disableAccount();
      apiClient.clearTokens();
      window.location.href = "/login";
    } catch (error: any) {
      setErrors({ general: error.message || "Failed to disable account" });
    }
  };

  // Handle delete account
  const handleDeleteAccount = async () => {
    try {
      setErrors({});
      await apiClient.deleteAccount();
      apiClient.clearTokens();
      window.location.href = "/login";
    } catch (error: any) {
      setErrors({ general: error.message || "Failed to delete account" });
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-secondary)]">
      <header className="sticky top-0 bg-[var(--color-bg-primary)] border-b border-[var(--color-border-default)] px-4 py-3 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
            <span className="font-medium text-[var(--color-text-primary)]">
              Profile Settings
            </span>
            <span>›</span>
            <span>Manage Profile</span>
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

      {isLoading ? (
        <div className="flex justify-center items-center h-[50vh]">
          <p>Loading...</p>
        </div>
      ) : (
        <div className="pb-8">
          <div className="bg-[var(--color-bg)] mb-8">
            <div className="px-4 border-b border-[var(--color-border-default)] rounded-t-xl overflow-hidden">
              <nav className="flex overflow-x-auto no-scrollbar gap-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-all ${
                      activeTab === tab.id
                        ? "border-[var(--color-brand-primary)] text-[var(--color-brand-primary)]"
                        : "border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="py-6 md:py-8 px-4 max-w-[500px] mx-auto">
              {errors.general && (
                <p className="text-red-500 text-sm mb-4">{errors.general}</p>
              )}
              {activeTab === "basic" && (
                <BasicDetailsTab
                  basicDetails={basicDetails}
                  setBasicDetails={setBasicDetails}
                  errors={errors}
                  isSubmitting={isBasicSubmitting}
                />
              )}
              {activeTab === "password" && (
                <PasswordTab
                  passwordData={passwordData}
                  setPasswordData={setPasswordData}
                  errors={errors}
                  isSubmitting={isPasswordSubmitting}
                />
              )}
              {activeTab === "preferences" && (
                <PreferencesTab
                  onDisable={handleDisableAccount}
                  onDelete={handleDeleteAccount}
                />
              )}
            </div>
          </div>

          <div className="flex max-w-[500px] mx-auto text-sm gap-3 justify-end px-4">
            <button
              className="px-6 py-3 text-[var(--color-text-secondary)] rounded-xl font-medium hover:bg-[var(--color-bg-surface)] bg-[var(--color-bg-secondary)] transition-colors"
              onClick={() => window.location.reload()}
            >
              Cancel
            </button>
            <button
              className="px-6 py-3 bg-[var(--color-brand-primary)] text-[var(--color-on-brand)] rounded-xl font-medium hover:bg-[var(--color-brand-hover)] transition-colors"
              onClick={
                activeTab === "basic"
                  ? handleUpdateBasicDetails
                  : activeTab === "password"
                  ? handleUpdatePassword
                  : () => {}
              }
              disabled={activeTab === "preferences" || isBasicSubmitting || isPasswordSubmitting}
            >
              {activeTab === "basic"
                ? isBasicSubmitting
                  ? "Updating..."
                  : "Update Basic Details"
                : activeTab === "password"
                ? isPasswordSubmitting
                  ? "Updating..."
                  : "Update Password"
                : "Save Preferences"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Main;