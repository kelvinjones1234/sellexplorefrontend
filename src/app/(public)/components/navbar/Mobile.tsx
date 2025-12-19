import React from "react";
import { X, Twitter, Instagram, Facebook } from "lucide-react";
import Link from "next/link";
import { navItems } from "@/constant/nav";

interface MobileNavProps {
  isOpen: boolean;
  toggleMenu: () => void;
  totalItems: number;
}

const MobileNavbar: React.FC<MobileNavProps> = ({
  isOpen,
  toggleMenu,
  totalItems,
}) => (
  <div
    className={`fixed z-[999] inset-0 transition-all duration-300 ${
      isOpen ? "visible opacity-100" : "invisible opacity-0"
    }`}
  >
    {/* Backdrop */}
    <div
      className="absolute inset-0 bg-black/50 dark:bg-black/70"
      onClick={toggleMenu}
    />

    {/* Mobile Menu */}
    <div
      className={`absolute top-0 right-0 h-full w-80 max-w-[85vw] bg-[var(--color-bg-surface)] shadow-2xl transform transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between pt-[1.6rem] pb-3 px-5 border-b border-[var(--color-border-strong)]">
          <h2 className="text-sm text-[var(--color-text-secondary)] font-semibold ">
            Menu
          </h2>
          <button
            onClick={toggleMenu}
            className="p-1 rounded-full hover:bg-[var(--color-bg-secondary)] border border-[var(--color-border-strong)] transition"
          >
            <X size={20} className="text-[var(--color-text-secondary)]" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-5 py-8">
          <ul className="space-y-6">
            {navItems.map(({ label, href, disabled }) => (
              <li key={href}>
                <Link
                  href={href}
                  aria-disabled={disabled ? "true" : "false"}
                  className={`block font-medium text-sm text-[var(--color-text-secondary)] `}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile Actions */}
        <div className="p-6 border-t border-[var(--color-border-strong)]">
          <div className="flex items-center justify-center gap-6">
            <Link href="https://twitter.com/your-brand" aria-label="Twitter">
              <Twitter
                size={22}
                className="text-[var(--color-text-secondary)] hover:text-[var(--color-brand-primary)] dark:hover:text-white transition-colors"
              />
            </Link>
            <Link
              href="https://instagram.com/your-brand"
              aria-label="Instagram"
            >
              <Instagram
                size={22}
                className="text-[var(--color-text-secondary)] hover:text-[var(--color-brand-primary)] dark:hover:text-white transition-colors"
              />
            </Link>
            <Link href="https://facebook.com/your-brand" aria-label="Facebook">
              <Facebook
                size={22}
                className="text-[var(--color-text-secondary)] hover:text-[var(--color-brand-primary)] dark:hover:text-white transition-colors"
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default MobileNavbar;
