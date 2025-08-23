// API service for communicating with AWS API Gateway
// Update this URL after deploying your infrastructure

const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:3000';

export interface APIError {
  error: string;
  message?: string;
}

export class APIService {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  // Authentication endpoints
  async requestMagicLink(email: string): Promise<{ success: boolean; message: string }> {
    return this.request('/auth', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  // Incidents endpoints
  async getIncidents(params: {
    page?: number;
    per_page?: number;
    status?: string;
    severity?: string;
    brand?: string;
    market?: string;
    since?: string;
    until?: string;
  } = {}): Promise<{
    incidents: any[];
    total: number;
    page: number;
    per_page: number;
  }> {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    const endpoint = `/incidents${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.request(endpoint, { method: 'GET' });
  }

  // Reports endpoints
  async submitIncidentReport(report: {
    title: string;
    description: string;
    severity: string;
    brand: string;
    market: string;
    affectedSystems: string[];
    customerImpact: string;
    reporterEmail: string;
    reporterName: string;
    urgentNotification: boolean;
  }): Promise<{ success: boolean; id: string; message: string }> {
    return this.request('/reports', {
      method: 'POST',
      body: JSON.stringify(report),
    });
  }

  // Chat endpoints
  async sendChatMessage(message: string, userScope: {
    brands: string[];
    markets: string[];
  }): Promise<{
    success: boolean;
    message: {
      id: string;
      type: string;
      content: string;
      timestamp: string;
      data?: any;
    };
  }> {
    return this.request('/chat', {
      method: 'POST',
      body: JSON.stringify({ message, user_scope: userScope }),
    });
  }
}

// Create a singleton instance
export const apiService = new APIService();

// Export the class for testing or custom instances
export default APIService; 