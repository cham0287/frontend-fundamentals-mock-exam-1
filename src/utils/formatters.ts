export function formatNumber(value: number | undefined): string {
  if (value === undefined) {
    return '';
  }
  return value.toLocaleString('ko-KR');
}

export function toNumericString(value: string): string | null {
  const numericValue = value.replace(/,/g, '');
  if (isNaN(Number(numericValue))) {
    return null;
  }
  return numericValue;
}
