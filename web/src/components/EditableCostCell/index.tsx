import { Check, Loader2, Pencil, X } from 'lucide-react';
import { useState } from 'react';
import { showMessage } from '@/adapters/showMessage';
import { MoneyInput } from '@/components/MoneyInput';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useUpsertProductCost } from '@/hooks/useUpsertProductCost';
import type { ProductWithCost } from '@/models/product-cost.model';
import { formatCurrency } from '@/utils/format-currency';
import { getErrorMessages } from '@/utils/get-error-messages';

type EditableCostCellProps = {
  product: ProductWithCost;
};

export function EditableCostCell({ product }: EditableCostCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(product.unitCost ?? 0);
  const upsertCost = useUpsertProductCost();

  function startEditing() {
    setValue(product.unitCost ?? 0);
    setIsEditing(true);
  }

  function cancel() {
    setIsEditing(false);
    upsertCost.reset();
  }

  function save() {
    if (value === product.unitCost) {
      setIsEditing(false);
      return;
    }
    upsertCost.mutate(
      { productId: product.productId, unitCost: value },
      {
        onSuccess: () => {
          showMessage.success(`Custo de ${product.name} atualizado`);
          setIsEditing(false);
        },
        onError: error => showMessage.error(getErrorMessages(error).join('\n')),
      },
    );
  }

  if (isEditing) {
    return (
      <form
        className='flex items-center justify-end gap-1'
        onSubmit={event => {
          event.preventDefault();
          save();
        }}
      >
        <MoneyInput
          autoFocus
          aria-label={`Custo de ${product.name}`}
          className='w-32 text-right'
          value={value}
          onValueChange={setValue}
          disabled={upsertCost.isPending}
          onKeyDown={event => {
            if (event.key === 'Escape') {
              event.preventDefault();
              cancel();
            }
          }}
        />
        <Button
          type='submit'
          size='icon-sm'
          aria-label='Salvar custo'
          disabled={upsertCost.isPending}
        >
          {upsertCost.isPending ? (
            <Loader2 aria-hidden='true' className='animate-spin' />
          ) : (
            <Check aria-hidden='true' />
          )}
        </Button>
        <Button
          type='button'
          variant='ghost'
          size='icon-sm'
          aria-label='Cancelar edição'
          onClick={cancel}
          disabled={upsertCost.isPending}
        >
          <X aria-hidden='true' />
        </Button>
      </form>
    );
  }

  return (
    <div className='flex items-center justify-end gap-2'>
      {product.unitCost === null ? (
        <Badge variant='outline'>Sem custo</Badge>
      ) : (
        <span className='font-medium tabular-nums'>
          {formatCurrency(product.unitCost)}
        </span>
      )}
      <Button
        variant='outline'
        size='icon-sm'
        aria-label={`Editar custo de ${product.name}`}
        onClick={startEditing}
      >
        <Pencil aria-hidden='true' />
      </Button>
    </div>
  );
}
