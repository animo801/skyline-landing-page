import type { FunnelId } from './funnel';

// Home page A/B test. Visitors to "/" are split between the original page
// (A) and the single-page design at /v2 (B). The variant is kept in a
// cookie so each person keeps seeing the same version, and each variant
// reports to its own funnel on /funnel.
export const AB_COOKIE = 'skyline_lp_variant';

// How long a visitor stays in their assigned variant.
export const AB_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

// Share of new visitors who get variant B (0–1).
export const AB_SPLIT_B = 0.5;

export type Variant = 'a' | 'b';

export const VARIANTS: Record<
  Variant,
  { label: string; funnel: FunnelId; path: string }
> = {
  a: { label: 'A · Original', funnel: 'home', path: '/' },
  b: { label: 'B · New design', funnel: 'v2', path: '/v2' },
};

export function isVariant(value: unknown): value is Variant {
  return value === 'a' || value === 'b';
}
