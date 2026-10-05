export function normalizeSpaces(text: string | null | undefined) {
  return (text ?? '').replace(/\s/g, ' ');
}
