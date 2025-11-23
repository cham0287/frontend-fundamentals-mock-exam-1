import { queryOptions } from '@tanstack/react-query';
import { fetchSavingsProducts } from '../api/savings';

export const savingsQueries = {
  all: () => ['savings'] as const,
  products: () =>
    queryOptions({
      queryKey: [...savingsQueries.all(), 'products'] as const,
      queryFn: fetchSavingsProducts,
    }),
};
