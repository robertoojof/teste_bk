import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { normalizeSpaces } from '@/test/normalize-spaces';
import { MoneyInput } from '..';

function ControlledMoneyInput({ onChange }: { onChange: (v: number) => void }) {
  const [value, setValue] = useState(0);
  return (
    <MoneyInput
      aria-label='Preço'
      value={value}
      onValueChange={cents => {
        setValue(cents);
        onChange(cents);
      }}
    />
  );
}

describe('MoneyInput', () => {
  it('formats the value in cents as currency', () => {
    render(
      <MoneyInput aria-label='Preço' value={4990} onValueChange={() => {}} />,
    );

    expect(
      normalizeSpaces(screen.getByLabelText('Preço').getAttribute('value')),
    ).toBe('R$ 49,90');
  });

  it('builds the value in cents while typing digits', async () => {
    const onChange = vi.fn();
    render(<ControlledMoneyInput onChange={onChange} />);
    const input = screen.getByLabelText('Preço');

    await userEvent.type(input, '4990');

    expect(onChange).toHaveBeenLastCalledWith(4990);
    expect(normalizeSpaces((input as HTMLInputElement).value)).toBe('R$ 49,90');
  });
});
