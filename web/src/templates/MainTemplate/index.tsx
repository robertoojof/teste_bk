import type { ReactNode } from 'react';

type MainTemplateProps = {
  children: ReactNode;
};

export function MainTemplate({ children }: MainTemplateProps) {
  return (
    <div className='min-h-svh bg-muted/40'>
      <main className='mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8'>
        {children}
      </main>
      <footer className='pb-8 text-center text-xs text-muted-foreground'>
        BK Dashboard · valores em reais (R$)
      </footer>
    </div>
  );
}
