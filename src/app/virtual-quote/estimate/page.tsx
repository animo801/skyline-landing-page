import type { Metadata } from 'next';
import QuoteFlow from '@/components/quote/QuoteFlow';

// The full-page, multi-step estimate form behind /virtual-quote's hero
// button. Same layout as the original /quote flow, with the estimator's
// extra questions and an instant price range at the end.
export const metadata: Metadata = {
  title: 'Get Your Instant Estimate | Skyline Smart Lighting',
  description:
    'Answer a few quick questions about your home to see an estimated price for permanent lighting.',
  robots: { index: false, follow: false },
};

export default function VirtualQuoteEstimatePage() {
  return (
    <QuoteFlow
      funnel='virtual-quote'
      questions='estimator'
      homeHref='/virtual-quote'
    />
  );
}
