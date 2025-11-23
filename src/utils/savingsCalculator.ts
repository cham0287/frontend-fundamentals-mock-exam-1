/**
 * Calculates the expected total earnings (principal + interest).
 * Formula: Monthly Amount * Term * (1 + Annual Rate * 0.5)
 * Note: Annual Rate is in percent (e.g., 3.2 for 3.2%), so we divide by 100.
 * Wait, the prompt formula is: 월납입액 × 저축기간 × (1 + 연이자율 × 0.5)
 * If '연이자율' is 3.2%, is it 0.032 or 3.2?
 * Usually in these formulas, if it's just "Rate", it might mean the raw number if the formula is simplified,
 * but (1 + rate) suggests rate is a decimal (e.g. 1.032).
 * However, (1 + rate * 0.5) with rate=0.032 -> 1.016.
 * Monthly * Term * 1.016.
 * Example: 100,000 * 12 * 1.016 = 1,200,000 * 1.016 = 1,219,200.
 * Interest is 19,200.
 * Simple interest for regular deposits is usually n(n+1)/2 * r/12 * amount.
 * Let's stick strictly to the prompt's formula: "월납입액 × 저축기간 × (1 + 연이자율 × 0.5)"
 * I will assume '연이자율' means the decimal value (e.g., 3.2% -> 0.032).
 */
export function calculateEarnings(monthlyAmount: number, term: number, annualRatePercent: number): number {
  const rateDecimal = annualRatePercent / 100;
  return Math.floor(monthlyAmount * term * (1 + rateDecimal * 0.5));
}

/**
 * Calculates the recommended monthly deposit to reach a target amount.
 * Formula: Target / (Term * (1 + Rate * 0.5))
 * Result is rounded to the nearest 1,000 won.
 */
export function calculateRecommendedMonthlyDeposit(
  targetAmount: number,
  term: number,
  annualRatePercent: number
): number {
  const rateDecimal = annualRatePercent / 100;
  const rawAmount = targetAmount / (term * (1 + rateDecimal * 0.5));

  // Round to nearest 1,000
  return Math.round(rawAmount / 1000) * 1000;
}
