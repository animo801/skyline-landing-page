import type { Metadata } from 'next';
import QuoteFlow from '@/components/quote/QuoteFlow';
import NightLandingPage from '@/components/v2/NightLandingPage';

// Variant B of the home page A/B test (served at "/" via proxy.ts). Kept
// out of search results since it duplicates the home page's purpose.
export const metadata: Metadata = {
  title: 'Skyline Smart Lighting | Free Quote for Permanent Christmas Lights',
  description:
    'Permanent Christmas and accent lighting you’ll never install again. Answer a few questions and our team will reach out with your estimate.',
  robots: { index: false, follow: false },
};

export default function LandingPageV2() {
  return (
    <NightLandingPage
      funnel='v2'
      badge='Free quotes · Charlotte area'
      subhead='Answer a few questions and our team will reach out to give you an estimate.'
      ctaLabel='Get your free quote'
      cardTitle='Get your free lighting quote'
      cardSubtitle='Answer 4 quick questions and our team will reach out with your estimate.'
    >
      <QuoteFlow layout='card' funnel='v2' />
    </NightLandingPage>
  );
}
