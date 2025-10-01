export interface ErrorResponse {
  detail?: string;
  message?: string;
  [key: string]: any; // Allow other dynamic error fields
}


