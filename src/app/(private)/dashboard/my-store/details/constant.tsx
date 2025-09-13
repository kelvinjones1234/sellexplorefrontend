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

import { Option, Tab } from "./types";

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