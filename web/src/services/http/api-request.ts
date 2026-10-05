import { env } from '@/config/env';
import { ApiError } from './api-error';

type ErrorBody = {
  message?: string | string[];
};

function extractMessages(body: ErrorBody | null): string[] {
  if (Array.isArray(body?.message)) return body.message;
  if (body?.message) return [body.message];
  return ['Erro inesperado'];
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${env.apiUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
  } catch {
    throw new ApiError(0, ['Erro ao conectar com o servidor.']);
  }

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(response.status, extractMessages(body));
  }

  return body as T;
}
