// Instant estimate for /virtual-quote. Pricing from the client:
//   - Front of the house, per square foot of home:
//       single-story $0.80–$1.10, two-story $1.00–$1.30
//   - Adding the back costs 65% of the front price on top
//   - Adding the sides costs another 80% of the front price on top
//   - The range shown is never wider than $2,000
// Used by both the browser and /api/quote, so the range a visitor sees is
// always the one sent to GHL. Adjust the numbers here to change every
// estimate.
export const ESTIMATE_PRICING = {
  // Front-of-house dollars per square foot, low and high end of the range.
  frontPerSqFt: {
    single: { low: 0.8, high: 1.1 },
    two: { low: 1.0, high: 1.3 },
  },
  // Each coverage option's price as a multiple of the front-only price:
  // the back adds 65% of the front, the sides another 80%.
  coverageMultiplier: {
    front: 1,
    'front-back': 1 + 0.65,
    full: 1 + 0.65 + 0.8,
  },
  // Widest range ever shown: the high end is capped at low + this.
  maxRange: 2000,
  // Estimates are rounded to the nearest multiple of this.
  roundTo: 100,
} as const;

export type Coverage = keyof typeof ESTIMATE_PRICING.coverageMultiplier;

export const COVERAGE_OPTIONS: { value: Coverage; label: string }[] = [
  { value: 'front', label: 'Front only' },
  { value: 'front-back', label: 'Front + back' },
  { value: 'full', label: 'Front, back + sides' },
];

export function isCoverage(value: unknown): value is Coverage {
  return COVERAGE_OPTIONS.some((option) => option.value === value);
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
  const { frontPerSqFt, coverageMultiplier, maxRange, roundTo } =
    ESTIMATE_PRICING;
  const rate = frontPerSqFt[stories];
  const multiplier = coverageMultiplier[coverage];
  const round = (amount: number) => Math.round(amount / roundTo) * roundTo;

  const low = round(squareFeet * rate.low * multiplier);
  const high = Math.min(
    low + maxRange,
    // Always a real range, even for very small homes.
    Math.max(low + roundTo, round(squareFeet * rate.high * multiplier))
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
