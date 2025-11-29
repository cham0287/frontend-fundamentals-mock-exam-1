import { ListRow } from 'tosslib';
import { SavingsProductItem } from './SavingsProductItem';

import { SavingsProduct } from '../types';

interface SavingsProductListProps {
  products: SavingsProduct[];
  selectedProductId: string | null;
  onToggle: (id: string) => void;
}

// 필터링 하는 로직을 구현하는 방법들
// 1. 부모 컴포넌트에서 상태를 관리하고, 자식 컴포넌트에 props로 전달하는 방법
// 2. Props drilling을 피하기 위해 Global state로 관리하는 방법 -> 최악의 방법
// 3. 영속성 저장소에 저장한다. (새로고침, ...)
// 4. url에 상태를 저장한다.
export function SavingsProductList({ products, selectedProductId, onToggle }: SavingsProductListProps) {
  return (
    <>
      {products.map(product => (
        <SavingsProductItem
          key={product.id}
          product={product}
          isSelected={selectedProductId === product.id}
          onSelect={() => onToggle(product.id)}
        />
      ))}
    </>
  );
}

// NOTE: 이런 Loading Skeleton fallback 등은 결국 SavingsProductList와 강하게 의존될 수 밖에 없다.
// 따라서 이런 경우에는 의존 관계를 명확하게 표시해주기 위해 컴포넌트 내부에 Dot Notation으로 묶어두는 것이 좋다.
SavingsProductList.Loading = function Loading() {
  return <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품 목록을 불러오는 중..." />} />;
};
