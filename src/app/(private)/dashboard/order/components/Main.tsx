"use client";

import React, { useState, useRef } from "react";
import {
  ShoppingBag,
  Users,
  CheckCircle,
  Search,
  ChevronDown,
  Banknote,
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const months = [
  "Dec 24",
  "Jan 25",
  "Feb 25",
  "Mar 25",
  "Apr 25",
  "May 25",
  "Jun 25",
  "Jul 25",
  "Aug 25",
  "Sep 25",
  "Oct 25",
];

const ordersData = {
  labels: months,
  datasets: [
    {
      label: "Total Orders",
      data: [0, 2, 5, 3, 7, 4, 8, 6, 10, 9, 12],
      borderColor: "rgb(239, 68, 68)",
      backgroundColor: "rgba(239, 68, 68, 0.2)",
      borderWidth: 1.5, // thinner line
      pointRadius: 2, // smaller dots
      pointHoverRadius: 4,
      tension: 0.25, // smooth but not too curvy
    },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false, // hide legend for simplicity
    },
    title: {
      display: true,
      // text: "Total Orders This Year",
      font: {
        size: 14,
        weight: "500",
      },
      color: "var(--color-text-primary)",
      padding: { top: 10, bottom: 20 },
    },

    tooltip: {
      mode: "index",
      intersect: false,
    },
  },
  interaction: {
    mode: "nearest",
    axis: "x",
    intersect: false,
  },
  scales: {
    x: {
      grid: {
        display: false, // cleaner look
      },
      ticks: {
        font: {
          size: 11,
        },
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        color: "rgba(0,0,0,0.05)", // softer gridlines
      },
      ticks: {
        stepSize: 2,
        font: {
          size: 11,
        },
      },
    },
  },
};

const Main: React.FC = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [period, setPeriod] = useState("This year");
  const tabsRef = useRef<HTMLDivElement>(null);

  const stats = [
    {
      icon: ShoppingBag,
      label: "Total Orders",
      value: 66,
      color: "bg-red-500",
    },
    {
      icon: Banknote,
      label: "Total Volume",
      value: "NGN 0",
      color: "bg-orange-500",
    },
    { icon: Users, label: "Customers", value: 0, color: "bg-orange-500" },
    { icon: CheckCircle, label: "Fulfilled", value: 0, color: "bg-green-500" },
  ];

  const tabs = [
    { id: "pending", label: "Pending" },
    { id: "processing", label: "Processing" },
    { id: "fulfilled", label: "Fulfilled" },
    { id: "cancelled", label: "Cancelled" },
    { id: "abandoned", label: "Abandoned" },
  ];

  const noOrdersMessage = "You have no Pending orders";

  const scrollToTab = (tabId: string) => {
    const tab = document.getElementById(tabId);
    if (tab && tabsRef.current) {
      const tabRect = tab.getBoundingClientRect();
      const containerRect = tabsRef.current.getBoundingClientRect();
      tabsRef.current.scrollTo({
        left:
          tabsRef.current.scrollLeft +
          tabRect.left -
          containerRect.left -
          containerRect.width / 2 +
          tabRect.width / 2,
        behavior: "smooth",
      });
    }
    setActiveTab(tabId);
  };

  const scrollTabs = (direction: "left" | "right") => {
    if (tabsRef.current) {
      const scrollAmount = 150;
      tabsRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-secondary)]">
      {/* Header */}
      <header className="sticky top-0 bg-[var(--color-bg-primary)] border-b border-[var(--color-border-default)] px-4 py-3 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
            <span>Orders</span>
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

      <div className="pb-8 px-4">
        <div className="max-w-[900px mx-auto">
          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 my-6 border-b border-[var(--color-border-default)]">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="text-center p-4 bg-[var(--color-bg-surface)] hover:bg-[var(--color-bg-secondary)]"
                >
                  <div
                    className={`inline-flex items-center p-3 rounded-full ${stat.color} mb-2 mx-auto`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-xs md:text-sm font-medium text-[var(--color-text-secondary)]">
                    {stat.label}
                  </div>
                  <div className="text-lg md:text-2xl font-bold text-[var(--color-text-secondary)]">
                    {stat.value}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Single Chart */}
          <div className="bg-[var(--color-bg)] rounded-xl md:py-6 mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
              <h3 className="text-sm font-medium text-[var(--color-text-primary)]">
                Total Orders
              </h3>
              <div className="flex items-center gap-1">
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="text-sm text-[var(--color-text-secondary)] bg-transparent border-none"
                >
                  <option>This year</option>
                </select>
              </div>
            </div>
            <div className="h-64 md:h-80">
              <Line options={options} data={ordersData} />
            </div>
          </div>

          {/* Orders Table Section */}
          <div className="bg-[var(--color-bg)] rounded-xl md:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              {/* Tabs with slider */}
              <div className="relative flex items-center w-full sm:w-auto">
                <div
                  ref={tabsRef}
                  className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 sm:pb-0 snap-x snap-mandatory scroll-smooth"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  <div className="flex gap-2 min-w-max">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        id={tab.id}
                        onClick={() => scrollToTab(tab.id)}
                        className={`px-3 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap snap-center flex-shrink-0 ${
                          activeTab === tab.id
                            ? "bg-[var(--color-brand-primary)] text-[var(--color-on-brand)]"
                            : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)]"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Search + Actions */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-none">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--color-text-secondary)]" />
                  <input
                    type="text"
                    placeholder="Search orders"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-[var(--color-border-default)] rounded-lg text-sm bg-[var(--color-bg)]"
                  />
                </div>
                <div className="relative">
                  <button className="flex items-center gap-2 px-3 py-2 border border-[var(--color-border-default)] rounded-lg text-sm">
                    Actions
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* No Orders Message */}
            <div className="text-center py-12">
              <ShoppingBag className="w-12 h-12 text-[var(--color-text-muted)] mx-auto mb-4" />
              <h3 className="text-lg font-medium text-[var(--color-text-primary)] mb-2">
                No Orders
              </h3>
              <p className="text-[var(--color-text-secondary)]">
                {noOrdersMessage}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
