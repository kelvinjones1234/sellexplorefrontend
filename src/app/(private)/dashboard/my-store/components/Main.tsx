"use client";
import React, { useState } from "react";
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
  Star,
} from "lucide-react";
import Link from "next/link";

export default function Main() {
  const [coverImage, setCoverImage] = useState("/api/placeholder/1200/300");
  const [profileImage, setProfileImage] = useState("/api/placeholder/80/80");

  const settingsCards = [
    {
      icon: Settings,
      title: "Store Configuration",
      description:
        "Custom color, Opening & closing hours, View modes and Currencies",
      action: "Manage Configurations",
      color: "text-orange-500",
    },
    {
      icon: Store,
      title: "Store Information",
      description:
        "Basic details, Location details, Social links and Extra info",
      action: "Manage Details",
      color: "text-red-500",
    },
    {
      icon: CreditCard,
      title: "Payments",
      description: "Payment options, Direct checkout & Withdrawal settings",
      action: "Payment Settings",
      color: "text-orange-500",
    },
    {
      icon: MapPin,
      title: "Delivery Areas",
      description: "Set areas you want to with corresponding fees",
      action: "Manage Delivery Areas",
      color: "text-green-500",
    },
    {
      icon: Users,
      title: "Store Managers",
      description: "Give other people access to manage your store",
      action: "Manage Settings",
      color: "text-orange-500",
    },
    {
      icon: ShoppingCart,
      title: "Checkout Options",
      description: "Configure Whatsapp numbers, Instagram, Delivery & Pickup",
      action: "Manage Checkout",
      color: "text-yellow-500",
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Header */}
      <header className="bg-[var(--color-bg)] py-3 px-4 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <h1 className="font-semibold">My Store</h1>
          <div className="flex items-center gap-2">
            <span className="text-yellow-500">⚡</span>
            <span className="text-sm font-medium text-[var(--color-text-secondary)]">
              Quick Actions
            </span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </div>
        </div>
      </header>

      {/* Cover Image Section */}
      <div className="relative">
        <div
          className="h-48 md:h-64 lg:h-80 bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 bg-cover bg-center"
          style={{ backgroundImage: `url(${coverImage})` }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          <button className="absolute top-4 right-4 bg-white bg-opacity-20 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-opacity-30 transition-all flex items-center gap-2">
            <Camera className="w-4 h-4" />
            Change cover image
          </button>
        </div>

        {/* Profile Section */}
        <div className="absolute -bottom-10 left-4 md:left-8">
          <div className="relative">
            <img
              src={profileImage}
              alt="Store Profile"
              className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-white shadow-lg"
            />
            <button className="absolute bottom-0 right-0 bg-blue-500 text-white p-1.5 rounded-full hover:bg-blue-600 transition-colors">
              <Edit className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-16 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 px-4">
          {/* Right Column - Store Info */}
          <div className="lg:col-span-1 order-1 lg:order-2">
            {/* Store Link */}
            <h3 className="font-semibold">More Options</h3>

            <div className="border border-[var(--color-border)] rounded-2xl mt-6">
              <div className="p-6">
                <h3 className="font-semibold text-sm mb-4">Store Link</h3>

                <div className="space-y-3">
                  <div>
                    <span className="text-xs text-orange-500 font-medium bg-orange-50 px-2 py-1 rounded">
                      COPY LINK
                    </span>
                    <div className="mt-2 flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                      <span>catalog.shop/gents</span>
                      <ExternalLink className="w-3 h-3" />
                    </div>
                  </div>
                </div>

                <div className="mt-4 border-t border-slate-200 dark:border-slate-800">
                  <p className="text-xs text-[var(--color-text-secondary)] mb-2">
                    Eligible for custom links:
                  </p>
                  <button className="text-[var(--card-text-2)] text-xs font-medium hover:text-blue-700 transition-colors flex items-center gap-1">
                    Edit <Edit className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Subscription */}
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <CreditCard className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">Subscription</h3>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      Basic Plan
                    </p>
                  </div>
                </div>
                <button className="text-[var(--card-text-2)] text-xs font-medium hover:text-blue-700 transition-colors flex items-center gap-1">
                  Manage Subscription <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Left Column - Settings */}
          <div className="lg:col-span-1 xl:col-span-2 order-2 lg:order-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
              <h2 className="font-semibold mb-2 sm:mb-0">Settings</h2>
            </div>

            {/* Settings Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 ">
              {settingsCards.map((card, index) => (
                <div
                  key={index}
                  className="rounded-sm p-6 shadow-xs hover:shadow-sm border border-[var(--color-border-secondary)] transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg bg-gray-50 ${card.color}`}>
                      <card.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm mb-2 text-[var(--color-text-primary)]">
                        {card.title}
                      </h3>
                      <p className="text-xs text-[var(--color-text-secondary)] mb-4 leading-relaxed">
                        {card.description}
                      </p>
                      <Link
                        href={
                          "http://localhost:3000/dashboard/my-store/configurations/"
                        }
                      >
                        <button className="text-[var(--card-text-2)] text-xs font-medium hover:text-blue-700 transition-colors flex items-center gap-1">
                          {card.action}

                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </Link>
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
