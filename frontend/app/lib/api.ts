import { getToken } from './auth';

const rawBaseUrl = process.env.NEXT_PUBLIC_API_URL;

function getBaseUrl(): string {
  if (!rawBaseUrl) return '';
  return rawBaseUrl.replace(/\/+$/, '');
}

export async function apiFetch<T>(
  path: string,
  options?: {
    method?: string;
    body?: unknown;
    auth?: boolean;
    cache?: RequestCache;
  },
): Promise<T> {
  const baseUrl = getBaseUrl();
  if (!baseUrl) {
    throw new Error('Не задан NEXT_PUBLIC_API_URL');
  }

  const url = `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (options?.auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    method: options?.method ?? 'GET',
    headers,
    body: options?.body ? JSON.stringify(options.body) : undefined,
    cache: options?.cache ?? 'no-store',
  });

  const text = await res.text();
  const data = text ? (JSON.parse(text) as unknown) : null;

  if (!res.ok) {
    const msg =
      (data && typeof data === 'object' && 'message' in data && (data as any).message) ||
      `Ошибка ${res.status}`;
    throw new Error(Array.isArray(msg) ? msg.join(', ') : String(msg));
  }

  return data as T;
}

