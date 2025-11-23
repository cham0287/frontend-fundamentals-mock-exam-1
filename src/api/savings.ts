import { http } from 'tosslib';
import { SavingsProduct } from '../types';

export async function fetchSavingsProducts(): Promise<SavingsProduct[]> {
  const response = await http.get<SavingsProduct[]>('/api/savings-products');
  return response;
}
