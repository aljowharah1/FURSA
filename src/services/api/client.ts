// API client - handles all HTTP requests to the backend
// Automatically attaches JWT token and handles common errors

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiClient {
  private getToken(): string | null {
    return localStorage.getItem('cm_token');
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string>),
    };

    // Don't set Content-Type for FormData (browser sets it with boundary)
    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Network error' }));

      // If token is expired/invalid, clear auth state
      if (response.status === 401) {
        localStorage.removeItem('cm_token');
        localStorage.removeItem('cm_authenticated');
        window.location.reload();
      }

      throw new Error(errorData.error || `Request failed with status ${response.status}`);
    }

    return response.json();
  }

  // GET request
  async get<T>(path: string): Promise<T> {
    return this.request<T>(path, { method: 'GET' });
  }

  // POST request with JSON body
  async post<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>(path, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  // PUT request with JSON body
  async put<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>(path, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  // DELETE request
  async delete<T>(path: string): Promise<T> {
    return this.request<T>(path, { method: 'DELETE' });
  }

  // POST request with FormData (for file uploads)
  async upload<T>(path: string, formData: FormData): Promise<T> {
    return this.request<T>(path, {
      method: 'POST',
      body: formData,
    });
  }
}

export const api = new ApiClient();
