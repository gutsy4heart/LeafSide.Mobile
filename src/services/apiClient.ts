import { getApiBaseUrl } from '@/config/env';

export class LeafSideApiError extends Error {
  status: number;
  payload?: unknown;

  constructor(message: string, status: number, payload?: unknown) {
    super(message);
    this.status = status;
    this.payload = payload;
  }
}

interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  token?: string | null;
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

const buildUrl = (path: string) => {
  const baseUrl = getApiBaseUrl();
  const normalized = path.startsWith('/') ? path : `/${path}`;
  const fullUrl = `${baseUrl}${normalized}`;
  return fullUrl;
};

export async function apiFetch<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { method = 'GET', body, token, headers, signal } = options;
  const url = buildUrl(path);
  
  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      signal,
    });

    let payload: unknown = null;
    const text = await response.text();
    if (text) {
      try {
        payload = JSON.parse(text);
      } catch {
        payload = text;
      }
    }

    if (!response.ok) {
      // Better error message extraction
      let errorMessage = 'LeafSide API request failed';
      if (typeof payload === 'string') {
        errorMessage = payload;
      } else if (payload && typeof payload === 'object') {
        if (Array.isArray(payload)) {
          // Identity errors format
          errorMessage = payload.map((e: any) => e.description || e.code || JSON.stringify(e)).join('\n');
        } else if ('error' in payload) {
          errorMessage = (payload as any).error;
        } else if ('message' in payload) {
          errorMessage = (payload as any).message;
        }
      }
      
      throw new LeafSideApiError(
        errorMessage,
        response.status,
        payload,
      );
    }

    // Handle empty response (void)
    if (payload === null || payload === '') {
      return undefined as T;
    }
    return payload as T;
  } catch (error) {
    if (error instanceof LeafSideApiError) {
      throw error;
    }
    console.error(`[API] Network error:`, error);
    throw new LeafSideApiError(
      error instanceof Error ? error.message : 'Network request failed',
      0,
      error,
    );
  }
}

