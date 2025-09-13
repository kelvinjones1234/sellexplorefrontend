"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  User,
  CreditCard,
  Package,
  LayoutDashboard,
  Settings,
  Zap,
  ShoppingCart,
  Users,
  ChevronDown,
} from "lucide-react";
import LogoutButton from "./LogoutButton";

const navLinks = [
  {
    href: "/dashboard/get-started",
    label: "Get Started",
    icon: Zap,
  },
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/dashboard/products",
    label: "Products",
    icon: Package,
  },
  {
    href: "/dashboard/order",
    label: "Orders",
    icon: Package,
    children: [
      {
        href: "/dashboard/order/cart",
        label: "Cart",
        icon: ShoppingCart,
      },
      {
        href: "/dashboard/order/customers",
        label: "Customers",
        icon: Users,
      },
    ],
  },
  {
    href: "/dashboard/profile-settings",
    label: "Profile",
    icon: User,
  },
  {
    href: "/vendor/dashboard/subscription",
    label: "Subscription",
    icon: CreditCard,
  },
  {
    href: "/dashboard/my-store",
    label: "Store settings",
    icon: Settings,
  },
];

const Sidebar = () => {
  const pathname = usePathname();
  const [openParent, setOpenParent] = useState<string | null>(null);

  return (
    <div className="h-screen w-full">
      {/* Header */}
      <div className="px-4 py-2">
        <div className="flex items-center p-2 rounded-[1rem] gap-4 bg-[var(--dashboard-card-bg)]">
          <div className="h-10 w-10 bg-[var(--color-primary)] rounded-full"></div>
          <h2 className="font-semibold text-[var(--color-primary)]">
            Store name
          </h2>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-4 px-4">
        <div className="space-y-1">
          {navLinks.map(({ href, label, icon: Icon, children }) => {
            const isActive =
              pathname === href ||
              children?.some((c) => pathname.startsWith(c.href));
            const isOpen = openParent === href;

            return (
              <div key={href}>
                {children ? (
                  // Parent with dropdown
                  <button
                    onClick={() => setOpenParent(isOpen ? null : href)}
                    className={`w-full group flex items-center px-3 mr-2 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? "bg-[var(--dashboard-card-bg)] text-[var(--color-primary)] font-semibold"
                        : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-text)]"
                    }`}
                  >
                    <Icon
                      className={`h-5 w-5 mr-3 transition-colors ${
                        isActive
                          ? "text-[var(--color-primary)]"
                          : "text-[var(--color-text-muted)] group-hover:text-[var(--color-text)]"
                      }`}
                    />
                    <span className="flex-1 text-left">{label}</span>
                    <ChevronDown
                      className={`w-4 h-4 ml-auto transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                ) : (
                  // Normal nav item
                  <Link
                    href={href}
                    className={`w-full group flex items-center px-3 mr-2 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? "bg-[var(--dashboard-card-bg)] text-[var(--color-primary)] font-semibold"
                        : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-text)]"
                    }`}
                  >
                    <Icon
                      className={`h-5 w-5 mr-3 transition-colors ${
                        isActive
                          ? "text-[var(--color-primary)]"
                          : "text-[var(--color-text-muted)] group-hover:text-[var(--color-text)]"
                      }`}
                    />
                    <span className="flex-1 text-left">{label}</span>
                  </Link>
                )}

                {/* Sub-menu */}
                {children && isOpen && (
                  <div className="ml-8 mt-1 space-y-1">
                    {children.map(
                      ({ href: subHref, label: subLabel, icon: SubIcon }) => {
                        const isSubActive = pathname === subHref;
                        return (
                          <Link
                            key={subHref}
                            href={subHref}
                            className={`flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
                              isSubActive
                                ? "bg-[var(--dashboard-card-bg)] text-[var(--color-primary)] font-semibold"
                                : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-text)]"
                            }`}
                          >
                            <SubIcon className="h-4 w-4 mr-2" />
                            {subLabel}
                          </Link>
                        );
                      }
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>

      <div className="mt-8 mr-3 fixed bottom-0 w-[300px] my-4 px-4">
        <LogoutButton />
      </div>
    </div>
  );
};

export default Sidebar;
