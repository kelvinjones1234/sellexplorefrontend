"use client";

import React, { useState, useEffect } from "react";
import {
  Palette,
  Type,
  Store,
  Upload,
  X,
  ChevronDown,
  Sun,
  Moon,
  AlignLeft,
  AlignCenter,
} from "lucide-react";
import FloatingLabelInput from "@/app/component/fields/Input";
import Link from "next/link";

// --- Interfaces ---
interface Image {
  id: number;
  url: string;
  name: string;
}

interface HeroContent {
  headline: string;
  subheading: string;
  moreButton: string;
  aboutButton: string;
  position: "left" | "center";
}

interface StoreInfo {
  about: string;
  displayLatestFirst: boolean;
}

interface Tab {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

// --- Data for Selections ---
const colorPalette: string[] = [
  "#6366f1",
  "#8b5cf6",
  "#a855f7",
  "#ec4899",
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#10b981",
  "#06b6d4",
  "#3b82f6",
  "#374151",
  "#1f2937",
  "#111827",
  "#000000",
];

const tabs: Tab[] = [
  { id: "visuals", label: "Visuals & Themes", icon: Palette },
  { id: "hero", label: "Hero Content", icon: Type },
  { id: "store", label: "Store Preferences", icon: Store },
];

// --- Component Definitions ---
interface ColorPickerProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
  customColor: string;
  onCustomColorChange: (color: string) => void;
  mode: "light" | "dark";
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  selectedColor,
  onColorChange,
  customColor,
  onCustomColorChange,
  mode,
}) => (
  <div className="space-y-4">
    <div className="flex items-center font-medium text-sm text-[var(--color-body)] gap-3">
      {mode === "light" ? (
        <Sun className="w-5 h-5 text-[var(--color-primary)]" />
      ) : (
        <Moon className="w-5 h-5 text-[var(--color-primary)]" />
      )}
      <span className="font-medium text-[var(--color-text)] capitalize">
        {mode} Mode
      </span>
    </div>
    <div className="grid grid-cols-10 gap-2">
      {colorPalette.map((color, index) => (
        <button
          key={index}
          className={`w-8 h-8 rounded-lg border-2 transition-all hover:scale-110 ${
            selectedColor === color
              ? "border-[var(--color-border-strong)] ring-2 ring-[var(--color-primary)]"
              : "border-[var(--color-border)]"
          }`}
          style={{ backgroundColor: color }}
          onClick={() => onColorChange(color)}
        />
      ))}
    </div>
    <div className="flex items-center gap-3">
      <input
        type="color"
        value={customColor}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onCustomColorChange(e.target.value)
        }
        className="w-12 h-10 rounded-lg border border-[var(--color-border)] cursor-pointer"
      />
      <button
        onClick={() => onColorChange(customColor)}
        className="px-4 py-2 bg-[var(--color-bg-secondary)] hover:bg-[var(--color-surface)] rounded-lg text-sm font-medium text-[var(--color-text)] transition-colors"
      >
        Use Custom
      </button>
    </div>
  </div>
);

interface VisualsTabProps {
  uploadedImages: Image[];
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: (id: number) => void;
  selectedLightColor: string;
  setSelectedLightColor: React.Dispatch<React.SetStateAction<string>>;
  customLightColor: string;
  setCustomLightColor: React.Dispatch<React.SetStateAction<string>>;
  selectedDarkColor: string;
  setSelectedDarkColor: React.Dispatch<React.SetStateAction<string>>;
  customDarkColor: string;
  setCustomDarkColor: React.Dispatch<React.SetStateAction<string>>;
}

const VisualsTab: React.FC<VisualsTabProps> = ({
  uploadedImages,
  handleImageUpload,
  removeImage,
  selectedLightColor,
  setSelectedLightColor,
  customLightColor,
  setCustomLightColor,
  selectedDarkColor,
  setSelectedDarkColor,
  customDarkColor,
  setCustomDarkColor,
}) => (
  <div className="space-y-8">
    {/* Image Upload Section */}
    <div>
      <h3 className="text-sm font-medium text-[var(--color-text)] mb-4">
        Store Images
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {uploadedImages.map((image) => (
          <div key={image.id} className="relative group">
            <img
              src={image.url}
              alt={image.name}
              className="w-full h-32 object-cover rounded-lg border border-[var(--color-border)]"
            />
            <button
              onClick={() => removeImage(image.id)}
              className="absolute -top-2 -right-2 bg-[var(--color-primary)] text-[var(--color-bg)] rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
        {uploadedImages.length < 3 && (
          <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-[var(--color-border)] rounded-lg cursor-pointer hover:border-[var(--color-border-strong)] transition-colors">
            <Upload className="w-8 h-8 text-[var(--color-text-muted)] mb-2" />
            <span className="text-sm text-[var(--color-text-muted)]">
              Upload Image
            </span>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        )}
      </div>
      <p className="text-sm text-[var(--color-text-muted)]">
        {uploadedImages.length}/3 images uploaded
      </p>
    </div>

    {/* Brand Colors */}
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-medium text-[var(--color-text)]">
          Brand Colors
        </h3>
        <button
          onClick={() => {
            setSelectedLightColor("#6366f1");
            setSelectedDarkColor("#4f46e5");
          }}
          className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors"
        >
          Reset
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ColorPicker
          selectedColor={selectedLightColor}
          onColorChange={setSelectedLightColor}
          customColor={customLightColor}
          onCustomColorChange={setCustomLightColor}
          mode="light"
        />
        <ColorPicker
          selectedColor={selectedDarkColor}
          onColorChange={setSelectedDarkColor}
          customColor={customDarkColor}
          onCustomColorChange={setCustomDarkColor}
          mode="dark"
        />
      </div>
    </div>
  </div>
);

interface HeroTabProps {
  heroContent: HeroContent;
  setHeroContent: React.Dispatch<React.SetStateAction<HeroContent>>;
}

const HeroTab: React.FC<HeroTabProps> = ({ heroContent, setHeroContent }) => (
  <div className="space-y-6">
    <div className="text-center mb-8">
      <div className="w-16 h-16 bg-[var(--card-bg-2)] rounded-full flex items-center justify-center mx-auto mb-4">
        <Type className="w-8 h-8 text-[var(--card-text-2)]" />
      </div>
      <h3 className="text-lg font-semibold text-[var(--color-heading)] mb-2">
        Hero Content
      </h3>
      <p className="text-[var(--color-text-secondary)]">
        Configure your store's hero section content and layout
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {["headline", "subheading", "moreButton", "aboutButton"].map((field) => (
        <div key={field}>
          <FloatingLabelInput
            type="text"
            name={field}
            value={heroContent[field as keyof HeroContent]}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setHeroContent((prev) => ({
                ...prev,
                [field]: e.target.value,
              }))
            }
            placeholder={
              field === "headline"
                ? "Headline"
                : field === "subheading"
                ? "Subheading"
                : field === "moreButton"
                ? "Button one"
                : "Button two"
            }
          />
        </div>
      ))}
      <div>
        <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
          Content Position
        </label>
        <div className="flex gap-3">
          {["left", "center"].map((pos) => (
            <button
              key={pos}
              type="button"
              onClick={() =>
                setHeroContent((prev) => ({
                  ...prev,
                  position: pos as "left" | "center",
                }))
              }
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg border transition-all ${
                heroContent.position === pos
                  ? "bg-[var(--color-bg-secondary)] border-[var(--color-border-strong)] text-[var(--color-primary)]"
                  : "bg-[var(--color-bg)] border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-surface)]"
              }`}
            >
              {pos === "left" ? (
                <AlignLeft className="w-4 h-4" />
              ) : (
                <AlignCenter className="w-4 h-4" />
              )}
              {pos.charAt(0).toUpperCase() + pos.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  </div>
);

interface StoreTabProps {
  storeInfo: StoreInfo;
  setStoreInfo: React.Dispatch<React.SetStateAction<StoreInfo>>;
}

const StoreTab: React.FC<StoreTabProps> = ({ storeInfo, setStoreInfo }) => (
  <div className="space-y-6">
    <div className="text-center mb-8">
      <div className="w-16 h-16 bg-[var(--card-bg-3)] rounded-full flex items-center justify-center mx-auto mb-4">
        <Store className="w-8 h-8 text-[var(--card-text-3)]" />
      </div>
      <h3 className="text-lg font-semibold text-[var(--color-heading)] mb-2">
        Store Preferences
      </h3>
      <p className="text-[var(--color-text-secondary)]">
        Configure your store information and display preferences
      </p>
    </div>

    <div className="bg-[var(--color-bg)] border border-[var(--color-border)] p-6 rounded-xl">
      <h4 className="font-medium text-sm text-[var(--color-heading)] mb-4">
        Display Preferences
      </h4>
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium text-[var(--color-heading)]">
            Display Latest Products First
          </p>
          <p className="text-xs leading-relaxed text-[var(--color-text-secondary)]">
            Show newest products at the top of your catalog
          </p>
        </div>
        <button
          onClick={() =>
            setStoreInfo((prev) => ({
              ...prev,
              displayLatestFirst: !prev.displayLatestFirst,
            }))
          }
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            storeInfo.displayLatestFirst
              ? "bg-[var(--color-primary)]"
              : "bg-[var(--color-border)]"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-[var(--color-bg)] transition-transform ${
              storeInfo.displayLatestFirst ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>
    </div>
  </div>
);

// --- Main Component ---
const Main: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("activeTab") || "visuals";
    }
    return "visuals";
  });

  const [uploadedImages, setUploadedImages] = useState<Image[]>([]);
  const [selectedLightColor, setSelectedLightColor] =
    useState<string>("#6366f1");
  const [selectedDarkColor, setSelectedDarkColor] = useState<string>("#4f46e5");
  const [customLightColor, setCustomLightColor] = useState<string>("#6366f1");
  const [customDarkColor, setCustomDarkColor] = useState<string>("#4f46e5");
  const [heroContent, setHeroContent] = useState<HeroContent>({
    headline: "",
    subheading: "",
    moreButton: "",
    aboutButton: "",
    position: "center",
  });
  const [storeInfo, setStoreInfo] = useState<StoreInfo>({
    about: "",
    displayLatestFirst: true,
  });

  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (uploadedImages.length + files.length <= 3) {
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          if (e.target?.result) {
            setUploadedImages((prev) => [
              ...prev,
              {
                id: Date.now() + Math.random(),
                url: e.target.result as string,
                name: file.name,
              },
            ]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (id: number) => {
    setUploadedImages((prev) => prev.filter((img) => img.id !== id));
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Header */}
      <header className="sticky top-0 bg-[var(--color-bg)] border-b border-[var(--color-border-secondary)] px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
            <Link href="http://localhost:3000/dashboard/my-store/">
              <span className="font-medium text-[var(--color-heading)]">
                Store settings
              </span>
            </Link>
            <span>›</span>
            <span>Configurations</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[var(--color-primary)]">⚡</span>
            <span className="text-sm font-medium text-[var(--color-text)]">
              Quick Actions
            </span>
            <ChevronDown className="w-4 h-4 text-[var(--color-text-muted)]" />
          </div>
        </div>
      </header>

      <div className="px-4 pb-8">
        {/* Tab Navigation */}
        <div className="bg-[var(--color-bg)] rounded-xl shadow-sm border-[var(--color-border)] mb-8">
          <div className="border-b border-[var(--color-border-secondary)] rounded-t-xl overflow-hidden">
            <nav className="flex overflow-x-auto no-scrollbar gap-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-all
        ${
          activeTab === tab.id
            ? "border-[var(--color-primary)] text-[var(--color-primary)]"
            : "border-transparent hover:bg-[var(--color-bg-secondary)]"
        }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="py-6 md:py-8 max-w-[900px] mx-auto">
            {activeTab === "visuals" && (
              <VisualsTab
                uploadedImages={uploadedImages}
                handleImageUpload={handleImageUpload}
                removeImage={removeImage}
                selectedLightColor={selectedLightColor}
                setSelectedLightColor={setSelectedLightColor}
                customLightColor={customLightColor}
                setCustomLightColor={setCustomLightColor}
                selectedDarkColor={selectedDarkColor}
                setSelectedDarkColor={setSelectedDarkColor}
                customDarkColor={customDarkColor}
                setCustomDarkColor={setCustomDarkColor}
              />
            )}
            {activeTab === "hero" && (
              <HeroTab
                heroContent={heroContent}
                setHeroContent={setHeroContent}
              />
            )}
            {activeTab === "store" && (
              <StoreTab storeInfo={storeInfo} setStoreInfo={setStoreInfo} />
            )}
          </div> 
        </div>

        {/* Action Buttons */}
        <div className="flex max-w-[900px] mx-auto flex-col text-sm sm:flex-row gap-3 justify-end">
          <button className="px-6 py-3 border border-[var(--color-border)] text-[var(--color-text)] rounded-lg font-medium hover:bg-[var(--color-bg-secondary)] transition-colors">
            Cancel
          </button>
          <button className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg font-medium hover:bg-[var(--color-primary-hover)] transition-colors">
            Update Configurations
          </button>
        </div>
      </div>
    </div>
  );
};

export default Main;
