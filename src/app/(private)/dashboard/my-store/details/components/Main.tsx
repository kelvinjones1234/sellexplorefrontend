"use client";

import React, { useState, useEffect } from "react";
import {
  Store,
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
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import FloatingLabelInput from "@/app/component/fields/Input";
import FloatingLabelTextarea from "@/app/component/fields/Textarea";
import FloatingLabelSelect from "@/app/component/fields/Selection";

// --- Interfaces ---
interface Option {
  value: string;
  label: string;
}

interface BasicDetails {
  phone: string;
  name: string;
  description: string;
}

interface LocationDetails {
  country: string;
  state: string;
  address: string;
  delivery: string;
}

interface SocialLinks {
  twitter: string;
  facebook: string;
  tiktok: string;
  snapchat: string;
  instagram: string;
}

interface ExtraInfo {
  deliveryTime: string;
  policy: string;
}

interface FAQ {
  id: number;
  question: string;
  answer: string;
}

interface Image {
  id: number;
  url: string;
  name: string;
}

interface AboutUs {
  story: string;
}

interface Tab {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

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
  { id: "basic", label: "Basic Details", icon: Store },
  { id: "location", label: "Location Details", icon: MapPin },
  { id: "category", label: "Business Category", icon: Briefcase },
  { id: "about", label: "About Us", icon: Type },
  { id: "social", label: "Social Links", icon: LinkIcon },
  { id: "extra", label: "Extra Info", icon: Info },
  { id: "faqs", label: "FAQs", icon: HelpCircle },
];

// --- Tab Components ---

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

            <FloatingLabelInput
              type="text"
              name={`search`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={`Search items`}
            />

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
  aboutImages: Image[];
  handleImageUpload: (
    event: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<Image[]>>
  ) => void;
  removeImage: (
    id: number,
    setter: React.Dispatch<React.SetStateAction<Image[]>>
  ) => void;
  setAboutImages: React.Dispatch<React.SetStateAction<Image[]>>;
}

const AboutTab: React.FC<AboutTabProps> = ({
  aboutUs,
  setAboutUs,
  aboutImages,
  handleImageUpload,
  removeImage,
  setAboutImages,
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
        {aboutImages.map((image) => (
          <div key={image.id} className="relative group">
            <img
              src={image.url}
              alt={image.name}
              className="w-full h-32 object-cover rounded-lg border border-[var(--color-border)]"
            />
            <button
              onClick={() => removeImage(image.id, setAboutImages)}
              className="absolute -top-2 -right-2 bg-[var(--color-primary)] text-[var(--color-bg)] rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
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
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleImageUpload(e, setAboutImages)
              }
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
  faqs: FAQ[];
  addFaq: () => void;
  updateFaq: (id: number, field: "question" | "answer", value: string) => void;
  removeFaq: (id: number) => void;
}

const FaqsTab: React.FC<FaqsTabProps> = ({
  faqs,
  addFaq,
  updateFaq,
  removeFaq,
}) => (
  <div className="space-y-6">
    <button
      onClick={addFaq}
      className="flex items-center gap-2 font-medium text-sm px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg"
    >
      <Plus className="w-4 h-4" />
      Add FAQ
    </button>
    {faqs.map((faq) => (
      <div
        key={faq.id}
        className="border border-[var(--color-border)] rounded-lg p-4 space-y-4"
      >
        <FloatingLabelInput
          type="text"
          value={faq.question}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            updateFaq(faq.id, "question", e.target.value)
          }
          placeholder="Question"
        />
        <FloatingLabelTextarea
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
  </div>
);

// --- Main Component ---
const Main: React.FC = () => {
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
  const [aboutImages, setAboutImages] = useState<Image[]>([]);
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
  const [faqs, setFaqs] = useState<FAQ[]>([]);

  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  const handleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<Image[]>>
  ) => {
    const files = Array.from(event.target.files || []);
    if (setter === setAboutImages && aboutImages.length + files.length <= 3) {
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          if (e.target?.result) {
            setter((prev) => [
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

  const removeImage = (
    id: number,
    setter: React.Dispatch<React.SetStateAction<Image[]>>
  ) => {
    setter((prev) => prev.filter((img) => img.id !== id));
  };

  const addFaq = () => {
    setFaqs((prev) => [...prev, { id: Date.now(), question: "", answer: "" }]);
  };

  const updateFaq = (
    id: number,
    field: "question" | "answer",
    value: string
  ) => {
    setFaqs((prev) =>
      prev.map((faq) => (faq.id === id ? { ...faq, [field]: value } : faq))
    );
  };

  const removeFaq = (id: number) => {
    setFaqs((prev) => prev.filter((faq) => faq.id !== id));
  };

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
                setAboutImages={setAboutImages}
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
                addFaq={addFaq}
                updateFaq={updateFaq}
                removeFaq={removeFaq}
              />
            )}
          </div>
        </div>

        <div className="flex flex-col text-sm sm:flex-row gap-3 justify-end max-w-[900px] mx-auto">
          <button className="px-6 py-3 border border-[var(--color-border)] text-[var(--color-text)] rounded-lg font-medium hover:bg-[var(--color-bg-secondary)] transition-colors">
            Cancel
          </button>
          <button className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg font-medium hover:bg-[var(--color-primary-hover)] transition-colors">
            Update Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default Main;
