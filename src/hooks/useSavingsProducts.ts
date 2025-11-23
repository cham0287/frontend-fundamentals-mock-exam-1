import { useSuspenseQuery } from '@tanstack/react-query';
import { savingsQueries } from '../queries/savingsQueries';

export function useSavingsProducts() {
  return useSuspenseQuery(savingsQueries.products());
}
