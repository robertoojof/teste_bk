import { ApiError } from '@/services/http/api-error';

export function getErrorMessages(error: unknown): string[] {
  if (error instanceof ApiError) return error.messages;
  if (error instanceof Error && error.message) return [error.message];
  return ['Erro inesperado'];
}
