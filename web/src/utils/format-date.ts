import { format, isValid, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

function toDate(value: string): Date {
  const date = parseISO(value);
  if (!isValid(date)) {
    throw new Error(`Invalid date: ${value}`);
  }
  return date;
}

export function formatDate(value: string): string {
  return format(toDate(value), 'dd/MM/yyyy', { locale: ptBR });
}

export function formatDateTime(value: string): string {
  return format(toDate(value), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
}
