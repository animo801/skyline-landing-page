import type { Metadata } from 'next';
import QuoteFlow from '@/components/quote/QuoteFlow';

export const metadata: Metadata = {
  title: 'Get Your Free Quote | Skyline Smart Lighting',
  description:
    "Answer a few quick questions and our team will call you to discuss permanent Christmas lighting options.",
};

export default function QuotePage() {
  return <QuoteFlow />;
}
