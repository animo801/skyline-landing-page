import type { Metadata } from 'next';
import QuoteFlow from '@/components/quote/QuoteFlow';

// The full-page quote flow behind /v3's button: the same 4 questions as
// /quote, counted toward the v3 funnel on /funnel.
export const metadata: Metadata = {
  title: 'Get Your Free Quote | Skyline Smart Lighting',
  description:
    'Answer a few quick questions and our team will reach out with your quote for permanent lighting.',
  robots: { index: false, follow: false },
};

export default function V3QuotePage() {
  return <QuoteFlow funnel='v3' homeHref='/v3' />;
}
