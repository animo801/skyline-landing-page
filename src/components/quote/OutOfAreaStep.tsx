'use client';

import { useQuoteLayout } from './QuoteLayout';

export default function OutOfAreaStep({ onRetry }: { onRetry: () => void }) {
  const isCard = useQuoteLayout() === 'card';
  const Heading = isCard ? 'h3' : 'h1';
  return (
    <div className={isCard ? 'py-4 text-center' : 'mt-10'}>
      <Heading
        className={`${isCard ? 'text-2xl' : 'text-[32px]'} leading-[1.15] font-black text-[#111]`}
      >
        So sorry!
      </Heading>
      <p className='mt-3 text-lg leading-relaxed text-black/70'>
        We only operate within an hour of Charlotte, NC. If you think there
        was an error with our website, give us a call and we&rsquo;d be happy
        to help you.
      </p>

      <button
        type='button'
        onClick={onRetry}
        className='mt-8 h-14 w-full bg-skyline-blue text-base font-bold text-white transition-colors hover:bg-skyline-blue/90'
      >
        Try different zip code
      </button>
    </div>
  );
}
