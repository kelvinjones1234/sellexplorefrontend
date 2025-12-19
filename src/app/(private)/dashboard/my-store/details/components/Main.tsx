"use client";

import React, { useState, useEffect } from "react";
import {
  Store as StoreIcon,
  MapPin,
  Briefcase,
  Type,
  Link as LinkIcon,
  Info,
  HelpCircle,
  X,
  Plus,
  Trash,
  ChevronDown,
  Loader2,
} from "lucide-react";
import FloatingLabelInput from "@/app/component/fields/Input";
import FloatingLabelTextarea from "@/app/component/fields/Textarea";
import FloatingLabelSelect from "@/app/component/fields/Selection";
import {
  StoreFAQ,
  Option,
  BasicDetails,
  LocationDetails,
  SocialLinks,
  ExtraInfo,
  AboutUs,
  Tab,
  LocalFAQ,
} from "../types";
import { apiClient } from "../api";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { toast } from "react-toastify";

// --- Data for Selections ---
const countryOptions: Option[] = [
  { value: "Nigeria", label: "Nigeria" },
  { value: "Ghana", label: "Ghana" },
  { value: "Kenya", label: "Kenya" },
  { value: "South Africa", label: "South Africa" },
  { value: "United States", label: "United States" },
  { value: "United Kingdom", label: "United Kingdom" },
];

const statesByCountry: Record<string, Option[]> = {
  Nigeria: [
    { value: "FCT", label: "FCT (Abuja)" },
    { value: "Lagos", label: "Lagos" },
    { value: "Rivers", label: "Rivers" },
    { value: "Kano", label: "Kano" },
    { value: "Ogun", label: "Ogun" },
  ],
  // ... other countries
};

const businessCategoryOptions: Option[] = [
  { value: "Retail", label: "Retail" },
  { value: "Services", label: "Services" },
  { value: "Food & Beverage", label: "Food & Beverage" },
  { value: "Technology", label: "Technology" },
  { value: "Health & Wellness", label: "Health & Wellness" },
  { value: "Fashion", label: "Fashion & Apparel" },
];

const productOptions: string[] = [
  "Electronics",
  "Clothing",
  "Books",
  "Food",
  "Beauty",
  "Sports",
  "Home",
  "Toys",
  "Automotive",
  "Health",
];

const tabs: Tab[] = [
  { id: "basic", label: "Basic Details", icon: StoreIcon },
  { id: "location", label: "Location Details", icon: MapPin },
  { id: "category", label: "Business Category", icon: Briefcase },
  { id: "about", label: "About Us", icon: Type },
  { id: "social", label: "Social Links", icon: LinkIcon },
  { id: "extra", label: "Extra Info", icon: Info },
  { id: "faqs", label: "FAQs", icon: HelpCircle },
];

interface BasicTabProps {
  basicDetails: BasicDetails;
  setBasicDetails: React.Dispatch<React.SetStateAction<BasicDetails>>;
}

const BasicTab: React.FC<BasicTabProps> = ({
  basicDetails,
  setBasicDetails,
}) => (
  <div className="space-y-6 text-[var(--color-text-secondary)]">
    <div className="text-center mb-8">
      <div className="w-16 h-16 bg-[var(--card-bg-1)] rounded-full flex items-center justify-center mx-auto mb-4">
        <StoreIcon className="w-8 h-8 text-[var(--card-text-1)]" />
      </div>
      <h3 className="text-lg font-semibold text-[var(--color-heading)] mb-2">
        Basic Details
      </h3>
      <p className="text-[var(--color-text-secondary)]">
        Configure your store's basic information
      </p>
    </div>
    <FloatingLabelInput
      type="text"
      name="name"
      value={basicDetails.store_name}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        setBasicDetails((prev) => ({ ...prev, name: e.target.value }))
      }
      placeholder="Store Name"
    />
    <FloatingLabelInput
      type="tel"
      name="phone"
      value={basicDetails.phone}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        setBasicDetails((prev) => ({ ...prev, phone: e.target.value }))
      }
      placeholder="Phone Number"
    />
    <FloatingLabelTextarea
      name="description"
      value={basicDetails.description}
      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
        setBasicDetails((prev) => ({ ...prev, description: e.target.value }))
      }
      placeholder="Store Description"
    />
  </div>
);

interface LocationTabProps {
  locationDetails: LocationDetails;
  setLocationDetails: React.Dispatch<React.SetStateAction<LocationDetails>>;
}

const LocationTab: React.FC<LocationTabProps> = ({
  locationDetails,
  setLocationDetails,
}) => (
  <div className="space-y-6 text-[var(--color-text-secondary)]">
    <div className="text-center mb-8">
      <div className="w-16 h-16 bg-[var(--card-bg-2)] rounded-full flex items-center justify-center mx-auto mb-4">
        <MapPin className="w-8 h-8 text-[var(--card-text-2)]" />
      </div>
      <h3 className="text-lg font-semibold text-[var(--color-heading)] mb-2">
        Location Details
      </h3>
      <p className="text-[var(--color-text-secondary)]">
        Set your store's location information
      </p>
    </div>
    <FloatingLabelSelect
      name="country"
      value={locationDetails.country}
      onChange={(value) =>
        setLocationDetails((prev) => ({
          ...prev,
          country: value as string,
          state: "",
        }))
      }
      placeholder="Country"
      options={countryOptions}
    />
    <FloatingLabelSelect
      name="state"
      value={locationDetails.state}
      onChange={(value) =>
        setLocationDetails((prev) => ({
          ...prev,
          state: value as string,
        }))
      }
      placeholder="State / Province"
      options={statesByCountry[locationDetails.country] || []}
      disabled={!locationDetails.country}
    />
    <FloatingLabelInput
      type="text"
      name="address"
      value={locationDetails.address}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        setLocationDetails((prev) => ({ ...prev, address: e.target.value }))
      }
      placeholder="Store Address"
    />     
  </div>
);

interface CategoryTabProps {
  businessCategory: string;
  setBusinessCategory: React.Dispatch<React.SetStateAction<string>>;
  productTypes: string[];
  setProductTypes: React.Dispatch<React.SetStateAction<string[]>>;
  isProductModalOpen: boolean;
  setIsProductModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  tempProductTypes: string[];
  setTempProductTypes: React.Dispatch<React.SetStateAction<string[]>>;
}

const CategoryTab: React.FC<CategoryTabProps> = ({
  businessCategory,
  setBusinessCategory,
  productTypes,
  setProductTypes,
  isProductModalOpen,
  setIsProductModalOpen,
  tempProductTypes,
  setTempProductTypes,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProductOptions = productOptions.filter((option) =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectProduct = (option: string) => {
    setTempProductTypes((prev) =>
      prev.includes(option)
        ? prev.filter((t) => t !== option)
        : [...prev, option]
    );
  };

  return (
    <div className="">
      <FloatingLabelSelect
        name="businessCategory"
        value={businessCategory}
        onChange={(value) => setBusinessCategory(value as string)}
        placeholder="Business Category"
        options={businessCategoryOptions}
      />
      <button
        onClick={() => {
          setTempProductTypes(productTypes);
          setIsProductModalOpen(true);
        }}
        className="px-6 text-sm py-3 bg-[var(--color-brand-primary)] text-[var(--color-on-brand)] rounded-xl font-medium hover:bg-[var(--color-brand-hover)] transition-colors my-6"
      >
        Select Product Types
      </button>
      {productTypes.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {productTypes.map((type) => (
            <span
              key={type}
              className="px-3 py-1 bg-[var(--color-bg-secondary)] rounded-full text-sm"
            >
              {type}
            </span>
          ))}
          <span className="px-3 py-1 bg-[var(--color-primary)] text-white rounded-full text-sm font-medium">
            {productTypes.length} selected
          </span>
        </div>
      )}

      {isProductModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[var(--color-bg-surface)] p-6 rounded-3xl max-w-md w-full relative">
            <button
              onClick={() => setIsProductModalOpen(false)}
              className="absolute top-4 right-4 border hover:bg-[var(--color-bg-secondary)] border-[var(--color-border-strong)] p-1 rounded-full text-[var(--color-text-secondary)] transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-md text-[var(--color-text-primary)] font-semibold mb-4">
              Select Product Types
            </h3>
            <div className="mb-5">
              <FloatingLabelInput
                type="text"
                name="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search items"
              />
            </div>
            <div className="flex flex-wrap gap-4 max-h-60 overflow-y-auto">
              {filteredProductOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => handleSelectProduct(option)}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    tempProductTypes.includes(option)
                      ? "bg-[var(--color-brand-primary)] text-[var(--color-on-brand)] hover:bg-[var(--color-brand-hover)]"
                      : "bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] hover:bg-[var(--color-bg-secondary-hover)]"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
            <button
              onClick={() => {
                setProductTypes(tempProductTypes);
                setIsProductModalOpen(false);
              }}
              className="w-full mt-6 px-4 py-4 bg-[var(--color-brand-primary)] text-[var(--color-on-brand)] hover:bg-[var(--color-brand-hover)] rounded-xl font-medium text-sm"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

interface AboutTabProps {
  aboutUs: AboutUs;
  setAboutUs: React.Dispatch<React.SetStateAction<AboutUs>>;
  aboutImages: (File | string | null)[];
  handleImageUpload: (
    e: React.ChangeEvent<HTMLInputElement>,
    index?: number
  ) => void;
  removeImage: (index: number) => void;
}

const AboutTab: React.FC<AboutTabProps> = ({
  aboutUs,
  setAboutUs,
  aboutImages,
  handleImageUpload,
  removeImage,
}) => (
  <div className="space-y-8 text-[var(--color-text-secondary)]">
    <div className="text-center mb-8">
      <div className="w-16 h-16 bg-[var(--card-bg-1)] rounded-full flex items-center justify-center mx-auto mb-4">
        <Type className="w-8 h-8 text-[var(--card-text-1)]" />
      </div>
      <h3 className="text-lg font-semibold text-[var(--color-heading)] mb-2">
        About Us
      </h3>
      <p className="text-[var(--color-text-secondary)]">
        Share your store's story and supporting images
      </p>
    </div>
    <FloatingLabelTextarea
      name="story"
      value={aboutUs.story}
      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
        setAboutUs((prev) => ({ ...prev, story: e.target.value }))
      }
      placeholder="Your Story"
    />
    <div>
      <h3 className="text-sm font-medium text-[var(--color-text-primary)] mb-4">
        Supporting Images
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {aboutImages.map((image, index) => (
          <div key={index} className="relative group">
            {image ? (
              <>
                <img
                  src={
                    typeof image === "string"
                      ? image
                      : URL.createObjectURL(image)
                  }
                  alt={`Store image ${index + 1}`}
                  className="w-full h-32 object-cover rounded-xl border border-[var(--color-border-default)] cursor-pointer"
                  onClick={() => {
                    const input = document.createElement("input");
                    input.type = "file";
                    input.accept = "image/*";
                    input.onchange = (e: any) => handleImageUpload(e, index);
                    input.click();
                  }}
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(index);
                  }}
                  className="absolute top-2 right-2 bg-red-500/80 bg-red-500 text-white rounded-full p-1 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </>
            ) : (
              <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-[var(--color-border-default)] rounded-xl cursor-pointer hover:border-[var(--color-border-strong)] transition-colors">
                <Plus className="w-8 h-8 text-[var(--color-text-muted)] mb-2" />
                <span className="text-sm text-[var(--color-text-muted)]">
                  Upload Image
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, index)}
                  className="hidden"
                />
              </label>
            )}
          </div>
        ))}
      </div>
      <p className="text-sm text-[var(--color-text-secondary)]">
        {aboutImages.filter((img) => img !== null).length}/3 images uploaded
      </p>
    </div>
  </div>
);

interface SocialTabProps {
  socialLinks: SocialLinks;
  setSocialLinks: React.Dispatch<React.SetStateAction<SocialLinks>>;
}

const SocialTab: React.FC<SocialTabProps> = ({
  socialLinks,
  setSocialLinks,
}) => (
  <div className="space-y-6 text-[var(--color-text-secondary)]">
    <div className="text-center mb-8">
      <div className="w-16 h-16 bg-[var(--card-bg-2)] rounded-full flex items-center justify-center mx-auto mb-4">
        <LinkIcon className="w-8 h-8 text-[var(--card-text-2)]" />
      </div>
      <h3 className="text-lg font-semibold text-[var(--color-heading)] mb-2">
        Social Links
      </h3>
      <p className="text-[var(--color-text-secondary)]">
        Add your social media profiles
      </p>
    </div>
    {Object.keys(socialLinks).map((platform) => (
      <div key={platform}>
        <FloatingLabelInput
          type="text"
          name={platform}
          value={socialLinks[platform as keyof SocialLinks]}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSocialLinks((prev) => ({
              ...prev,
              [platform]: e.target.value,
            }))
          }
          placeholder={`${
            platform.charAt(0).toUpperCase() + platform.slice(1)
          } Username`}
        />
        {socialLinks[platform as keyof SocialLinks] && (
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            Link: https://www.{platform}.com/
            {socialLinks[platform as keyof SocialLinks]}
          </p>
        )}
      </div>
    ))}
  </div>
);

interface ExtraTabProps {
  extraInfo: ExtraInfo;
  setExtraInfo: React.Dispatch<React.SetStateAction<ExtraInfo>>;
}

const ExtraTab: React.FC<ExtraTabProps> = ({ extraInfo, setExtraInfo }) => (
  <div className="space-y-6 text-[var(--color-text-secondary)]">
    <div className="text-center mb-8">
      <div className="w-16 h-16 bg-[var(--card-bg-3)] rounded-full flex items-center justify-center mx-auto mb-4">
        <Info className="w-8 h-8 text-[var(--card-text-3)]" />
      </div>
      <h3 className="text-lg font-semibold text-[var(--color-heading)] mb-2">
        Extra Info
      </h3>
      <p className="text-[var(--color-text-secondary)]">
        Additional store policies and details
      </p>
    </div>
    <FloatingLabelInput
      type="text"
      name="deliveryTime"
      value={extraInfo.deliveryTime}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        setExtraInfo((prev) => ({ ...prev, deliveryTime: e.target.value }))
      }
      placeholder="Average Delivery Time"
    />
    <FloatingLabelTextarea
      name="policy"
      value={extraInfo.policy}
      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
        setExtraInfo((prev) => ({ ...prev, policy: e.target.value }))
      }
      placeholder="Return and Refund Policy"
    />
  </div>
);

interface FaqsTabProps {
  faqs: StoreFAQ[];
  localFaqs: LocalFAQ[];
  setLocalFaqs: React.Dispatch<React.SetStateAction<LocalFAQ[]>>;
  updateFaq: (
    id: number | string,
    field: "question" | "answer",
    value: string,
    isLocal?: boolean
  ) => void;
  removeFaq: (id: number | string, isLocal?: boolean) => Promise<void>;
  addLocalFaq: () => void;
}

const FaqsTab: React.FC<FaqsTabProps> = ({
  faqs,
  localFaqs,
  setLocalFaqs,
  updateFaq,
  removeFaq,
  addLocalFaq,
}) => (
  <div className="space-y-6 text-[var(--color-text-secondary)]">
    <div className="text-center mb-8">
      <div className="w-16 h-16 bg-[var(--card-bg-1)] rounded-full flex items-center justify-center mx-auto mb-4">
        <HelpCircle className="w-8 h-8 text-[var(--card-text-1)]" />
      </div>
      <h3 className="text-lg font-semibold text-[var(--color-heading)] mb-2">
        FAQs
      </h3>
      <p className="text-[var(--color-text-secondary)]">
        Manage your store's frequently asked questions
      </p>
    </div>
    <button
      onClick={addLocalFaq}
      className="flex items-center gap-2 font-medium text-sm px-4 py-2 bg-[var(--color-brand-primary)] text-[var(--color-on brand)] rounded-lg"
    >
      <Plus className="w-4 h-4" />
      Add FAQ
    </button>
    {faqs.length > 0 || localFaqs.length > 0 ? (
      <>
        {faqs.map((faq) => (
          <div
            key={faq.id}
            className="border border-[var(--color-border-default)] rounded-xl p-4 space-y-4"
          >
            <FloatingLabelInput
              type="text"
              name="question"
              value={faq.question}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateFaq(faq.id, "question", e.target.value)
              }
              placeholder="Question"
            />
            <FloatingLabelTextarea
              name="answer"
              value={faq.answer}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                updateFaq(faq.id, "answer", e.target.value)
              }
              placeholder="Answer"
            />
            <button
              onClick={() => removeFaq(faq.id)}
              className="flex items-center gap-2 text-red-500"
            >
              <Trash className="w-4 h-4" />
              Remove
            </button>
          </div>
        ))}
        {localFaqs.map((faq) => (
          <div
            key={faq.tempId}
            className="border border-[var(--color-border-default)] rounded-xl p-4 space-y-4"
          >
            <FloatingLabelInput
              type="text"
              name="question"
              value={faq.question}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateFaq(faq.tempId, "question", e.target.value, true)
              }
              placeholder="Question"
            />
            <FloatingLabelTextarea
              name="answer"
              value={faq.answer}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                updateFaq(faq.tempId, "answer", e.target.value, true)
              }
              placeholder="Answer"
            />
            <button
              onClick={() => removeFaq(faq.tempId, true)}
              className="flex items-center gap-2 text-red-500"
            >
              <Trash className="w-4 h-4" />
              Remove
            </button>
          </div>
        ))}
      </>
    ) : (
      <div className="text-center text-[var(--color-text-muted)]">
        <p>No FAQs yet. Click "Add FAQ" to create one.</p>
      </div>
    )}
  </div>
);

// --- Main Component ---
const Main: React.FC = () => {
  const { isAuthenticated, accessToken, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("basic");
  const [basicDetails, setBasicDetails] = useState<BasicDetails>({
    phone: "",
    store_name: "",
    description: "",
  });
  const [locationDetails, setLocationDetails] = useState<LocationDetails>({
    country: "",
    state: "",
    address: "",
  });
  const [businessCategory, setBusinessCategory] = useState<string>("");
  const [productTypes, setProductTypes] = useState<string[]>([]);
  const [isProductModalOpen, setIsProductModalOpen] = useState<boolean>(false);
  const [tempProductTypes, setTempProductTypes] = useState<string[]>([]);
  const [aboutUs, setAboutUs] = useState<AboutUs>({ story: "" });
  const [aboutImages, setAboutImages] = useState<(File | string | null)[]>(
    Array(3).fill(null)
  );
  const [socialLinks, setSocialLinks] = useState<SocialLinks>({
    twitter: "",
    facebook: "",
    tiktok: "",
    snapchat: "",
    instagram: "",
  });
  const [extraInfo, setExtraInfo] = useState<ExtraInfo>({
    deliveryTime: "",
    policy: "",
  });
  const [faqs, setFaqs] = useState<StoreFAQ[]>([]);
  const [localFaqs, setLocalFaqs] = useState<LocalFAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize active tab from localStorage only on client side
  useEffect(() => {
    const savedTab = localStorage.getItem("activeTab");
    if (savedTab) {
      setActiveTab(savedTab);
    }
  }, []);

  // Save active tab to localStorage
  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  // Check authentication
  useEffect(() => {
    if (!isAuthenticated) {
      setError("Please log in to access this page.");
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Load store + FAQs
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const store = await apiClient.getStore();
        setBasicDetails({
          store_name: store.store_name || "",
          phone: store.phone || "",
          description: store.description || "",
        });
        setLocationDetails({
          country: store.country || "",
          state: store.state || "",
          address: store.address || "",
        });
        setBusinessCategory(store.business_category || "");
        setProductTypes(store.product_types || []);
        setAboutUs({ story: store.story || "" });
        setSocialLinks({
          twitter: store.twitter || "",
          facebook: store.facebook || "",
          tiktok: store.tiktok || "",
          snapchat: store.snapchat || "",
          instagram: store.instagram || "",
        });
        setExtraInfo({
          deliveryTime: store.delivery_time || "",
          policy: store.policy || "",
        });
        setAboutImages([
          store.image_one || null,
          store.image_two || null,
          store.image_three || null,
        ]);
        const faqData = await apiClient.getFAQs();
        setFaqs(faqData);
      } catch (err: any) {
        const errorMessage = err.message || "Failed to load store data";
        setError(errorMessage);
        toast.error(errorMessage);
        if (err.status === 401) {
          setError("Session expired. Please log in again.");
          logout();
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isAuthenticated, logout]);

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    index?: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

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

    setAboutImages((prev) => {
      const newImages = [...prev];
      if (index !== undefined) {
        newImages[index] = file;
      } else {
        const availableIndex = newImages.findIndex((img) => img === null);
        if (availableIndex !== -1) {
          newImages[availableIndex] = file;
        }
      }
      return newImages;
    });
  };

  const removeImage = (index: number) => {
    setAboutImages((prev) => {
      const newImages = [...prev];
      newImages[index] = null;
      return newImages;
    });
  };

  // FAQ handlers
  const addLocalFaq = () => {
    const newFaq: LocalFAQ = {
      tempId: `temp-${Date.now()}-${Math.random()}`,
      question: "",
      answer: "",
    };
    setLocalFaqs((prev) => [...prev, newFaq]);
  };

  const updateFaq = (
    id: number | string,
    field: "question" | "answer",
    value: string,
    isLocal: boolean = false
  ) => {
    if (isLocal) {
      setLocalFaqs((prev) =>
        prev.map((faq) =>
          faq.tempId === id ? { ...faq, [field]: value } : faq
        )
      );
    } else {
      setFaqs((prev) =>
        prev.map((faq) => (faq.id === id ? { ...faq, [field]: value } : faq))
      );
    }
  };

  const removeFaq = async (id: number | string, isLocal: boolean = false) => {
    if (!isAuthenticated || !accessToken) {
      setError("Authentication failed. Please log in again.");
      logout();
      return;
    }

    if (isLocal) {
      setLocalFaqs((prev) => prev.filter((faq) => faq.tempId !== id));
    } else {
      try {
        await apiClient.deleteFAQ(id as number);
        setFaqs((prev) => prev.filter((f) => f.id !== id));
      } catch (err: any) {
        const errorMessage = err.message || "Failed to delete FAQ";
        setError(errorMessage);
        toast.error(errorMessage);
        if (err.status === 401) {
          setError("Session expired. Please log in again.");
          logout();
        }
      }
    }
  };

  const handleUpdate = async () => {
    if (!isAuthenticated || !accessToken) {
      setError("Authentication failed. Please log in again.");
      logout();
      return;
    }

    try {
      setUpdating(true);

      // Update existing FAQs
      for (const faq of faqs) {
        if (faq.question || faq.answer) {
          await apiClient.updateFAQ(faq.id, {
            question: faq.question,
            answer: faq.answer,
          });
        }
      }

      // Create new FAQs
      for (const localFaq of localFaqs) {
        if (localFaq.question || localFaq.answer) {
          const newFaq = await apiClient.addFAQ(
            localFaq.question,
            localFaq.answer
          );
          setFaqs((prev) => [...prev, newFaq]);
        }
      }
      setLocalFaqs([]); // Clear local FAQs after saving

      // Prepare FormData
      const formData = new FormData();

      // Add basic text fields
      formData.append("store_name", basicDetails.store_name);
      formData.append("phone", basicDetails.phone);
      formData.append("description", basicDetails.description);
      formData.append("country", locationDetails.country);
      formData.append("state", locationDetails.state);
      formData.append("address", locationDetails.address);
      formData.append("business_category", businessCategory);

      // Stringify product_types array
      formData.append("product_types", JSON.stringify(productTypes));

      formData.append("story", aboutUs.story);

      // Handle images properly
      const imgKeys = ["image_one", "image_two", "image_three"];
      aboutImages.forEach((image, idx) => {
        const key = imgKeys[idx];

        if (image instanceof File) {
          // New file upload
          formData.append(key, image, image.name);
        } else if (image === null) {
          // Explicitly clear the image
          formData.append(key, "");
        }
        // If image is a string (existing URL), don't append anything
        // The backend should keep the existing image
      });

      // Add social links
      formData.append("twitter", socialLinks.twitter || "");
      formData.append("facebook", socialLinks.facebook || "");
      formData.append("tiktok", socialLinks.tiktok || "");
      formData.append("snapchat", socialLinks.snapchat || "");
      formData.append("instagram", socialLinks.instagram || "");

      // Add extra info
      formData.append("delivery_time", extraInfo.deliveryTime || "");
      formData.append("policy", extraInfo.policy || "");

      console.log("Sending FormData to API...");

      // Send the update
      await apiClient.updateStoreWithImages(formData);

      toast.success("Store details updated successfully!");

      // Optionally refresh the data
      const updatedStore = await apiClient.getStore();
      setAboutImages([
        updatedStore.image_one || null,
        updatedStore.image_two || null,
        updatedStore.image_three || null,
      ]);
    } catch (err: any) {
      console.error("Update error:", err);
      const errorMessage = err.message || "Failed to update store details";
      setError(errorMessage);
      toast.error(errorMessage);

      if (err.status === 401) {
        setError("Session expired. Please log in again.");
        logout();
      }
    } finally {
      setUpdating(false);
    }
  };
  const handleCancel = () => {
    // Refresh the page or reset to original values
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-[var(--color-brand-primary)]" />
          <span className="text-[var(--color-text-secondary)]">
            Loading store details...
          </span>
        </div>
      </div>
    );
  }

  if (error && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">Error: {error}</div>
          <Link
            href="/login"
            className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors"
          >
            Go to Login
          </Link>
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
    <div className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-secondary)]">
      {/* Header */}
      <header className="sticky top-0 bg-[var(--color-bg-primary)] border-b border-[var(--color-border-default)] px-4 py-3 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
            <Link href="http://localhost:3000/dashboard/my-store/">
              <span className="font-medium text-[var(--color-text-primary)] hover:text-[var(--color-brand-primary)] transition-colors">
                Store settings
              </span>
            </Link>
            <span>›</span>
            <span>Store Details</span>
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

      <div className="pb-8">
        {/* Tab Navigation */}
        <div className="bg-[var(--color-bg)] mb-8">
          <div className="px-4 border-b border-[var(--color-border-default)] rounded-t-xl overflow-hidden">
            <nav className="flex overflow-x-auto no-scrollbar gap-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-all
                    ${
                      activeTab === tab.id
                        ? "border-[var(--color-primary)] text-[var(--color-brand-primary)]"
                        : "relative py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="py-6 md:py-8 px-4 max-w-[900px] mx-auto">
            {activeTab === "basic" && (
              <BasicTab
                basicDetails={basicDetails}
                setBasicDetails={setBasicDetails}
              />
            )}
            {activeTab === "location" && (
              <LocationTab
                locationDetails={locationDetails}
                setLocationDetails={setLocationDetails}
              />
            )}
            {activeTab === "category" && (
              <CategoryTab
                businessCategory={businessCategory}
                setBusinessCategory={setBusinessCategory}
                productTypes={productTypes}
                setProductTypes={setProductTypes}
                isProductModalOpen={isProductModalOpen}
                setIsProductModalOpen={setIsProductModalOpen}
                tempProductTypes={tempProductTypes}
                setTempProductTypes={setTempProductTypes}
              />
            )}
            {activeTab === "about" && (
              <AboutTab
                aboutUs={aboutUs}
                setAboutUs={setAboutUs}
                aboutImages={aboutImages}
                handleImageUpload={handleImageUpload}
                removeImage={removeImage}
              />
            )}
            {activeTab === "social" && (
              <SocialTab
                socialLinks={socialLinks}
                setSocialLinks={setSocialLinks}
              />
            )}
            {activeTab === "extra" && (
              <ExtraTab extraInfo={extraInfo} setExtraInfo={setExtraInfo} />
            )}
            {activeTab === "faqs" && (
              <FaqsTab
                faqs={faqs}
                localFaqs={localFaqs}
                setLocalFaqs={setLocalFaqs}
                updateFaq={updateFaq}
                removeFaq={removeFaq}
                addLocalFaq={addLocalFaq}
              />
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex max-w-[900px] mx-auto text-sm gap-3 justify-end px-4">
          <button
            className="px-6 py-3 text-[var(--color-text-secondary)] rounded-xl font-medium  hover:bg-[var(--color-bg-surface)] bg-[var(--color-bg-secondary)] transition-colors disabled:opacity-50"
            onClick={handleCancel}
            disabled={updating}
          >
            Cancel
          </button>
          <button
            className="px-6 py-3 bg-[var(--color-brand-primary)] text-[var(--color-on-brand)] justify-center rounded-xl font-medium hover:bg-[var(--color-brand-hover)] transition-colors disabled:opacity-50 flex items-center gap-2"
            onClick={handleUpdate}
            disabled={updating}
          >
            {updating && <Loader2 className="w-4 h-4 animate-spin" />}
            {updating ? "Updating..." : "Update Details"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Main;
