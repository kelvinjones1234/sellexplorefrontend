import React, { useState } from "react";

// Icon components
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

const PreferencesTab: React.FC<{
  onDisable: () => void;
  onDelete: () => void;
}> = ({ onDisable, onDelete }) => {
  const [showDisableConfirm, setShowDisableConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <div className="space-y-6 text-[var(--color-text-secondary)]">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-[var(--card-bg-3)] rounded-full flex items-center justify-center mx-auto mb-4">
          <Settings className="w-8 h-8 text-[var(--card-text-3)]" />
        </div>
        <h3 className="text-lg font-semibold text-[var(--color-heading)] mb-2">
          Manage Preferences
        </h3>
        <p className="text-sm text-[var(--color-text-secondary)]">
          Control your account status and data management
        </p>
      </div>

      <div className="max-w-[900px] mx-auto space-y-6">
        <div className="bg-[var(--color-bg)] border border-[var(--color-border-default)] rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-[var(--color-bg-secondary)] rounded-lg">
              <UserX className="w-5 h-5 text-[var(--color-brand-primary)]" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-sm text-[var(--color-heading)] mb-2">
                Disable Account
              </h4>
              <p className="text-sm text-[var(--color-text-secondary)] mb-4">
                Temporarily disable your account. You can reactivate it anytime
                by logging in.
              </p>
              {!showDisableConfirm ? (
                <button
                  onClick={() => setShowDisableConfirm(true)}
                  className="px-4 py-2 bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] border border-[var(--color-border-default)] rounded-xl hover:bg-[var(--color-bg-surface)] transition-colors text-sm font-medium"
                >
                  Disable Account
                </button>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[var(--color-brand-primary)] text-sm">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Are you sure you want to disable your account?</span>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        onDisable();
                        setShowDisableConfirm(false);
                      }}
                      className="px-4 py-2 bg-[var(--color-brand-primary)] text-[var(--color-on-brand)] rounded-xl hover:bg-[var(--color-brand-hover)] transition-colors text-sm font-medium"
                    >
                      Yes, Disable
                    </button>
                    <button
                      onClick={() => setShowDisableConfirm(false)}
                      className="px-4 py-2 bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] border border-[var(--color-border-default)] rounded-xl hover:bg-[var(--color-bg-surface)] transition-colors text-sm font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-[var(--color-bg)] border border-[var(--color-border-default)] rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-[var(--color-bg-secondary)] rounded-lg">
              <Trash2 className="w-5 h-5 text-[var(--color-brand-primary)]" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-sm text-[var(--color-heading)] mb-2">
                Delete Account
              </h4>
              <p className="text-sm text-[var(--color-text-secondary)] mb-4">
                Permanently delete your account and all associated data. This
                action cannot be undone.
              </p>
              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-4 py-2 bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] border border-[var(--color-border-default)] rounded-xl hover:bg-[var(--color-bg-surface)] transition-colors text-sm font-medium"
                >
                  Delete Account
                </button>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[var(--color-brand-primary)] text-sm">
                    <AlertTriangle className="w-4 h-4" />
                    <span>
                      This will permanently delete your account and all data!
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        onDelete();
                        setShowDeleteConfirm(false);
                      }}
                      className="px-4 py-2 bg-[var(--color-brand-primary)] text-[var(--color-on-brand)] rounded-xl hover:bg-[var(--color-brand-hover)] transition-colors text-sm font-medium"
                    >
                      Yes, Delete Forever
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="px-4 py-2 bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] border border-[var(--color-border-default)] rounded-xl hover:bg-[var(--color-bg-surface)] transition-colors text-sm font-medium"
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

export default PreferencesTab;