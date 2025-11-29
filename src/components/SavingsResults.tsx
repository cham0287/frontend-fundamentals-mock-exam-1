import { Border, ListHeader, ListRow, Spacing } from 'tosslib';
import { SavingResult } from './SavingResult';
import { SavingsProductItem } from './SavingsProductItem';

import { calculateEarnings, calculateRecommendedMonthlyDeposit } from '../utils/savingsCalculator';
import { formatNumber } from '../utils/formatters';
import { RECOMMENDED_PRODUCTS_COUNT } from 'const';

import { SavingsProduct } from '../types';

interface SavingsResultsProps {
  products: SavingsProduct[];
  monthlyAmount: number | undefined;
  term: number;
  targetAmount: number | undefined;
  selectedProductId: string | null;
  onToggle: (id: string) => void;
}

export function SavingsResults({
  products,
  monthlyAmount,
  term,
  targetAmount,
  selectedProductId,
  onToggle,
}: SavingsResultsProps) {
  const selectedProduct = products.find(p => p.id === selectedProductId);

  const expectedEarnings = selectedProduct
    ? calculateEarnings(monthlyAmount ?? 0, term, selectedProduct.annualRate)
    : 0;

  const difference = (targetAmount ?? 0) - expectedEarnings;

  const recommendedMonthlyAmount = selectedProduct
    ? calculateRecommendedMonthlyDeposit(targetAmount ?? 0, term, selectedProduct.annualRate)
    : 0;

  const savingCalculationResults = [
    {
      label: '예상 수익 금액',
      value: `${formatNumber(expectedEarnings)}원`,
    },
    {
      label: '목표 금액과의 차이',
      value: `${difference > 0 ? '-' : ''}${formatNumber(Math.abs(difference))}원`,
    },
    {
      label: '추천 월 납입 금액',
      value: `${formatNumber(recommendedMonthlyAmount)}원`,
    },
  ];

  const recommendedProducts = products.slice(0, RECOMMENDED_PRODUCTS_COUNT);

  return (
    <>
      <Spacing size={8} />
      {!selectedProduct ? (
        <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} />
      ) : (
        <>
          {savingCalculationResults.map(({ label, value }) => (
            <SavingResult key={label} label={label} value={value} />
          ))}
        </>
      )}

      <Spacing size={8} />
      <Border height={16} />
      <Spacing size={8} />

      <ListHeader title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>} />
      <Spacing size={12} />
      {recommendedProducts.map((product: SavingsProduct) => (
        <SavingsProductItem
          key={product.id}
          product={product}
          isSelected={selectedProductId === product.id}
          onSelect={() => onToggle(product.id)}
        />
      ))}
      <Spacing size={40} />
    </>
  );
}

SavingsResults.Loading = function Loading() {
  return <ListRow contents={<ListRow.Texts type="1RowTypeA" top="계산 결과를 불러오는 중..." />} />;
};
