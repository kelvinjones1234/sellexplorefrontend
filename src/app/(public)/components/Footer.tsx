"use client";

import React from "react";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  ChevronRight,
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[var(--color-bg-secondary)] border-t border-[var(--color-border)] mt-[5rem]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Top Section: Company Info and Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Overview */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[var(--color-heading)]">
              Your Company Name
            </h3>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
              We provide high-quality products and exceptional service to meet
              your needs. Explore our admin dashboard for seamless management.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com/yourcompany"
                aria-label="Facebook"
                className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com/yourcompany"
                aria-label="Twitter"
                className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com/yourcompany"
                aria-label="Instagram"
                className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com/company/yourcompany"
                aria-label="LinkedIn"
                className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-[var(--color-heading)] mb-4 uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/products"
                  className="flex items-center text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
                >
                  Products
                  <ChevronRight className="w-3 h-3 ml-1 opacity-50" />
                </a>
              </li>
              <li>
                <a
                  href="/categories"
                  className="flex items-center text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
                >
                  Categories
                  <ChevronRight className="w-3 h-3 ml-1 opacity-50" />
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="flex items-center text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
                >
                  About Us
                  <ChevronRight className="w-3 h-3 ml-1 opacity-50" />
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="flex items-center text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
                >
                  Contact
                  <ChevronRight className="w-3 h-3 ml-1 opacity-50" />
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-sm font-semibold text-[var(--color-heading)] mb-4 uppercase tracking-wider">
              Legal
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/privacy"
                  className="flex items-center text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
                >
                  Privacy Policy
                  <ChevronRight className="w-3 h-3 ml-1 opacity-50" />
                </a>
              </li>
              <li>
                <a
                  href="/terms"
                  className="flex items-center text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
                >
                  Terms of Service
                  <ChevronRight className="w-3 h-3 ml-1 opacity-50" />
                </a>
              </li>
              <li>
                <a
                  href="/cookies"
                  className="flex items-center text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
                >
                  Cookie Policy
                  <ChevronRight className="w-3 h-3 ml-1 opacity-50" />
                </a>
              </li>
              <li>
                <a
                  href="/support"
                  className="flex items-center text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
                >
                  Support
                  <ChevronRight className="w-3 h-3 ml-1 opacity-50" />
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-sm font-semibold text-[var(--color-heading)] mb-4 uppercase tracking-wider">
              Contact Us
            </h4>
            <div className="space-y-3">
              <div className="flex items-center text-sm text-[var(--color-text-secondary)]">
                <MapPin className="w-4 h-4 mr-2" />
                123 Company Street, Lagos, Nigeria
              </div>
              <div className="flex items-center text-sm text-[var(--color-text-secondary)]">
                <Phone className="w-4 h-4 mr-2" />
                +234 123 456 7890
              </div>
              <div className="flex items-center text-sm text-[var(--color-text-secondary)]">
                <Mail className="w-4 h-4 mr-2" />
                info@yourcompany.com
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Copyright and Powered By */}
        <div className="border-t border-[var(--color-border)] pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-[var(--color-text-secondary)]">
          <p>&copy; {currentYear} Your Company Name. All rights reserved.</p>
          <p className="mt-2 md:mt-0">
            Powered by{" "}
            <a
              href="https://nextjs.org"
              className="text-[var(--color-primary)] hover:underline font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              Sellexplore
            </a>{" "}
            {/* & PraiseMedia */}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
