import { Suspense, useState } from 'react';
import { Border, ListHeader, ListRow, NavigationBar, SelectBottomSheet, Spacing, Tab, TextField } from 'tosslib';
import { SavingsProductItem } from '../components/SavingsProductItem';
import { SavingResult } from '../components/SavingResult';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { useSavingsProducts } from '../hooks/useSavingsProducts';
import { formatNumber, toNumericString } from '../utils/formatters';
import { filterProducts } from '../utils/productFilter';
import { calculateEarnings, calculateRecommendedMonthlyDeposit } from '../utils/savingsCalculator';
import { DEFAULT_SAVING_PERIOD_MONTHS, DEFAULT_SELECTABLE_TERMS_OPTIONS, RECOMMENDED_PRODUCTS_COUNT } from 'const';

type SavingCaculatorPageTabs = 'products' | 'results';

function SavingsCalculatorContent() {
  const { data: products } = useSavingsProducts();
  const [targetAmount, setTargetAmount] = useState<number | undefined>(undefined);
  const [monthlyAmount, setMonthlyAmount] = useState<number | undefined>(undefined);
  const [term, setTerm] = useState<number>(DEFAULT_SAVING_PERIOD_MONTHS);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<SavingCaculatorPageTabs>('products');

  const handleTargetAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = toNumericString(e.target.value);
    if (value === null) {
      return;
    }
    setTargetAmount(value === '' ? undefined : Number(value));
  };

  const handleMonthlyAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = toNumericString(e.target.value);
    if (value === null) {
      return;
    }
    setMonthlyAmount(value === '' ? undefined : Number(value));
  };

  const handleToggle = (id: string) => {
    setSelectedProductId(prev => (prev === id ? null : id));
  };

  const filteredProducts = filterProducts(products, {
    monthlyAmount: monthlyAmount,
    term: term,
  });

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

  const recommendedProducts = [...filteredProducts]
    .sort((a, b) => b.annualRate - a.annualRate)
    .slice(0, RECOMMENDED_PRODUCTS_COUNT);

  return (
    <>
      <NavigationBar title="적금 계산기" />

      <Spacing size={16} />

      <TextField
        label="목표 금액"
        placeholder="목표 금액을 입력하세요"
        suffix="원"
        value={formatNumber(targetAmount)}
        onChange={handleTargetAmountChange}
      />

      <Spacing size={16} />

      <TextField
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        suffix="원"
        value={formatNumber(monthlyAmount)}
        onChange={handleMonthlyAmountChange}
      />

      <Spacing size={16} />

      <SelectBottomSheet
        label="저축 기간"
        title="저축 기간을 선택해주세요"
        value={term}
        onChange={value => setTerm(value)}
      >
        {DEFAULT_SELECTABLE_TERMS_OPTIONS.map(term => (
          <SelectBottomSheet.Option key={term} value={term}>
            {term}개월
          </SelectBottomSheet.Option>
        ))}
      </SelectBottomSheet>

      <Spacing size={24} />

      <Border height={16} />

      <Spacing size={8} />

      <Tab onChange={value => setActiveTab(value as 'products' | 'results')}>
        <Tab.Item value="products" selected={activeTab === 'products'}>
          적금 상품
        </Tab.Item>
        <Tab.Item value="results" selected={activeTab === 'results'}>
          계산 결과
        </Tab.Item>
      </Tab>

      {activeTab === 'products' && (
        <>
          {filteredProducts.map(product => (
            <SavingsProductItem
              key={product.id}
              product={product}
              isSelected={selectedProductId === product.id}
              onSelect={() => handleToggle(product.id)}
            />
          ))}
        </>
      )}

      {activeTab === 'results' && (
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
          {recommendedProducts.map(product => (
            <SavingsProductItem
              key={product.id}
              product={product}
              isSelected={selectedProductId === product.id}
              onSelect={() => handleToggle(product.id)}
            />
          ))}
          <Spacing size={40} />
        </>
      )}
    </>
  );
}

export function SavingsCalculatorPage() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품 목록을 불러오는 중..." />} />}>
        <SavingsCalculatorContent />
      </Suspense>
    </ErrorBoundary>
  );
}
