'use client';

import { formatUsd } from '@/lib/estimate';
import { useQuoteLayout } from './QuoteLayout';
import type { Estimate } from '@/lib/estimate';

// Final screen of /virtual-quote: the estimated price range for their home.
export default function EstimateResultStep({
  firstName,
  estimate,
}: {
  firstName: string;
  estimate: Estimate | null;
}) {
  const isCard = useQuoteLayout() === 'card';
  return (
    <div className={isCard ? 'py-2 text-center' : 'mt-10 text-center'}>
      <p className='text-sm font-bold tracking-[0.12em] text-black/50 uppercase'>
        {firstName ? `${firstName}, your` : 'Your'} estimate
      </p>
      {estimate ? (
        <p className='mt-2 text-[34px] leading-tight font-black text-[#111] sm:text-4xl'>
          {formatUsd(estimate.low)}
          <span className='text-black/30'> – </span>
          {formatUsd(estimate.high)}
        </p>
      ) : (
        <p className='mt-2 text-2xl font-black text-[#111]'>
          We&rsquo;ll send your estimate shortly
        </p>
      )}
      <p className='mx-auto mt-4 max-w-sm text-base leading-relaxed text-black/70'>
        Our team will reach out soon to confirm the details. Your final price
        is confirmed after a free look at your home.
      </p>
      <p className='mt-4 text-xs text-black/40'>
        Estimates are based on your answers and typical installs, and may vary
        with your home&rsquo;s roofline.
      </p>
    </div>
  );
}
