import { Input } from '@/components/ui/input';
import { centsFromDigits } from '@/utils/cents-from-digits';
import { formatCurrency } from '@/utils/format-currency';

type MoneyInputProps = {
  value: number;
  onValueChange: (cents: number) => void;
} & Omit<React.ComponentProps<'input'>, 'value' | 'onChange' | 'type'>;

export function MoneyInput({
  value,
  onValueChange,
  ...props
}: MoneyInputProps) {
  return (
    <Input
      type='text'
      inputMode='numeric'
      autoComplete='off'
      {...props}
      value={formatCurrency(value)}
      onChange={event => onValueChange(centsFromDigits(event.target.value))}
    />
  );
}
