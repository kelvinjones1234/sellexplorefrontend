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
  Upload,
  X,
  Plus,
  Trash,
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
  <div className="space-y-6">
    <FloatingLabelInput
      type="text"
      name="name"
      value={basicDetails.name}
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
  <div className="space-y-6">
    <FloatingLabelSelect
      name="country"
      value={locationDetails.country}
      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
        setLocationDetails((prev) => ({
          ...prev,
          country: e.target.value,
          state: "",
        }))
      }
      placeholder="Country"
      options={countryOptions}
    />
    <FloatingLabelSelect
      name="state"
      value={locationDetails.state}
      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
        setLocationDetails((prev) => ({ ...prev, state: e.target.value }))
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
    <FloatingLabelInput
      type="text"
      name="delivery"
      value={locationDetails.delivery}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        setLocationDetails((prev) => ({ ...prev, delivery: e.target.value }))
      }
      placeholder="Delivery Location (e.g., everywhere in Lagos)"
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
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
          setBusinessCategory(e.target.value)
        }
        placeholder="Business Category"
        options={businessCategoryOptions}
      />
      <button
        onClick={() => {
          setTempProductTypes(productTypes);
          setIsProductModalOpen(true);
        }}
        className="px-6 text-sm py-3 bg-[var(--color-primary)] text-white rounded-lg font-medium hover:bg-[var(--color-primary-hover)] transition-colors mt-4"
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
          <div className="bg-[var(--color-bg)] p-6 rounded-2xl max-w-md w-full relative">
            <button
              onClick={() => setIsProductModalOpen(false)}
              className="absolute top-4 right-4 border border-[var(--color-border)] p-1 rounded-full text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-sm text-[var(--color-text)] font-semibold mb-4">
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
            <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto">
              {filteredProductOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => handleSelectProduct(option)}
                  className={`px-3 py-1 text-sm text-[var(--color-text-secondary)] rounded-full transition-colors ${
                    tempProductTypes.includes(option)
                      ? "bg-[var(--color-primary)] text-white"
                      : "bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-bg-secondary-hover)]"
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
              className="w-full mt-6 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg font-medium text-sm"
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
  aboutImages: (File | string)[];
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
  <div className="space-y-8">
    <FloatingLabelTextarea
      name="story"
      value={aboutUs.story}
      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
        setAboutUs((prev) => ({ ...prev, story: e.target.value }))
      }
      placeholder="Your Story"
    />
    <div>
      <h3 className="font-medium text-sm text-[var(--color-text)] mb-4">
        Supporting Images
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {aboutImages.map((image, index) => (
          <div key={index} className="relative group">
            <img
              src={
                typeof image === "string" ? image : URL.createObjectURL(image)
              }
              alt={`Store image ${index + 1}`}
              className="w-full h-32 object-cover rounded-lg border border-[var(--color-border)] cursor-pointer"
              onClick={() => {
                const input = document.createElement("input");
                input.type = "file";
                input.accept = "image/*";
                input.onchange = (e) => handleImageUpload(e as any, index);
                input.click();
              }}
            />
          </div>
        ))}
        {aboutImages.length < 3 && (
          <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-[var(--color-border)] rounded-lg cursor-pointer hover:border-[var(--color-border-strong)] transition-colors">
            <Upload className="w-8 h-8 text-[var(--color-text-muted)] mb-2" />
            <span className="text-sm text-[var(--color-text-muted)]">
              Upload Image
            </span>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleImageUpload(e)}
              className="hidden"
            />
          </label>
        )}
      </div>
      <p className="text-sm text-[var(--color-text-muted)]">
        {aboutImages.length}/3 images uploaded
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
  <div className="space-y-6">
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
          <p className="text-sm text-[var(--color-text-muted)] mt-1">
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
  <div className="space-y-6">
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
  <div className="space-y-6">
    <button
      onClick={addLocalFaq}
      className="flex items-center gap-2 font-medium text-sm px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg"
    >
      <Plus className="w-4 h-4" />
      Add FAQ
    </button>
    {faqs.length > 0 || localFaqs.length > 0 ? (
      <>
        {faqs.map((faq) => (
          <div
            key={faq.id}
            className="border border-[var(--color-border)] rounded-lg p-4 space-y-4"
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
            className="border border-[var(--color-border)] rounded-lg p-4 space-y-4"
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
  const [activeTab, setActiveTab] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("activeTab") || "basic";
    }
    return "basic";
  });
  const [basicDetails, setBasicDetails] = useState<BasicDetails>({
    phone: "",
    name: "",
    description: "",
  });
  const [locationDetails, setLocationDetails] = useState<LocationDetails>({
    country: "",
    state: "",
    address: "",
    delivery: "",
  });
  const [businessCategory, setBusinessCategory] = useState<string>("");
  const [productTypes, setProductTypes] = useState<string[]>([]);
  const [isProductModalOpen, setIsProductModalOpen] = useState<boolean>(false);
  const [tempProductTypes, setTempProductTypes] = useState<string[]>([]);
  const [aboutUs, setAboutUs] = useState<AboutUs>({ story: "" });
  const [aboutImages, setAboutImages] = useState<(File | string)[]>([]);
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
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // --- Initialize component ---
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialized(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // --- Update API client token ---
  useEffect(() => {
    if (accessToken) {
      apiClient.setAccessToken(accessToken);
    }
  }, [accessToken]);

  // --- Save active tab to localStorage ---
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("activeTab", activeTab);
    }
  }, [activeTab]);

  // --- Check authentication ---
  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      setError("Please log in to access this page.");
      setLoading(false);
    }
  }, [isInitialized, isAuthenticated]);

  // --- Load store + FAQs ---
  useEffect(() => {
    if (!isInitialized || !isAuthenticated) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const store = await apiClient.getStore();
        setBasicDetails({
          name: store.name || "",
          phone: store.phone || "",
          description: store.description || "",
        });
        setLocationDetails({
          country: store.country || "",
          state: store.state || "",
          address: store.address || "",
          delivery: store.delivery || "",
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
        const images = [
          store.image_one,
          store.image_two,
          store.image_three,
        ].filter((img): img is string => !!img);
        setAboutImages(images);
        const faqData = await apiClient.getFAQs();
        setFaqs(faqData);
      } catch (err: any) {
        console.error("Failed to fetch store:", err);
        setError(err.message || "Failed to fetch store data");
        if (err.status === 401) {
          setError("Session expired. Please log in again.");
          logout();
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isInitialized, isAuthenticated, logout]);

  // --- Image upload handler ---
  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    index?: number
  ) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setAboutImages((prev) => {
      if (index !== undefined) {
        const newImages = [...prev];
        newImages[index] = files[0];
        return newImages;
      } else {
        return [...prev, ...files].slice(0, 3);
      }
    });
  };

  const removeImage = (index: number) => {
    setAboutImages((prev) => prev.filter((_, i) => i !== index));
  };

  // --- FAQ handlers ---
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
        console.error("Failed to delete FAQ:", err);
        setError(err.message || "Failed to delete FAQ");
        if (err.status === 401) {
          setError("Session expired. Please log in again.");
          logout();
        }
      }
    }
  };

  // --- Save / update store and FAQs ---
  const handleSave = async () => {
    if (!isAuthenticated || !accessToken) {
      setError("Authentication failed. Please log in again.");
      logout();
      return;
    }

    setLoading(true);
    setError(null);

    try {
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

      // Update store
      const formData = new FormData();
      formData.append("name", basicDetails.name);
      formData.append("phone", basicDetails.phone);
      formData.append("description", basicDetails.description);
      formData.append("country", locationDetails.country);
      formData.append("state", locationDetails.state);
      formData.append("address", locationDetails.address);
      formData.append("delivery", locationDetails.delivery);
      formData.append("business_category", businessCategory);
      formData.append("product_types", JSON.stringify(productTypes));
      formData.append("story", aboutUs.story);
      const imgKeys = ["image_one", "image_two", "image_three"];
      aboutImages.forEach((image, idx) => {
        if (image instanceof File) {
          formData.append(imgKeys[idx], image);
        }
      });
      formData.append("twitter", socialLinks.twitter);
      formData.append("facebook", socialLinks.facebook);
      formData.append("tiktok", socialLinks.tiktok);
      formData.append("snapchat", socialLinks.snapchat);
      formData.append("instagram", socialLinks.instagram);
      formData.append("delivery_time", extraInfo.deliveryTime);
      formData.append("policy", extraInfo.policy);

      await apiClient.updateStoreWithImages(formData);

      // Refresh images and FAQs from server
      const store = await apiClient.getStore();
      const images = [
        store.image_one,
        store.image_two,
        store.image_three,
      ].filter((img): img is string => !!img);
      setAboutImages(images);
      const faqData = await apiClient.getFAQs();
      setFaqs(faqData);

      alert("Store and FAQs updated successfully!");
    } catch (err: any) {
      console.error("Update failed:", err);
      setError(err.message || "Failed to update store or FAQs");
      if (err.status === 401) {
        setError("Session expired. Please log in again.");
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)] mx-auto mb-4"></div>
          <p>Initializing...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">
            {error || "Please log in to access this page."}
          </p>
          <button
            onClick={() => (window.location.href = "/login")}
            className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)] mx-auto mb-4"></div>
          <p>Loading data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error: {error}</p>
          <button
            onClick={() => {
              setError(null);
              setLoading(true);
              const fetchData = async () => {
                try {
                  const store = await apiClient.getStore();
                  setBasicDetails({
                    name: store.name || "",
                    phone: store.phone || "",
                    description: store.description || "",
                  });
                  setLocationDetails({
                    country: store.country || "",
                    state: store.state || "",
                    address: store.address || "",
                    delivery: store.delivery || "",
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
                  const images = [
                    store.image_one,
                    store.image_two,
                    store.image_three,
                  ].filter((img): img is string => !!img);
                  setAboutImages(images);
                  const faqData = await apiClient.getFAQs();
                  setFaqs(faqData);
                } catch (err: any) {
                  setError(err.message || "Failed to fetch store data");
                  if (err.status === 401) {
                    setError("Session expired. Please log in again.");
                    logout();
                  }
                } finally {
                  setLoading(false);
                }
              };
              fetchData();
            }}
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
      <div className="px-4 pb-8">
        <div className="bg-[var(--color-bg)] rounded-xl shadow-sm border-[var(--color-border)] mb-8">
          <div className="border-b border-[var(--color-border)] rounded-t-xl overflow-hidden">
            <nav className="flex overflow-x-auto no-scrollbar gap-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-all ${
                    activeTab === tab.id
                      ? "border-[var(--color-primary)] text-[var(--color-primary)]"
                      : "border-transparent hover:text-[var(--color-primary)]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="py-6 md:py-8 max-w-[900px] mx-auto">
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

        <div className="flex flex-col text-sm sm:flex-row gap-3 justify-end max-w-[900px] mx-auto">
          <button className="px-6 py-3 border border-[var(--color-border)] text-[var(--color-text)] rounded-lg font-medium hover:bg-[var(--color-bg-secondary)] transition-colors">
            Cancel
          </button>
          <button
            disabled={loading}
            onClick={handleSave}
            className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg font-medium hover:bg-[var(--color-primary-hover)] transition-colors disabled:opacity-50"
          >
            {loading ? "Saving..." : "Update Details"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Main;
