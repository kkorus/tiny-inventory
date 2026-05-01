import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import type { JSX } from 'react';
import { MemoryRouter } from 'react-router-dom';

type ProvidersProps = Readonly<{
  children: ReactNode;
  initialEntries?: string[];
}>;

export function TestProviders({
  children,
  initialEntries = ['/'],
}: ProvidersProps): JSX.Element {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
    </QueryClientProvider>
  );
}
