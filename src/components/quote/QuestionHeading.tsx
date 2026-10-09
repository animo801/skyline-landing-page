'use client';

import { useQuoteLayout } from './QuoteLayout';

// Zip, home stories, timeline, contact info. Update if a question is added
// or removed.
const TOTAL_QUESTIONS = 4;

export default function QuestionHeading({
  number,
  hint,
  children,
}: {
  number: number;
  // One line on why we ask, shown under the question in the card layout.
  hint?: string;
  children: React.ReactNode;
}) {
  const layout = useQuoteLayout();

  if (layout === 'card') {
    return (
      <div className='text-center'>
        <div className='flex justify-center gap-1.5' aria-hidden='true'>
          {Array.from({ length: TOTAL_QUESTIONS }, (_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i + 1 === number
                  ? 'w-6 bg-skyline-blue'
                  : i + 1 < number
                    ? 'w-1.5 bg-skyline-blue/50'
                    : 'w-1.5 bg-black/15'
              }`}
            />
          ))}
        </div>
        <p className='mt-2 text-sm text-black/50'>
          Step {number} of {TOTAL_QUESTIONS}
        </p>
        <h3 className='mt-4 text-2xl leading-tight font-black text-[#111]'>
          {children}
        </h3>
        {hint && <p className='mt-1 text-sm text-black/50'>{hint}</p>}
      </div>
    );
  }

  return (
    <>
      <p className='mt-4 text-base leading-6 font-bold text-black/50 sm:text-xl sm:leading-7'>
        Question #{number} of {TOTAL_QUESTIONS}
      </p>
      <h1 className='mt-1 text-[32px] leading-[1.15] font-black text-[#111]'>
        {children}
      </h1>
    </>
  );
}
