export interface ErrorResponse {
  detail?: string;
  message?: string;
}

export interface Store {
  id?: number;
  name: string;
  phone?: string;
  description?: string;
  country?: string;
  state?: string;
  address?: string;
  business_category?: string;
  product_types?: string[];
  story?: string;
  image_one?: string | null;
  image_two?: string | null;
  image_three?: string | null;
  twitter?: string;
  facebook?: string;
  tiktok?: string;
  snapchat?: string;
  instagram?: string;
  delivery_time?: string;
  policy?: string;
}

export interface StoreFAQ {
  id: number;
  question: string;
  answer: string;
}

export interface Option {
  value: string;
  label: string;
}

export interface BasicDetails {
  phone: string;
  name: string;
  description: string;
}

export interface LocationDetails {
  country: string;
  state: string;
  address: string;
}

export interface SocialLinks {
  twitter: string;
  facebook: string;
  tiktok: string;
  snapchat: string;
  instagram: string;
}

export interface ExtraInfo {
  deliveryTime: string;
  policy: string;
}

export interface AboutUs {
  story: string;
}

export interface Tab {
  id: string;
  label: string;
  icon: any;
}

export interface LocalFAQ {
  tempId: string;
  question: string;
  answer: string;
}

export interface Customer {
  id: number;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  purchases: number;
  volume: string;
}

export interface OrderItem {
  id: number;
  product: {
    id: number;
    name: string;
    price: number;
  };
  option?: string;
  quantity: number;
  price: number;
  discount_price?: number;
  subtotal: number;
}

export interface Order {
  updated_at: string | number | Date;
  id: number;
  customer: Customer[];
  delivery_area?: {
    id: number;
    location: string;
  };
  recipient_type: string;
  order_notes?: string;
  status: string;
  subtotal_amount: number;
  discount_amount: number;
  total_amount: number;
  created_at: string;
  items: OrderItem[];
}
