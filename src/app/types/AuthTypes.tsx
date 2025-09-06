// ===== USER TYPES =====
export interface UserDataType {
  email: string;
  store_name: string;
  location: string;
  niche: string;
  full_name: string;
}

// Only used when submitting registration form
export interface RegistrationData {
  email: string;
  store_name: string;
  password: string;
  location: string;
  niche: string;
  full_name: string;
}

// Vendor profile generation
export interface VendorBioData {
  store_name: string;
  location: string;
  niche: string;
}

// ===== TOKENS =====
export interface AuthTokens {
  access: string;
  refresh: string;
}

// ===== FORM ERRORS =====
export interface FormErrors {
  email?: string;
  store_name?: string;
  password?: string;
  full_name?: string;
  location?: string;
  niche?: string;
  global?: string;
}
// ===== CONTEXT TYPE =====
export interface AuthContextType {
  user: UserDataType | null;
  authTokens: AuthTokens | null;
  loading: boolean;
  error: string | null;

  // generateVendorBio: (data: VendorBioData) => void;
  login: (
    email: string,
    password: string,
    rememberMe: boolean
  ) => Promise<boolean>;
  register: (
    email: string,
    store_name: string,
    password: string,
    location: string,
    niche: string,
    full_name: string
  ) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;

  // Optional subscription
  subscriptionType?: string;
  setSubscriptionType?: (type: string) => void;
}
