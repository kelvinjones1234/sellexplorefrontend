import { api } from "@/constant/baseUrl";
import { ErrorResponse, Product, ProductOption, CategoryResponse } from "./types";
import { AxiosError } from "axios";

class APIClient {
  private static instance: APIClient;

  private constructor() {}

  static getInstance(): APIClient {
    if (!APIClient.instance) {
      APIClient.instance = new APIClient();
    }
    return APIClient.instance;
  }

  // --- Helper: Standardize Error Handling ---
  private async request<T>(promise: Promise<any>): Promise<T> {
    try {
      const response = await promise;
      return response.data;
    } catch (error: any) {
      const axiosError = error as AxiosError<ErrorResponse>;
      let message = "An unexpected error occurred";

      if (axiosError.response?.data) {
        const data = axiosError.response.data;
        message = data.detail || data.message || message;
      } else if (axiosError.message) {
        message = axiosError.message;
      }

      throw new Error(message);
    }
  }

  // --- Product Methods ---

  async postProduct(product: Product): Promise<Product> {
    const formData = new FormData();

    // Basic product fields
    formData.append("name", product.details.name);
    formData.append("category", product.details.category);
    formData.append("description", product.details.description);
    formData.append("price", product.details.price);
    
    if (product.details.discountPrice) {
      formData.append("discount_price", product.details.discountPrice);
    }
    
    formData.append("quantity", product.details.quantity);
    formData.append("availability", product.details.availability ? "true" : "false");
    formData.append("featured", product.details.featured ? "true" : "false");
    formData.append("recent", product.details.recent ? "true" : "false");
    formData.append("hot_deal", product.details.hot_deal ? "true" : "false");
    formData.append("extra_info", product.details.extraInfo);

    // Images
    product.images.forEach((img, idx) => {
      if (img.file) {
        formData.append(`images[${idx}][image]`, img.file);
        formData.append(
          `images[${idx}][is_thumbnail]`,
          idx === product.thumbnailIndex ? "true" : "false"
        );
      }
    });

    // Options
    const optionsForBackend = (product.details.options || []).map((option) => ({
      options: option.options || [],
      as_template: option.as_template || false,
      template_name: option.template_name || null,
      note: option.note ? option.note.note : null,
    }));
    
    formData.append("options", JSON.stringify(optionsForBackend));
    
    // Debug logging
    console.log("FormData entries:", Object.fromEntries(formData as any));

    // FIX: Explicitly set header to multipart/form-data
    return this.request(
      api.post("/products/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
    );
  }

  async getOptionTemplates(): Promise<ProductOption[]> {
    return this.request(api.get("/product-options/"));
  }

  // --- Category Methods ---

  async getCategories(): Promise<CategoryResponse[]> {
    return this.request(api.get("/categories/"));
  }

  async postCategory(name: string, image: File | null): Promise<CategoryResponse> {
    const formData = new FormData();
    formData.append("name", name);
    if (image) {
      formData.append("image", image);
    }

    // FIX: Explicitly set header to multipart/form-data
    return this.request(
      api.post("/categories/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
    );
  }

  // --- Utility ---
  isAuthenticated(): boolean {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem("access");
  }
}

export const apiClient = APIClient.getInstance();







// import { api } from "@/constant/baseUrl";
// import { ErrorResponse, Product, ProductOption, CategoryResponse } from "./types";
// import { AxiosError } from "axios";

// class APIClient {
//   private static instance: APIClient;

//   private constructor() {}

//   static getInstance(): APIClient {
//     if (!APIClient.instance) {
//       APIClient.instance = new APIClient();
//     }
//     return APIClient.instance;
//   }

//   // --- Helper: Standardize Error Handling ---
//   private async request<T>(promise: Promise<any>): Promise<T> {
//     try {
//       const response = await promise;
//       return response.data;
//     } catch (error: any) {
//       const axiosError = error as AxiosError<ErrorResponse>;
//       let message = "An unexpected error occurred";

//       if (axiosError.response?.data) {
//         const data = axiosError.response.data;
//         message = data.detail || data.message || message;
//       } else if (axiosError.message) {
//         message = axiosError.message;
//       }

//       throw new Error(message);
//     }
//   }

//   // --- Product Methods ---

//   async postProduct(product: Product): Promise<Product> {
//     const formData = new FormData();

//     // Basic product fields
//     formData.append("name", product.details.name);
//     formData.append("category", product.details.category);
//     formData.append("description", product.details.description);
//     formData.append("price", product.details.price);
    
//     if (product.details.discountPrice) {
//       formData.append("discount_price", product.details.discountPrice);
//     }
    
//     formData.append("quantity", product.details.quantity);
//     formData.append("availability", product.details.availability ? "true" : "false");
//     formData.append("featured", product.details.featured ? "true" : "false");
//     formData.append("recent", product.details.recent ? "true" : "false");
//     formData.append("hot_deal", product.details.hot_deal ? "true" : "false");
//     formData.append("extra_info", product.details.extraInfo);

//     // Images
//     product.images.forEach((img, idx) => {
//       if (img.file) {
//         // Ensure your Django view handles nested keys like "images[0][image]"
//         formData.append(`images[${idx}][image]`, img.file);
//         formData.append(
//           `images[${idx}][is_thumbnail]`,
//           idx === product.thumbnailIndex ? "true" : "false"
//         );
//       }
//     });

//     // Options
//     const optionsForBackend = (product.details.options || []).map((option) => ({
//       options: option.options || [],
//       as_template: option.as_template || false,
//       template_name: option.template_name || null,
//       note: option.note ? option.note.note : null,
//     }));
    
//     // NOTE: Ensure your Django view parses this JSON string manually from request.POST.get('options')
//     formData.append("options", JSON.stringify(optionsForBackend));
    
//     // ✅ CORRECT: Do NOT manually set Content-Type for FormData
//     // The interceptor will still add the Authorization header automatically.
//     return this.request(
//       api.post("/products/", formData)
//     );
//   }

//   async getOptionTemplates(): Promise<ProductOption[]> {
//     return this.request(api.get("/product-options/"));
//   }

//   // --- Category Methods ---

//   async getCategories(): Promise<CategoryResponse[]> {
//     return this.request(api.get("/categories/"));
//   }

//   async postCategory(name: string, image: File | null): Promise<CategoryResponse> {
//     const formData = new FormData();
//     formData.append("name", name);
//     if (image) {
//       formData.append("image", image);
//     }

//     // ✅ CORRECT: Let Axios handle the headers/boundary
//     return this.request(
//       api.post("/categories/", formData)
//     );
//   }

//   // --- Utility ---
//   isAuthenticated(): boolean {
//     if (typeof window === "undefined") return false;
//     return !!localStorage.getItem("access");
//   }
// }

// export const apiClient = APIClient.getInstance();