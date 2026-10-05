const integerFormatter = new Intl.NumberFormat('pt-BR');

export function formatNumber(value: number): string {
  return integerFormatter.format(value);
}
