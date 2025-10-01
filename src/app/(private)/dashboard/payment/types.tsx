// Represents an error response from the API (e.g., DRF)
export interface ErrorResponse {
  detail?: string;
  [key: string]: any; // Allow dynamic error fields
}

export interface NameInfo {
  first_name: string;
  last_name: string;
}

export interface BvnInfo {
  bvn: string;
  dob?: string;
}

export interface NinInfo {
  nin: string;
}

export interface AddressInfo {
  state: string;
  lga: string;
  city: string;
  street: string;
}

export interface VerificationSummary {
  first_name: string;
  last_name: string;
  bvn: string;
  nin: string;
  state: string;
  lga: string;
  city: string;
  street: string;
  bvn_verified: boolean;
  nin_verified: boolean;
  status: "pending" | "verified" | "rejected";
}

