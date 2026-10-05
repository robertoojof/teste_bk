import { CircleAlert } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type SkusWithoutCostAlertProps = {
  skus: string[];
};

export function SkusWithoutCostAlert({ skus }: SkusWithoutCostAlertProps) {
  if (!skus.length) return null;

  return (
    <Alert>
      <CircleAlert aria-hidden='true' />
      <AlertTitle>Produtos vendidos sem custo cadastrado</AlertTitle>
      <AlertDescription>
        O custo de {skus.join(', ')} ainda não foi informado, então o lucro do
        período pode estar superestimado.
      </AlertDescription>
    </Alert>
  );
}
