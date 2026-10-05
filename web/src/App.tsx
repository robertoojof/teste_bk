import { QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { createQueryClient } from '@/lib/query-client';
import { Home } from '@/pages/Home';
import './styles/global.css';

export function App() {
  const [queryClient] = useState(createQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Home />
        <Toaster position='top-center' richColors closeButton />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
