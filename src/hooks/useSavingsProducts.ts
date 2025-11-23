import { useSuspenseQuery } from '@tanstack/react-query';
import { fetchSavingsProducts } from '../api/savings';

export function useSavingsProducts() {
  return useSuspenseQuery({
    queryKey: ['savingsProducts'],
    queryFn: fetchSavingsProducts,
  });
}
