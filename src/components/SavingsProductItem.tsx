import { Assets, colors, ListRow } from 'tosslib';
import { SavingsProduct } from '../types';
import { formatNumber } from '../utils/formatters';

interface SavingsProductItemProps {
  product: SavingsProduct;
  isSelected: boolean;
  onSelect: () => void;
}

export function SavingsProductItem({ product, isSelected, onSelect }: SavingsProductItemProps) {
  return (
    <ListRow
      contents={
        <ListRow.Texts
          type="3RowTypeA"
          top={product.name}
          topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
          middle={`연 이자율: ${product.annualRate}%`}
          middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
          bottom={`${formatNumber(product.minMonthlyAmount)}원 ~ ${formatNumber(product.maxMonthlyAmount)}원 | ${product.availableTerms}개월`}
          bottomProps={{ fontSize: 13, color: colors.grey600 }}
        />
      }
      right={isSelected ? <Assets.Icon name="icon-check-circle-green" /> : null}
      onClick={onSelect}
    />
  );
}
