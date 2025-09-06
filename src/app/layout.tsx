import type { Metadata, Viewport } from "next";
import { Inter, DM_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "@/context/ThemeContext";

export const metadata: Metadata = {
  title: {
    default: "SellExplore - Discover, Buy & Sell Products Online",
    template: "%s | SellExplore",
  },
  description:
    "Discover amazing products, buy safely, and sell easily on SellExplore. Your trusted marketplace for electronics, fashion, home goods, and more.",
  keywords: [
    "online marketplace",
    "buy sell products",
    "e-commerce platform",
    "electronics",
    "fashion",
    "home goods",
    "safe shopping",
    "trusted sellers",
    "sell",
    "explore",
    "shopping",
    "shop",
    "store",
  ],
  authors: [{ name: "Praisemedia Team" }],
  creator: "Sell Explore",
  publisher: "SellExplore Inc.",
  icons: {
    icon: "/site-logo.ico",
    shortcut: "/site-logo.ico",
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.sellexplore.shop",
    siteName: "SellExplore",
    title: "SellExplore - Discover, Buy & Sell Products Online",
    description:
      "Discover amazing products, buy safely, and sell easily on SellExplore. Your trusted marketplace for electronics, fashion, home goods, and more.",
    images: [
      {
        url: "https://www.sellexplore.shop/twitter.png",
        width: 1200,
        height: 630,
        alt: "SellExplore - Online Marketplace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SellExplore - Discover, Buy & Sell Online",
    description:
      "Discover amazing products, buy safely, and sell easily on SellExplore. Your trusted marketplace for electronics, fashion, home goods, and more.",
    images: ["https://www.sellexplore.shop/twitter.png"],
    creator: "@sellexplore",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "vuuA0Tx2KQL7X5mNmVd6uStfGP00XAKSuW7xEetLCs0",
    yandex: "your-yandex-verification-token",
    yahoo: "your-yahoo-verification-token",
  },
  applicationName: "SellExplore",
  referrer: "origin-when-cross-origin",
  category: "E-commerce",
  alternates: {
    canonical: "https://www.sellexplore.shop",
    languages: {
      "en-US": "https://www.sellexplore.shop",
      "es-ES": "https://www.sellexplore.shop/es",
    },
  },
  classification: "E-commerce Marketplace",
};

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dmsans",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${dmSans.variable}`}
      itemScope
      itemType="https://schema.org/WebSite"
    >
      <head>
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
      </head>
      <body
        itemScope
        itemType="https://schema.org/WebPage"
        className="font-inter"
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
