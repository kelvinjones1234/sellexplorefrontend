export interface ErrorResponse {
  detail?: string;
  message?: string;
  [key: string]: any; // Allow other dynamic error fields
}

export interface DeliveryArea {
  id: number;
  location: string; // Changed from 'area' to 'location'
  delivery_fee: string; // Changed from 'fee' to 'delivery_fee'
}