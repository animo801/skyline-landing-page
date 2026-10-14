// Instant estimate for /virtual-quote, from the client's guidance:
//   - ~2,000 sq ft, front of the house only: $3,000–$5,000
//   - ~4,000 sq ft, full wraparound: $9,000–$12,000
//   - 4,000+ sq ft full wrap: $10,000+, up to ~$15,000
//   - a second story adds about 30%
// The per-square-foot rates below reproduce those ranges. Used by both the
// browser and /api/quote, so the range a visitor sees is always the one
// sent to GHL. Adjust the numbers here to change every estimate.
export const ESTIMATE_PRICING = {
  // Dollars per square foot of home, low and high end of the range.
  perSqFt: {
    front: { low: 1.5, high: 2.5 },
    full: { low: 2.25, high: 3 },
  },
  // Assumes the client's ranges are single-story prices.
  twoStoryMultiplier: 1.3,
  // No estimate goes below this, however small the home.
  minimumPrice: 2500,
  // Estimates are rounded to the nearest multiple of this.
  roundTo: 500,
} as const;

export type Coverage = keyof typeof ESTIMATE_PRICING.perSqFt;

export const COVERAGE_OPTIONS: { value: Coverage; label: string }[] = [
  { value: 'front', label: 'Front of the house' },
  { value: 'full', label: 'Full wraparound' },
];

export function isCoverage(value: unknown): value is Coverage {
  return value === 'front' || value === 'full';
}

// Accepted home sizes; anything outside is almost certainly a typo.
export const SQUARE_FEET_MIN = 500;
export const SQUARE_FEET_MAX = 20000;

export function isValidSquareFeet(value: unknown): value is number {
  return (
    typeof value === 'number' &&
    Number.isInteger(value) &&
    value >= SQUARE_FEET_MIN &&
    value <= SQUARE_FEET_MAX
  );
}

export type Estimate = { low: number; high: number };

export function calculateEstimate({
  squareFeet,
  coverage,
  stories,
}: {
  squareFeet: number;
  coverage: Coverage;
  stories: 'single' | 'two';
}): Estimate {
  const { perSqFt, twoStoryMultiplier, minimumPrice, roundTo } =
    ESTIMATE_PRICING;
  const rate = perSqFt[coverage];
  const multiplier = stories === 'two' ? twoStoryMultiplier : 1;
  const round = (amount: number) => Math.round(amount / roundTo) * roundTo;

  const low = Math.max(minimumPrice, round(squareFeet * rate.low * multiplier));
  // Always show a real range, even when the minimum price kicks in.
  const high = Math.max(
    low + roundTo,
    round(squareFeet * rate.high * multiplier)
  );
  return { low, high };
}

export function formatUsd(amount: number) {
  return amount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });
}

export function formatEstimate({ low, high }: Estimate) {
  return `${formatUsd(low)} – ${formatUsd(high)}`;
}
