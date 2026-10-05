const MAX_DIGITS = 12;

export function centsFromDigits(text: string): number {
  const digits = text.replace(/\D/g, '').slice(0, MAX_DIGITS);
  return digits ? Number.parseInt(digits, 10) : 0;
}
