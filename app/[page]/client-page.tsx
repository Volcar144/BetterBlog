'use client';

import { useTina } from 'tinacms/dist/react';
import { Blocks } from '@/components/blocks';
import { PageQuery } from '@/tina/__generated__/types';
import ErrorBoundary from '@/components/error-boundary';

export interface ClientPageProps {
  data: {
    page: PageQuery['page'];
  };
  variables: {
    relativePath: string;
  };
  query: string;
}

export default function ClientPage(props: ClientPageProps) {
  const { data } = useTina({ ...props });

  if (!data?.page) return null;

  return (
    <ErrorBoundary>
      <Blocks {...data.page} />
    </ErrorBoundary>
  );
}
