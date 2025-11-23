import { SavingsProduct } from '../types';

interface FilterCriteria {
  monthlyAmount?: number;
  term?: number;
}

export function filterProducts(products: SavingsProduct[], criteria: FilterCriteria): SavingsProduct[] {
  return products.filter(product => {
    const { monthlyAmount, term } = criteria;

    if (monthlyAmount !== undefined) {
      if (monthlyAmount < product.minMonthlyAmount || monthlyAmount > product.maxMonthlyAmount) {
        return false;
      }
    }

    if (term !== undefined) {
      if (product.availableTerms !== term) {
        return false;
      }
    }

    return true;
  });
}
