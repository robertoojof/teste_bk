import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { showMessage } from '@/adapters/showMessage';
import { FormField } from '@/components/FormField';
import { MoneyInput } from '@/components/MoneyInput';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useCreateProduct } from '@/hooks/useCreateProduct';
import {
  CreateProductSchema,
  type CreateProductValues,
} from '@/schemas/create-product.schema';
import { ApiError } from '@/services/http/api-error';
import { getErrorMessages } from '@/utils/get-error-messages';

type CreateProductDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const emptyValues: CreateProductValues = { name: '', sku: '', price: 0 };

export function CreateProductDialog({
  open,
  onOpenChange,
}: CreateProductDialogProps) {
  const createProduct = useCreateProduct();
  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<CreateProductValues>({
    resolver: zodResolver(CreateProductSchema),
    defaultValues: emptyValues,
  });

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      reset(emptyValues);
      createProduct.reset();
    }
    onOpenChange(nextOpen);
  }

  function onSubmit(values: CreateProductValues) {
    createProduct.mutate(values, {
      onSuccess: product => {
        showMessage.success(`Produto ${product.name} cadastrado`);
        handleOpenChange(false);
      },
      onError: error => {
        if (error instanceof ApiError && error.status === 409) {
          setError('sku', { message: 'Este SKU já está cadastrado' });
          return;
        }
        showMessage.error(getErrorMessages(error).join('\n'));
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo produto</DialogTitle>
          <DialogDescription>
            O SKU deve ser o mesmo código enviado pela plataforma nos pedidos.
          </DialogDescription>
        </DialogHeader>

        <form
          id='create-product-form'
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className='flex flex-col gap-4'
        >
          <FormField
            id='product-name'
            label='Nome'
            error={errors.name?.message}
          >
            <Input
              id='product-name'
              placeholder='Camiseta Básica'
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'product-name-error' : undefined}
              {...register('name')}
            />
          </FormField>
          <FormField id='product-sku' label='SKU' error={errors.sku?.message}>
            <Input
              id='product-sku'
              placeholder='P-001'
              aria-invalid={!!errors.sku}
              aria-describedby={errors.sku ? 'product-sku-error' : undefined}
              {...register('sku')}
            />
          </FormField>
          <FormField
            id='product-price'
            label='Preço de venda'
            error={errors.price?.message}
          >
            <Controller
              control={control}
              name='price'
              render={({ field }) => (
                <MoneyInput
                  id='product-price'
                  name={field.name}
                  ref={field.ref}
                  value={field.value}
                  onValueChange={field.onChange}
                  onBlur={field.onBlur}
                  aria-invalid={!!errors.price}
                  aria-describedby={
                    errors.price ? 'product-price-error' : undefined
                  }
                />
              )}
            />
          </FormField>
        </form>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant='outline'>Cancelar</Button>
          </DialogClose>
          <Button
            type='submit'
            form='create-product-form'
            disabled={createProduct.isPending}
          >
            {createProduct.isPending && (
              <Loader2 aria-hidden='true' className='animate-spin' />
            )}
            Cadastrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
