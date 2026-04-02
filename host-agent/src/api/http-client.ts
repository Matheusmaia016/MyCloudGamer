import { logger } from '../logger/index.js';

export async function apiRequest<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    const text = await response.text();
    logger.error({ status: response.status, body: text }, 'Falha em request ao backend');
    throw new Error(`Backend request failed: ${response.status}`);
  }

  return (await response.json()) as T;
}
