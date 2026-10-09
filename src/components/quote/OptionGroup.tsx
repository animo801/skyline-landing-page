'use client';

import { useQuoteLayout } from './QuoteLayout';

// Wraps a question's answer buttons: a stacked list full-page, a compact
// two-column grid in the card layout.
export default function OptionGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  const layout = useQuoteLayout();
  return (
    <div
      role='radiogroup'
      aria-label={label}
      className={
        layout === 'card'
          ? 'mt-5 grid grid-cols-2 gap-3'
          : 'mt-8 flex flex-col gap-4'
      }
    >
      {children}
    </div>
  );
}
