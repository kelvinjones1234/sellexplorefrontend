"use client";

import React, { useState } from "react";
import { X, User, CreditCard, Package, LayoutDashboard, Settings, ShoppingCart, Users, ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import LogoutButton from "../LogoutButton";

interface MobileNavbarProps {
  isOpen: boolean;
  toggleMenu: () => void;
}

// NavLinks with nested children for "Orders"
const navLinks = [
  {
    href: "/dashboard/get-started",
    label: "Get Started",
    icon: LayoutDashboard,
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
    href: "#",
    label: "Orders",
    icon: ShoppingCart,
    children: [
      {
        href: "/dashboard/orders/cart",
        label: "Cart",
        icon: ShoppingCart,
      },
      {
        href: "/dashboard/orders/customers",
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

const MobileNavbar: React.FC<MobileNavbarProps> = ({ isOpen, toggleMenu }) => {
  const pathname = usePathname();
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);

  const toggleSubMenu = (label: string) => {
    setOpenSubMenu(openSubMenu === label ? null : label);
  };

  return (
    <div
      className={`fixed inset-0 z-50 transition-all duration-300 ${
        isOpen ? "visible opacity-100" : "invisible opacity-0"
      }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 dark:bg-black/70"
        onClick={toggleMenu}
      />

      {/* Mobile Menu - slides from left */}
      <div
        className={`absolute top-0 left-0 h-full w-80 max-w-[85vw] bg-[var(--color-surface)] shadow-2xl transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-2 border-b border-[var(--color-border-default)]">
            <div className="px-4 w-full">
              <div className="flex items-center p-2 rounded-[1rem] gap-4 bg-[var(--dashboard-card-bg)]">
                <div className="h-10 w-10 bg-[var(--color-primary)] rounded-full"></div>
                <h2 className="font-semibold text-[var(--color-primary)]">
                  Store name
                </h2>
              </div>
            </div>
            <button
              onClick={toggleMenu}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X size={20} className="text-gray-600 dark:text-gray-300" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-6 py-6">
            <ul className="space-y-2">
              {navLinks.map(({ href, label, icon: Icon, children }) => {
                const isActive = pathname === href;

                if (children) {
                  const isOpen = openSubMenu === label;
                  return (
                    <li key={label}>
                      <button
                        onClick={() => toggleSubMenu(label)}
                        className={`flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-[.8rem] transition-colors ${
                          isOpen
                            ? "bg-[var(--dashboard-card-bg)] text-[var(--color-primary)] font-semibold"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                        }`}
                      >
                        <div className="flex items-center">
                          <Icon className="h-5 w-5 mr-3" />
                          {label}
                        </div>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <ul className="ml-8 mt-2 space-y-2">
                          {children.map(({ href, label, icon: SubIcon }) => {
                            const isSubActive = pathname === href;
                            return (
                              <li key={href}>
                                <Link
                                  href={href}
                                  className={`flex items-center px-3 py-2 rounded-lg text-sm transition-colors ${
                                    isSubActive
                                      ? "bg-[var(--dashboard-card-bg)] text-[var(--color-primary)] font-semibold"
                                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                                  }`}
                                  onClick={toggleMenu}
                                >
                                  <SubIcon className="h-4 w-4 mr-2" />
                                  {label}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </li>
                  );
                }

                return (
                  <li key={href}>
                    <Link
                      href={href}
                      className={`flex items-center px-3 py-2.5 rounded-lg text-[.8rem] transition-colors ${
                        isActive
                          ? "bg-[var(--dashboard-card-bg)] text-[var(--color-primary)] font-semibold"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                      }`}
                      onClick={toggleMenu}
                    >
                      <Icon className="h-5 w-5 mr-3" />
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Logout Button at Bottom */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-700">
            <LogoutButton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileNavbar;
