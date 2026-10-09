'use client';

import { useQuoteLayout } from './QuoteLayout';

export default function ThankYouStep({ firstName }: { firstName: string }) {
  const isCard = useQuoteLayout() === 'card';
  const Heading = isCard ? 'h3' : 'h1';
  return (
    <div className={isCard ? 'py-4 text-center' : 'mt-10'}>
      <Heading
        className={`${isCard ? 'text-2xl' : 'text-[32px]'} leading-[1.15] font-black text-[#111]`}
      >
        Thanks{firstName ? `, ${firstName}` : ''}!
      </Heading>
      <p className='mt-3 text-lg leading-relaxed text-black/70'>
        In around 10 minutes, our team will call you to discuss options and
        see if we&rsquo;re a good fit.
      </p>
    </div>
  );
}
