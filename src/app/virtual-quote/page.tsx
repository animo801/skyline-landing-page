import type { Metadata } from 'next';
import NightLandingPage from '@/components/v2/NightLandingPage';

// Standalone landing page (for its own ad traffic). The hero button opens
// the multi-step estimate form at /virtual-quote/estimate, which ends on an
// instant price range. Pricing lives in src/lib/estimate.ts. Kept out of
// search results like /v2.
export const metadata: Metadata = {
  title: 'Instant Estimate | Skyline Smart Lighting',
  description:
    'See what permanent Christmas and accent lighting would cost for your home. Answer a few quick questions for an instant estimate.',
  robots: { index: false, follow: false },
};

export default function VirtualQuotePage() {
  return (
    <NightLandingPage
      funnel='virtual-quote'
      badge='Instant estimates · Charlotte area'
      subhead='Answer a few quick questions and see an estimated price range for your home.'
      ctaLabel='Get my instant estimate'
      ctaHref='/virtual-quote/estimate'
    />
  );
}
