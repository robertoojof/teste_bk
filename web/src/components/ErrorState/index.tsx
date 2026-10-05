import { RotateCw, TriangleAlert } from 'lucide-react';
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { getErrorMessages } from '@/utils/get-error-messages';

type ErrorStateProps = {
  error: unknown;
  onRetry?: () => void;
};

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <Alert variant='destructive'>
      <TriangleAlert aria-hidden='true' />
      <AlertTitle>Não foi possível carregar os dados</AlertTitle>
      <AlertDescription>{getErrorMessages(error).join(' ')}</AlertDescription>
      {onRetry && (
        <AlertAction>
          <Button variant='outline' size='sm' onClick={onRetry}>
            <RotateCw aria-hidden='true' />
            Tentar novamente
          </Button>
        </AlertAction>
      )}
    </Alert>
  );
}
