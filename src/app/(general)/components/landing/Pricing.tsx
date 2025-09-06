"use client";

import React, { useState } from "react";

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState<
    "quarterly" | "biannual" | "yearly"
  >("quarterly");

  const plans = {
    quarterly: [
      {
        name: "Sellexplore Starter",
        price: "₦6,000",
        subtext: "₦2,000 / month (billed quarterly)",
        description:
          "For solo vendors with few products & a small customer base.",
        features: [
          "Basic product listing",
          "Simple order management",
          "Up to 30 products",
        ],
        action: "Start Free Trial",
        style: { bg: "var(--card-bg-1)", text: "var(--text-secondary)" },
      },
      {
        name: "Sellexplore Pro",
        price: "₦12,000",
        subtext: "₦4,000 / month (billed quarterly)",
        description: "For growing vendors managing more sales and inventory.",
        features: [
          "Advanced product listing",
          "Bulk order management",
          "Up to 100 products",
          "Basic analytics & reporting",
        ],
        action: "Start Free Trial",
        style: { bg: "var(--card-bg-2)", text: "var(--text-secondary)" },
      },
    ],
    biannual: [
      {
        name: "Sellexplore Starter",
        price: "₦10,000",
        subtext: "₦1,667 / month (billed biannually)",
        description:
          "For solo vendors with few products & a small customer base.",
        features: [
          "Basic product listing",
          "Simple order management",
          "Up to 40 products",
        ],
        action: "Start Free Trial",
        style: { bg: "var(--card-bg-1)", text: "var(--text-secondary)" },
      },
      {
        name: "Sellexplore Pro",
        price: "₦20,000",
        subtext: "₦3,333 / month (billed biannually)",
        description: "For growing vendors managing more sales and inventory.",
        features: [
          "Advanced product listing",
          "Bulk order management",
          "Up to 150 products",
          "Analytics & reporting",
        ],
        action: "Start Free Trial",
        style: { bg: "var(--card-bg-2)", text: "var(--text-secondary)" },
      },
    ],
    yearly: [
      {
        name: "Sellexplore Starter",
        price: "₦18,000",
        subtext: "₦1,500 / month (billed yearly)",
        description:
          "For solo vendors with few products & a small customer base.",
        features: [
          "Basic product listing",
          "Simple order management",
          "Up to 50 products",
        ],
        action: "Start Free Trial",
        style: { bg: "var(--card-bg-1)", text: "var(--text-secondary)" },
      },
      {
        name: "Sellexplore Pro",
        price: "₦36,000",
        subtext: "₦3,000 / month (billed yearly)",
        description: "For growing vendors managing more sales and inventory.",
        features: [
          "Advanced product listing",
          "Bulk order management",
          "Up to 200 products",
          "Full analytics & reporting",
        ], 
        action: "Start Free Trial",
        style: { bg: "var(--card-bg-2)", text: "var(--text-secondary)" },
      },
    ],
  };

  return (
    <section className="relative z-10 mx-auto py-12 container-padding" id="pricing">
      <div className="text-center mb-8">
        <h1 className="text-[clamp(2rem,6.5vw,3rem)] font-semibold leading-tight">
          Save up to <span className="text-[var(--color-primary)]">20%</span> on
          a yearly plan
        </h1>
      </div>

      {/* Billing Cycle Toggle */}
      <div className="flex justify-center mb-8">
        {(["quarterly", "biannual", "yearly"] as const).map((cycle) => (
          <button
            key={cycle}
            onClick={() => setBillingCycle(cycle)}
            className={`px-6 py-2 rounded-full mx-2 capitalize ${
              billingCycle === cycle
                ? "bg-[var(--color-primary)] text-white"
                : "bg-gray-800 text-gray-300"
            }`}
          >
            {cycle}
          </button>
        ))}
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {plans[billingCycle].map((plan, i) => (
          <div
            key={i}
            className="border-1 border-[var(--color-border)] rounded-[3rem] p-6 shadow-sm flex flex-col"
            style={{ backgroundColor: plan.style.bg, color: plan.style.text }}
          >
            <h2 className="text-2xl font-semibold mb-2">{plan.name}</h2>
            <p className="mb-4">
              {plan.description}
            </p>
            <div className="text-3xl font-bold mb-1">{plan.price}</div>
            <p className="mb-4">
              {plan.subtext}
            </p>
            <ul className="mb-6 space-y-2">
              {plan.features.map((f, idx) => (
                <li key={idx}>• {f}</li>
              ))}
            </ul>
            <button className="bg-[var(--color-primary)] py-3 rounded-full font-medium hover:opacity-90 mt-auto">
              {plan.action}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Pricing;
