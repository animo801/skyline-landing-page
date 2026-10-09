'use client';

import { createContext, useContext } from 'react';

// The quote flow renders two ways: full-page on /quote ('page'), and as a
// card embedded in a landing page like /v2 ('card'). Step components read
// this to pick heading levels, spacing and option layout, so the questions
// and submit logic stay shared between the two.
export type QuoteLayout = 'page' | 'card';

const QuoteLayoutContext = createContext<QuoteLayout>('page');

export const QuoteLayoutProvider = QuoteLayoutContext.Provider;

export function useQuoteLayout() {
  return useContext(QuoteLayoutContext);
}
