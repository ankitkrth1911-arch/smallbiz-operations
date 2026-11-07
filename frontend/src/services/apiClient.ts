const DEFAULT_API_BASE_URL = import.meta.env.PROD
  ? 'https://smallbiz-operations.onrender.com'
  : 'http://localhost:8000';

const BASE_URL = (import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL).trim();

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(status: number, message: string, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${BASE_URL.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };

  const token = typeof window !== 'undefined' ? localStorage.getItem('smallbiz_auth_token') : null;
  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }


  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorData: any = null;
      try {
        errorData = await response.json();
      } catch {
        errorData = await response.text();
      }
      throw new ApiError(
        response.status,
        errorData?.detail || `HTTP error ${response.status}: ${response.statusText}`,
        errorData
      );
    }

    // Check for 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(0, (error as Error).message || 'Network connection failed');
  }
}

