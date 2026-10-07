'use client';

import { usePathname } from 'next/navigation';
import Footer from './Footer';

// Quote flow steps render as full-screen, app-like questionnaire screens
// (per the Figma design) with no site chrome, so the marketing footer is
// hidden there. The internal /funnel dashboard doesn't need it either.
const HIDDEN_ON_PREFIXES = ['/quote', '/funnel'];

export default function ConditionalFooter() {
  const pathname = usePathname();

  if (HIDDEN_ON_PREFIXES.some((prefix) => pathname?.startsWith(prefix))) {
    return null;
  }

  return <Footer />;
}
