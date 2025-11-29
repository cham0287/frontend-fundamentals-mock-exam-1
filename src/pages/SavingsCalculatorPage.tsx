import { Suspense, useState } from 'react';
import { Border, NavigationBar, SelectBottomSheet, Spacing, Tab, TextField } from 'tosslib';
import { z } from 'zod';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { formatNumber } from '../utils/formatters';
import { DEFAULT_SAVING_PERIOD_MONTHS, DEFAULT_SELECTABLE_TERMS_OPTIONS } from 'const';
import { SavingsProductList } from '../components/SavingsProductList';
import { SavingsResults } from '../components/SavingsResults';
import { SuspenseQuery } from '@suspensive/react-query';
import { savingsQueries } from '../queries/savingsQueries';
import { SavingsProduct } from '../types';

type SavingCaculatorPageTabs = 'products' | 'results';

export function SavingsCalculatorPage() {
  const [targetAmount, setTargetAmount] = useState<number | undefined>(undefined);
  const [monthlyAmount, setMonthlyAmount] = useState<number | undefined>(undefined);
  const [term, setTerm] = useState<number>(DEFAULT_SAVING_PERIOD_MONTHS);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  // NOTE: 아래 상태 같은 간단한 경우도 useView 같은 훅으로 분리해주는 것이 좋음.
  // 이유: 이런 view 상태를 처리하는 로직은 zustand, jotai, urlParams, 로컬 스토리지 등 여러가지 방법으로 변할 수도 있다.
  // 그렇게 변경사항이 있을 때마다 SavingsCalculatorPage를 건드리지 않기 위해서는 이런 간단한 로직도 분리하는 것이 좋음.
  const [activeTab, setActiveTab] = useState<SavingCaculatorPageTabs>('products');

  const numericStringSchema = z
    .string()
    .transform(val => val.replace(/,/g, ''))
    .pipe(
      z
        .literal('')
        .transform(() => undefined)
        .or(z.string().transform(Number).pipe(z.number().nonnegative()))
    );

  const handleTargetAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsed = numericStringSchema.safeParse(e.target.value);
    if (parsed.success) {
      setTargetAmount(parsed.data);
    }
  };

  const handleMonthlyAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsed = numericStringSchema.safeParse(e.target.value);
    if (parsed.success) {
      setMonthlyAmount(parsed.data);
    }
  };

  const handleToggle = (id: string) => {
    setSelectedProductId(prev => (prev === id ? null : id));
  };

  const filters = [createFilterByMonthlyAmount(monthlyAmount), createFilterByTerm(term)];
  const orderBy = (products: SavingsProduct[]) => [...products].sort((a, b) => b.annualRate - a.annualRate);

  const selectProducts = (products: SavingsProduct[]) => {
    const filtered = products.filter(product => filters.every(filter => filter(product)));
    return orderBy(filtered);
  };

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
        <ErrorBoundary>
          <Suspense fallback={<SavingsProductList.Loading />}>
            <SuspenseQuery {...savingsQueries.products()} select={selectProducts}>
              {({ data: products }) => (
                <SavingsProductList products={products} selectedProductId={selectedProductId} onToggle={handleToggle} />
              )}
            </SuspenseQuery>
          </Suspense>
        </ErrorBoundary>
      )}

      {activeTab === 'results' && (
        <ErrorBoundary>
          <Suspense fallback={<SavingsResults.Loading />}>
            <SuspenseQuery {...savingsQueries.products()} select={selectProducts}>
              {({ data: products }) => (
                <SavingsResults
                  products={products}
                  monthlyAmount={monthlyAmount}
                  term={term}
                  targetAmount={targetAmount}
                  selectedProductId={selectedProductId}
                  onToggle={handleToggle}
                />
              )}
            </SuspenseQuery>
          </Suspense>
        </ErrorBoundary>
      )}
    </>
  );
}

const createFilterByMonthlyAmount = (monthlyAmount: number | undefined) => (product: SavingsProduct) => {
  if (monthlyAmount === undefined) {
    return true;
  }
  return monthlyAmount >= product.minMonthlyAmount && monthlyAmount <= product.maxMonthlyAmount;
};

const createFilterByTerm = (term: number | undefined) => (product: SavingsProduct) => {
  if (term === undefined) {
    return true;
  }
  return product.availableTerms === term;
};
