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

// How many questions the current flow asks, for "Step N of M". The
// standard quote asks 4; the /virtual-quote estimator asks more.
const QuestionCountContext = createContext(4);

export const QuestionCountProvider = QuestionCountContext.Provider;

export function useQuestionCount() {
  return useContext(QuestionCountContext);
}
