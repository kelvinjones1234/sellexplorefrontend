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
  Loader2,
} from "lucide-react";
import FloatingLabelInput from "@/app/component/fields/Input";
import Link from "next/link";
import { SketchPicker } from "react-color";
import { apiClient } from "../api";
import { toast } from "react-toastify";

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

// --- API Response Interface ---
interface StoreConfiguration {
  id?: number;
  background_image_one?: string | null;
  background_image_two?: string | null;
  background_image_three?: string | null;
  brand_color_dark: string;
  brand_color_light: string;
  headline: string | null;
  subheading: string | null;
  button_one: string | null;
  button_two: string | null;
  position: "left" | "center" | "right";
  latest_first: boolean;
  about?: string;
  created_at?: string;
  updated_at?: string;
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
  mode: "light" | "dark";
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  selectedColor,
  onColorChange,
  mode,
}) => {
  const [showCustomPicker, setShowCustomPicker] = useState(false);
  const [customColor, setCustomColor] = useState(selectedColor);

  // Update custom color when selected color changes
  useEffect(() => {
    setCustomColor(selectedColor);
  }, [selectedColor]);

  const handleCustomColorChange = (color: any) => {
    const hexColor = color.hex;
    setCustomColor(hexColor);
    onColorChange(hexColor);
  };

  return (
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

      {/* Predefined Palette */}
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

      {/* Custom Picker Toggle */}
      <button
        onClick={() => setShowCustomPicker(!showCustomPicker)}
        className="w-full px-4 py-2 bg-[var(--color-bg-secondary)] hover:bg-[var(--color-surface)] rounded-lg text-sm font-medium text-[var(--color-text)] transition-colors border border-[var(--color-border)]"
      >
        {showCustomPicker ? "Hide" : "Show"} Custom Color Picker
      </button>

      {/* Custom Picker */}
      {showCustomPicker && (
        <div className="space-y-3">
          <SketchPicker
            color={customColor}
            onChange={handleCustomColorChange}
            disableAlpha={true}
          />
        </div>
      )}
    </div>
  );
};

interface VisualsTabProps {
  uploadedImages: Image[];
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: (id: number) => void;
  selectedLightColor: string;
  setSelectedLightColor: React.Dispatch<React.SetStateAction<string>>;
  selectedDarkColor: string;
  setSelectedDarkColor: React.Dispatch<React.SetStateAction<string>>;
}

const VisualsTab: React.FC<VisualsTabProps> = ({
  uploadedImages,
  handleImageUpload,
  removeImage,
  selectedLightColor,
  setSelectedLightColor,
  selectedDarkColor,
  setSelectedDarkColor,
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
            setSelectedLightColor("#f97316");
            setSelectedDarkColor("#fb923c");
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
          mode="light"
        />
        <ColorPicker
          selectedColor={selectedDarkColor}
          onColorChange={setSelectedDarkColor}
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
  const [activeTab, setActiveTab] = useState<string>("visuals");
  const [uploadedImages, setUploadedImages] = useState<Image[]>([]);
  const [selectedLightColor, setSelectedLightColor] =
    useState<string>("#f97316");
  const [selectedDarkColor, setSelectedDarkColor] = useState<string>("#fb923c");
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
  const [loading, setLoading] = useState<boolean>(true);
  const [updating, setUpdating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize active tab from localStorage only on client side
  useEffect(() => {
    const savedTab = localStorage.getItem("activeTab");
    if (savedTab) {
      setActiveTab(savedTab);
    }
  }, []);

  // Fetch configurations on mount
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setLoading(true);
        setError(null);
        const config: StoreConfiguration = await apiClient.getConfiguration();

        setSelectedLightColor(config.brand_color_light || "#f97316");
        setSelectedDarkColor(config.brand_color_dark || "#fb923c");

        setHeroContent({
          headline: config.headline || "",
          subheading: config.subheading || "",
          moreButton: config.button_one || "",
          aboutButton: config.button_two || "",
          position: (config.position as "left" | "center") || "center",
        });

        setStoreInfo({
          about: config.about || "",
          displayLatestFirst: config.latest_first ?? true,
        });

        const images: Image[] = [];
        if (config.background_image_one) {
          images.push({
            id: Date.now() + Math.random(),
            url: config.background_image_one,
            name: "Image 1",
          });
        }
        if (config.background_image_two) {
          images.push({
            id: Date.now() + Math.random() + 1,
            url: config.background_image_two,
            name: "Image 2",
          });
        }
        if (config.background_image_three) {
          images.push({
            id: Date.now() + Math.random() + 2,
            url: config.background_image_three,
            name: "Image 3",
          });
        }
        setUploadedImages(images);
      } catch (err: any) {
        const errorMessage = err.message || "Failed to load configurations";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const remainingSlots = 3 - uploadedImages.length;

    if (files.length > remainingSlots) {
      toast.error(
        `You can only upload ${remainingSlots} more image${
          remainingSlots !== 1 ? "s" : ""
        }`
      );
      return;
    }

    files.forEach((file) => {
      // Validate file size (e.g., 5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`File ${file.name} is too large. Maximum size is 5MB.`);
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error(`File ${file.name} is not a valid image.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          setUploadedImages((prev) => [
            ...prev,
            {
              id: Date.now() + Math.random(),
              url: e.target?.result as string,
              name: file.name,
            },
          ]);
        }
      };
      reader.onerror = () => {
        toast.error(`Failed to read file ${file.name}`);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (id: number) => {
    setUploadedImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleUpdate = async () => {
    try {
      setUpdating(true);
      const formData = new FormData();

      formData.append("brand_color_light", selectedLightColor);
      formData.append("brand_color_dark", selectedDarkColor);
      formData.append("headline", heroContent.headline);
      formData.append("subheading", heroContent.subheading);
      formData.append("button_one", heroContent.moreButton);
      formData.append("button_two", heroContent.aboutButton);
      formData.append("position", heroContent.position);
      formData.append("latest_first", storeInfo.displayLatestFirst.toString());
      formData.append("about", storeInfo.about);

      const img_number = ["one", "two", "three"];

      // Append images - only new ones (data URLs)
      uploadedImages.forEach((img, index) => {
        if (img.url.startsWith("data:image")) {
          const file = dataURLtoFile(img.url, img.name);
          formData.append(`background_image_${img_number[index]}`, file);
        }
      });

      await apiClient.updateConfiguration(formData);
      toast.success("Configurations updated successfully!");
    } catch (err: any) {
      const errorMessage = err.message || "Failed to update configurations";
      toast.error(errorMessage);
      console.error("Update error:", err);
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = () => {
    // Refresh the page or reset to original values
    window.location.reload();
  };

  // Utility to convert data URL to File
  const dataURLtoFile = (dataurl: string, filename: string): File => {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-[var(--color-primary)]" />
          <span className="text-[var(--color-text)]">
            Loading configurations...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">Error: {error}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Header */}
      <header className="sticky top-0 bg-[var(--color-bg)] border-b border-[var(--color-border-secondary)] px-4 py-3 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
            <Link href="http://localhost:3000/dashboard/my-store/">
              <span className="font-medium text-[var(--color-heading)] hover:text-[var(--color-primary)] transition-colors">
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
        <div className="bg-[var(--color-bg)] mb-8">
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
                        : "border-transparent hover:text-[var(--color-text)] text-[var(--color-text-secondary)]"
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="py-6 md:py-8 px-4 max-w-[900px] mx-auto">
            {activeTab === "visuals" && (
              <VisualsTab
                uploadedImages={uploadedImages}
                handleImageUpload={handleImageUpload}
                removeImage={removeImage}
                selectedLightColor={selectedLightColor}
                setSelectedLightColor={setSelectedLightColor}
                selectedDarkColor={selectedDarkColor}
                setSelectedDarkColor={setSelectedDarkColor}
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
          <button
            className="px-6 py-3 border border-[var(--color-border)] text-[var(--color-text)] rounded-lg font-medium hover:bg-[var(--color-bg-secondary)] transition-colors disabled:opacity-50"
            onClick={handleCancel}
            disabled={updating}
          >
            Cancel
          </button>
          <button
            className="px-6 py-3 bg-[var(--color-primary)] text-white justify-center rounded-lg font-medium hover:bg-[var(--color-primary-hover)] transition-colors disabled:opacity-50 flex items-center gap-2"
            onClick={handleUpdate}
            disabled={updating}
          >
            {updating && <Loader2 className="w-4 h-4 animate-spin" />}
            {updating ? "Updating..." : "Update Configurations"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Main;
