"use client";
import React, { useState } from "react";
import {
  Check,
  ChevronDown,
  ChevronRight,
  Plus,
  ExternalLink,
  HelpCircle,
  MessageCircle,
  ArrowRight,
  Zap,
} from "lucide-react";

interface SetupItem {
  id: string;
  title: string;
  description: string;
  status: "pending" | "completed";
  action?: string;
  actionType?: "primary" | "secondary";
}

interface FAQ {
  question: string;
  link: string;
}

const Main = () => {
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "finish-setup",
  ]);

  const setupItems: SetupItem[] = [
    {
      id: "verify-email",
      title: "Verify email and phone",
      description: "Ensures your account is fully secure",
      status: "pending",
      action: "Get Verified",
      actionType: "primary",
    },
    {
      id: "upload-products",
      title: "Upload 10 products",
      description: "Your store shouldn't be empty when customers visit",
      status: "pending",
      action: "Add Products",
      actionType: "secondary",
    },
    {
      id: "verify-identity",
      title: "Verify Identity",
      description:
        "Do this before 30th August & get NGN 500 off your subscription",
      status: "pending",
      action: "Get Verified",
      actionType: "primary",
    },
    {
      id: "take-order",
      title: "Take order with Payment",
      description:
        "Do this before 1st September & get NGN 250 off your subscription",
      status: "pending",
      action: "Take Order",
      actionType: "primary",
    },
    {
      id: "add-to-phone",
      title: "Add Sellexplore to phone",
      description: "Mobile app coming soon, add web-app to phone access easily",
      status: "pending",
      action: "Show me how",
      actionType: "secondary",
    },
    {
      id: "book-call",
      title: "Book Onboarding Call",
      description: "",
      status: "completed",
    },
    {
      id: "enable-notifications",
      title: "Enable Notifications",
      description: "",
      status: "completed",
    },
    {
      id: "add-socials",
      title: "Add store link to socials",
      description: "",
      status: "completed",
    },
    {
      id: "business-category",
      title: "Setup your business category",
      description: "",
      status: "completed",
    },
    {
      id: "join-community",
      title: "Join our whatsapp community",
      description: "",
      status: "completed",
    },
  ];

  const faqs: FAQ[] = [
    { question: "What is Sellexplore?", link: "#" },
    { question: "How much does Sellexplore cost?", link: "#" },
    { question: "How do I renew my subscription?", link: "#" },
    { question: "How do I customize my store link?", link: "#" },
    { question: "Does Sellexplore have a mobile app?", link: "#" },
  ];

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const completedCount = setupItems.filter(
    (item) => item.status === "completed"
  ).length;
  const totalCount = setupItems.length;
  const progressPercentage = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      {/* Header */}
      <header className="sticky top-0 bg-[var(--color-bg)] border-b border-[var(--color-border-secondary)] px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-[var(--color-heading)]">
            Get Started
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-[var(--color-primary)]">⚡</span>
            <span className="text-sm font-medium hidden sm:inline">
              Quick Actions
            </span>
            <ChevronDown className="w-4 h-4 text-[var(--color-text-muted)]" />
          </div>
        </div>
      </header>

      <div className="px-4 py-6 lg:py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-[var(--color-heading)] mb-2 flex items-center gap-2">
            Hi Praise
            <span className="text-2xl">👋</span>
          </h1>
          <p className="text-[var(--color-text-secondary)] text-sm lg:text-base">
            Here's everything you need to know and do to use Sellexplore
            successfully
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Setup Progress */}
          <div className="md:col-span-2 space-y-6">
            {/* Finish Setting Up Section */}
            <div className="bg-[var(--color-bg)] rounded-xl shadow-sm border border-[var(--color-border-secondary)] overflow-hidden">
              <button
                onClick={() => toggleSection("finish-setup")}
                className="w-full flex items-center justify-between p-4 lg:p-6 hover:bg-[var(--color-surface)] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[var(--color-success-bg)] rounded-full flex items-center justify-center">
                    <Check className="w-5 h-5 text-[var(--color-success)]" />
                  </div>
                  <h2 className="text-lg font-semibold text-[var(--color-heading)]">
                    Finish setting up
                  </h2>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-[var(--color-text-muted)] transition-transform ${
                    expandedSections.includes("finish-setup")
                      ? "rotate-180"
                      : ""
                  }`}
                />
              </button>

              {expandedSections.includes("finish-setup") && (
                <div className="border-t border-[var(--color-border-secondary)] p-4 lg:p-6">
                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-[var(--color-text)]">
                        Your Setup Progress
                      </span>
                      <span className="text-sm font-medium text-[var(--color-heading)]">
                        {progressPercentage}% complete
                      </span>
                    </div>
                    <div className="w-full bg-[var(--color-bg-secondary)] rounded-full h-2">
                      <div
                        className="bg-[var(--color-success)] h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Setup Items */}
                  <div className="space-y-4">
                    {setupItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-start gap-4 p-3 lg:p-4 rounded-lg hover:bg-[var(--color-surface)] transition-colors"
                      >
                        <div className="flex-shrink-0 mt-0.5">
                          {item.status === "completed" ? (
                            <div className="w-5 h-5 bg-[var(--color-success)] rounded-full flex items-center justify-center">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          ) : (
                            <div className="w-5 h-5 border-2 border-[var(--color-border-strong)] rounded-full" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-[var(--color-heading)] text-sm">
                            {item.title}
                          </h3>
                          {item.description && (
                            <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                              {item.description}
                            </p>
                          )}
                        </div>

                        {item.action && item.status === "pending" && (
                          <button
                            className={`flex-shrink-0 px-3 lg:px-4 py-1.5 lg:py-2 rounded-lg text-xs font-medium transition-colors ${
                              item.actionType === "primary"
                                ? "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]"
                                : "border border-[var(--color-border-secondary)] text-[var(--color-text)] hover:bg-[var(--color-bg-secondary)]"
                            }`}
                          >
                            {item.action}
                          </button>
                        )}

                        {item.status === "completed" && (
                          <span className="flex-shrink-0 text-xs lg:text-sm text-[var(--color-success)] font-medium">
                            ✓ Completed
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Learn How It Works Section */}
            <div className="bg-[var(--color-bg)] rounded-xl shadow-sm border border-[var(--color-border-secondary)] overflow-hidden">
              <button
                onClick={() => toggleSection("learn-how")}
                className="w-full flex items-center justify-between p-4 lg:p-6 hover:bg-[var(--color-surface)] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-orange-600 font-bold">🎯</span>
                  </div>
                  <h2 className="text-lg font-semibold text-[var(--color-heading)]">
                    Learn how it works on Sellexplore
                  </h2>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-[var(--color-text-muted)] transition-transform ${
                    expandedSections.includes("learn-how") ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Right Column - Help Sections */}
          <div className="space-y-6">
            {/* FAQ Section */}
            <div className="bg-[var(--color-bg)] rounded-xl shadow-sm border border-[var(--color-border-secondary)] p-4 lg:p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-[var(--color-primary-bg)] rounded-lg flex items-center justify-center">
                  <span className="text-[var(--color-primary)] text-sm">
                    📋
                  </span>
                </div>
                <h3 className="font-semibold text-[var(--color-heading)]">
                  Frequently asked questions
                </h3>
                <ChevronDown className="w-4 h-4 text-[var(--color-text-muted)] ml-auto" />
              </div>

              <div className="space-y-3">
                {faqs.map((faq, index) => (
                  <a
                    key={index}
                    href={faq.link}
                    className="flex items-center justify-between py-2 text-sm text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors group"
                  >
                    <span>{faq.question}</span>
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                ))}
              </div>
            </div>

            {/* Got Questions Section */}
            <div className="bg-[var(--color-bg)] rounded-xl shadow-sm border border-[var(--color-border-secondary)] p-4 lg:p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-[var(--color-primary-bg)] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-[var(--color-primary)] text-lg">
                    🤔
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--color-heading)] mb-2">
                    Got Questions? Find answers fast!
                  </h3>
                  <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                    We've documented answers to questions you might have, click
                    to link to search for answers
                  </p>
                </div>
              </div>

              <button className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[var(--color-bg-secondary)] hover:bg-[var(--color-surface)] rounded-lg text-sm font-medium text-[var(--color-text)] transition-colors">
                Find Answers
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Need Help Section */}
            <div className="bg-[var(--color-bg)] rounded-xl shadow-sm border border-[var(--color-border-secondary)] p-4 lg:p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-[var(--color-primary-bg)] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-[var(--color-primary)] text-lg">🛟</span>
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--color-heading)] mb-2">
                    Need help? We're always here
                  </h3>
                  <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                    Can't find answers to questions you have? Our support team
                    is available to help you.
                  </p>
                </div>
              </div>

              <button className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[var(--color-bg-secondary)] hover:bg-[var(--color-surface)] rounded-lg text-sm font-medium text-[var(--color-text)] transition-colors">
                Get Support
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
