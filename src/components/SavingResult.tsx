import { colors, ListRow } from 'tosslib';

interface SavingResultProps {
  label: string;
  value: string;
}

export function SavingResult({ label, value }: SavingResultProps) {
  return (
    <ListRow
      contents={
        <ListRow.Texts
          type="2RowTypeA"
          top={label}
          topProps={{ color: colors.grey600 }}
          bottom={value}
          bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
        />
      }
    />
  );
}
