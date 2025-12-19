// import {api} from "@/constant/baseUrl"
// import { API_BASE_URL } from "@/constant/baseUrl";

// class APIClient {
//   private static instance: APIClient;

//   // Singleton pattern is fine, but state management is now gone
//   private constructor() {}

//   static getInstance(): APIClient {
//     if (!APIClient.instance) {
//       APIClient.instance = new APIClient();
//     }
//     return APIClient.instance;
//   }

//   // --- Helper to extract data or throw error ---
//   // Axios throws automatically on non-2xx, but we can standardize the error format
//   private handleResponse<T>(response: any): T {
//     return response.data;
//   }

//   // --- Logo API methods ---
//   async getLogo(): Promise<any> {
//     // No manual token headers needed!
//     const response = await api.get(`${API_BASE_URL}/logo/`);
//     return this.handleResponse(response);
//   }

//   async updateLogo(logo: File): Promise<any> {
//     const formData = new FormData();
//     formData.append("logo", logo);
    
//     // Axios handles FormData Content-Type automatically
//     const response = await api.put(`${API_BASE_URL}/logo/`, formData, {
//       headers: { "Content-Type": "multipart/form-data" },
//     });
//     return this.handleResponse(response);
//   } 

//   // --- Cover Image API methods ---
//   async getCover(): Promise<any> {
//     const response = await api.get(`${API_BASE_URL}/cover/`);
//     return this.handleResponse(response);
//   }

//   async updateCover(cover_image: File): Promise<any> {
//     const formData = new FormData();
//     formData.append("cover_image", cover_image);
    
//     const response = await api.put(`${API_BASE_URL}/cover/`, formData, {
//       headers: { "Content-Type": "multipart/form-data" },
//     });
//     return this.handleResponse(response);
//   }
// }

// export const apiClient = APIClient.getInstance();









import { api } from "@/constant/baseUrl";

class APIClient {
  private static instance: APIClient;

  private constructor() {}

  static getInstance(): APIClient {
    if (!APIClient.instance) {
      APIClient.instance = new APIClient();
    }
    return APIClient.instance;
  }

  // --- Helper to extract data ---
  private handleResponse<T>(response: any): T {
    return response.data;
  }

  // --- Logo API methods ---
  async getLogo(): Promise<any> {
    const response = await api.get("/logo/"); 
    return this.handleResponse(response);
  }

  async updateLogo(logo: File): Promise<any> {
    const formData = new FormData();
    formData.append("logo", logo);
    
    // CORRECT: Just use "/logo/"
    const response = await api.put("/logo/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return this.handleResponse(response);
  } 

  // --- Cover Image API methods ---
  async getCover(): Promise<any> {
    const response = await api.get("/cover/");
    return this.handleResponse(response);
  }

  async updateCover(cover_image: File): Promise<any> {
    const formData = new FormData();
    formData.append("cover_image", cover_image);
    
    const response = await api.put("/cover/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return this.handleResponse(response);
  }
}

export const apiClient = APIClient.getInstance();