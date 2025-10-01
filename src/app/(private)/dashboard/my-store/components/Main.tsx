"use client";
import React, { useEffect, useState, ChangeEvent } from "react";
import {
  Settings,
  Store,
  CreditCard,
  MapPin,
  Users,
  ShoppingCart,
  ExternalLink,
  Edit,
  ChevronDown,
  Camera,
} from "lucide-react";
import Link from "next/link";
import { apiClient } from "../api";
import { useAuth } from "@/context/AuthContext";

export default function Main() {
  const { isAuthenticated, accessToken, logout } = useAuth();
  const [coverImage, setCoverImage] = useState("/api/placeholder/1200/300");
  const [profileImage, setProfileImage] = useState("/api/placeholder/80/80");

  // Loading states
  const [isFetchingCover, setIsFetchingCover] = useState(false);
  const [isFetchingLogo, setIsFetchingLogo] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsInitialized(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      if (!isAuthenticated) {
        setError("Please log in to access this page.");
        setLoading(false);
      } else {
        fetchData();
      }
    }
  }, [isInitialized, isAuthenticated, accessToken]);

  useEffect(() => {
    if (accessToken) apiClient.setAccessToken(accessToken);
  }, [accessToken]);

  // === Fetch Functions ===
  const fetchCoverImage = async () => {
    setIsFetchingCover(true);
    try {
      const coverData = await apiClient.getCover();
      if (coverData.cover_image) setCoverImage(coverData.cover_image);
    } catch (err: any) {
      if (err.status === 401) logout();
    } finally {
      setIsFetchingCover(false);
    }
  };

  const fetchLogoImage = async () => {
    setIsFetchingLogo(true);
    try {
      const logoData = await apiClient.getLogo();
      if (logoData.logo) setProfileImage(logoData.logo);
    } catch (err: any) {
      if (err.status === 401) logout();
    } finally {
      setIsFetchingLogo(false);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([fetchCoverImage(), fetchLogoImage()]);
    } catch (err: any) {
      setError(err.message || "Failed to load store data.");
      if (err.status === 401) logout();
    } finally {
      setLoading(false);
    }
  };

  // === Upload Function ===
  const handleImageUpload = async (
    event: ChangeEvent<HTMLInputElement>,
    type: "logo" | "cover_image"
  ) => {
    if (!isAuthenticated || !accessToken) {
      setError("Authentication failed. Please log in again.");
      logout();
      return;
    }

    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("File size exceeds 5MB limit");
      return;
    }
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }

    type === "cover_image"
      ? setIsUploadingCover(true)
      : setIsUploadingLogo(true);

    setError(null);

    try {
      if (type === "cover_image") {
        const response = await apiClient.updateCover(file);
        if (response.cover_image) setCoverImage(response.cover_image);
      } else {
        const response = await apiClient.updateLogo(file);
        if (response.logo) setProfileImage(response.logo);
      }
    } catch (err: any) {
      setError(
        err instanceof Error
          ? err.message
          : `Failed to upload ${type === "logo" ? "logo" : "cover image"}`
      );
      if (err.status === 401) logout();
    } finally {
      type === "cover_image"
        ? setIsUploadingCover(false)
        : setIsUploadingLogo(false);
      event.target.value = "";
    }
  };

  // === Settings Cards ===
  const settingsCards = [
    {
      icon: Settings,
      title: "Store Configuration",
      description:
        "Custom color, Opening & closing hours, View modes and Currencies",
      action: "Manage Configurations",
      color: "var(--color-brand-primary)",
      link: "configurations",
    },
    {
      icon: Store,
      title: "Store Information",
      description:
        "Basic details, Location details, Social links and Extra info",
      action: "Manage Details",
      color: "var(--color-accent)",
      link: "details",
    },
    {
      icon: CreditCard,
      title: "Payments",
      description: "Payment options, Direct checkout & Withdrawal settings",
      action: "Payment Settings",
      color: "var(--color-success)",
      link: "payment",
    },
    {
      icon: MapPin,
      title: "Delivery Areas",
      description: "Set areas you want to with corresponding fees",
      action: "Manage Delivery Areas",
      color: "var(--color-success)",
      link: "delivery-location",
    },
    {
      icon: Users,
      title: "Store Managers",
      description: "Give other people access to manage your store",
      action: "Manage Settings",
      color: "var(--color-warning)",
      // link: "manage-users",
    },
    {
      icon: ShoppingCart,
      title: "Checkout Options",
      description: "Configure Whatsapp numbers, Instagram, Delivery & Pickup",
      action: "Manage Checkout",
      color: "var(--color-danger)",
      link: "checkout-options",
    },
  ];

  // === UI States ===
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-primary)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-border-default)] mx-auto mb-4"></div>
          <p className="text-[var(--color-text-secondary)]">Initializing...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-primary)] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[var(--color-danger)] mb-4">
            {error || "Please log in to access this page."}
          </p>
          <button
            onClick={() => (window.location.href = "/login")}
            className="px-4 py-2 bg-[var(--color-brand-primary)] text-[var(--color-on-brand)] rounded-lg hover:bg-[var(--color-brand-hover)] transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-primary)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-border-default)] mx-auto mb-4"></div>
          <p className="text-[var(--color-text-secondary)]">Loading data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-primary)] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[var(--color-danger)] mb-4">Error: {error}</p>
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-[var(--color-brand-primary)] text-[var(--color-on-brand)] rounded-lg hover:bg-[var(--color-brand-hover)] transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // === Main Render ===
  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      {/* Header */}
      <header className="bg-[var(--color-bg-primary)] py-3 px-4 sticky top-0 z-40 border-b border-[var(--color-border-default)]">
        <div className="flex items-center justify-between">
          <h1 className="font-semibold text-[var(--color-text-primary)]">
            My Store
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-[var(--color-warning)]">⚡</span>
            <span className="text-sm font-medium text-[var(--color-text-secondary)]">
              Quick Actions
            </span>
            <ChevronDown className="w-4 h-4 text-[var(--color-text-muted)]" />
          </div>
        </div>
      </header>

      {/* Cover Section */}
      <div className="relative">
        <div
          className="h-48 md:h-64 lg:h-80 bg-cover bg-center"
          style={{ backgroundImage: `url(${coverImage})` }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>

          {isFetchingCover && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          )}

          {/* Cover Upload */}
          <label className="absolute bottom-4 right-4 bg-white bg-opacity-20 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-opacity-30 transition-all flex items-center gap-2 cursor-pointer">
            <Camera className="w-4 h-4" />
            {isUploadingCover ? "Uploading..." : "Change cover image"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageUpload(e, "cover_image")}
              disabled={isUploadingCover || !isAuthenticated}
            />
          </label>
        </div>

        {/* Profile Section */}
        <div className="absolute -bottom-10 left-4 md:left-8">
          <div className="relative">
            <img
              src={profileImage}
              alt="Store Profile"
              className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-[var(--color-bg-surface)] shadow-lg object-cover"
              onError={(e) => (e.currentTarget.src = "/api/placeholder/80/80")}
            />
            <label className="absolute bottom-0 right-0 bg-[var(--color-brand-primary)] text-[var(--color-on-brand)] p-1.5 rounded-full hover:bg-[var(--color-brand-hover)] transition-colors cursor-pointer">
              <Edit className="w-3 h-3" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageUpload(e, "logo")}
                disabled={isUploadingLogo || !isAuthenticated}
              />
            </label>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pt-16 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 px-4">
          {/* Right Column */}
          <div className="lg:col-span-1 order-1 lg:order-2">
            <h3 className="font-semibold text-[var(--color-text-primary)]">
              More Options
            </h3>
            <div className="border border-[var(--color-border-default)] rounded-2xl mt-6 bg-[var(--color-bg-surface)] shadow-xs">
              <div className="p-6">
                <h3 className="font-semibold text-sm mb-4 text-[var(--color-text-primary)]">
                  Store Link
                </h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-xs font-medium bg-[var(--color-brand-light)] text-[var(--color-brand-dark)] px-2 py-1 rounded">
                      COPY LINK
                    </span>
                    <div className="mt-2 flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                      <span>catalog.shop/gents</span>
                      <ExternalLink className="w-3 h-3" />
                    </div>
                  </div>
                </div>
                <div className="mt-4 border-t border-[var(--color-border-strong)]">
                  <p className="text-xs text-[var(--color-text-secondary)] mb-2">
                    Eligible for custom links:
                  </p>
                  <button className="text-[var(--color-brand-primary)] text-xs font-medium hover:underline transition-colors flex items-center gap-1">
                    Edit <Edit className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-[var(--color-success)] bg-opacity-10 rounded-lg">
                    <CreditCard className="w-5 h-5 text-[var(--color-success)]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-[var(--color-text-primary)]">
                      Subscription
                    </h3>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      Basic Plan
                    </p>
                  </div>
                </div>
                <button className="text-[var(--color-brand-primary)] text-xs font-medium hover:underline transition-colors flex items-center gap-1">
                  Manage Subscription <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Left Column */}
          <div className="lg:col-span-1 xl:col-span-2 order-2 lg:order-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
              <h2 className="font-semibold text-[var(--color-text-primary)]">
                Settings
              </h2>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3">
              {settingsCards.map((card, index) => (
                <div
                  key={index}
                  className="p-6 bg-[var(--color-bg-surface)] hover:bg-[var(--color-bg-secondary)] transition-colors border-l border-t border-[var(--color-border-default)] -mr-px -mb-px"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="p-2 rounded-lg"
                      style={{
                        backgroundColor: `${card.color}20`,
                        color: card.color,
                      }}
                    >
                      <card.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm mb-2 text-[var(--color-text-primary)]">
                        {card.title}
                      </h3>
                      <p className="text-xs text-[var(--color-text-secondary)] mb-4 leading-relaxed">
                        {card.description}
                      </p>
                      {card.link ? (
                        <Link href={`/dashboard/my-store/${card.link}`}>
                          <button className="text-[var(--color-brand-primary)] text-xs font-medium hover:text-[var(--color-brand-hover)] transition-colors flex items-center gap-1">
                            {card.action}
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        </Link>
                      ) : (
                        <button
                          disabled
                          className="text-[var(--color-text-secondary)] text-xs font-medium opacity-50 cursor-not-allowed flex items-center gap-1"
                        >
                          {card.action}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
