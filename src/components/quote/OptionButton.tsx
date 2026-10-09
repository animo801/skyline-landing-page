'use client';

import { useQuoteLayout } from './QuoteLayout';

export default function OptionButton({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  const layout = useQuoteLayout();

  if (layout === 'card') {
    return (
      <button
        type='button'
        role='radio'
        aria-checked={selected}
        onClick={onClick}
        className={`min-h-14 w-full rounded-lg border bg-white px-3 py-3 text-center text-base leading-tight font-bold text-[#111] transition-colors outline-none ${
          selected
            ? 'border-skyline-blue ring-2 ring-skyline-blue'
            : 'border-black/15 hover:border-skyline-blue/60 focus-visible:ring-2 focus-visible:ring-skyline-blue'
        }`}
      >
        {label}
      </button>
    );
  }

  return (
    <button
      type='button'
      role='radio'
      aria-checked={selected}
      onClick={onClick}
      className={`min-h-[99px] w-full rounded bg-[#f0f0f0] px-6 py-5 text-center text-lg leading-[1.25] font-black text-[#111] transition-colors outline-none ${
        selected
          ? 'ring-2 ring-skyline-blue'
          : 'hover:bg-[#e8e8e8] focus-visible:ring-2 focus-visible:ring-skyline-blue'
      }`}
    >
      {label}
    </button>
  );
}
