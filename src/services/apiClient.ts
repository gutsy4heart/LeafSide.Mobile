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
  console.log('[API] Building URL:', { baseUrl, path, fullUrl });
  return fullUrl;
};

export async function apiFetch<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { method = 'GET', body, token, headers, signal } = options;
  const url = buildUrl(path);
  
  console.log(`[API] ${method} ${url}`);
  
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
      console.error(`[API] Error ${response.status}:`, payload);
      throw new LeafSideApiError(
        typeof payload === 'string' ? payload : 'LeafSide API request failed',
        response.status,
        payload,
      );
    }

    console.log(`[API] Success:`, Array.isArray(payload) ? `${payload.length} items` : 'OK');
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

