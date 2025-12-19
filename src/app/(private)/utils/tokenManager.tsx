type TokenChangeListener = (token: string | null) => void;

class TokenManager {
  private accessToken: string | null = null;
  private listeners: Set<TokenChangeListener> = new Set();
  private isNotifying = false; // Prevent recursion during notifications

  constructor() {
    if (typeof window !== 'undefined') {
      this.accessToken = localStorage.getItem("access");
    }
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  setAccessToken(token: string | null): void {
    // Prevent unnecessary updates
    if (this.accessToken === token) return;
    
    this.accessToken = token;
    
    // Update localStorage
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem("access", token);
      } else {
        localStorage.removeItem("access");
      }
    }
    
    // Notify listeners
    this.notifyListeners(token);
  }

  private notifyListeners(token: string | null): void {
    // Prevent recursive notifications
    if (this.isNotifying) return;
    
    this.isNotifying = true;
    
    try {
      // Use setTimeout to avoid calling listeners during state updates
      setTimeout(() => {
        this.listeners.forEach((listener) => {
          try {
            listener(token);
          } catch (error) {
            console.error("Error in token change listener:", error);
          }
        });
      }, 0);
    } finally {
      this.isNotifying = false;
    }
  }

  // Subscribe to token changes
  onChange(listener: TokenChangeListener): void {
    this.listeners.add(listener);
  }

  // Unsubscribe from token changes
  offChange(listener: TokenChangeListener): void {
    this.listeners.delete(listener);
  }

  clearToken(): void {
    this.setAccessToken(null);
  }
}

export const tokenManager = new TokenManager();