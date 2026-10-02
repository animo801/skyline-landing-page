'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Script from 'next/script';
import { META_PIXEL_ID } from '@/lib/meta';

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

// Fires a Pixel event if the Pixel has loaded. The base snippet installs a
// queueing stub immediately, so calls made before fbevents.js finishes
// loading are still delivered.
export function trackMetaEvent(
  event: string,
  params?: Record<string, unknown>,
  options?: { eventID?: string }
) {
  window.fbq?.('track', event, params ?? {}, options ?? {});
}

export function trackMetaCustomEvent(
  event: string,
  params?: Record<string, unknown>,
  options?: { eventID?: string }
) {
  window.fbq?.('trackCustom', event, params ?? {}, options ?? {});
}

export default function MetaPixel() {
  const pathname = usePathname();
  const isFirstRender = useRef(true);

  // The base snippet tracks the initial PageView; client-side navigations
  // after that don't reload the page, so track them here. Quote steps only
  // change the query string, so they don't count as new page views.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    trackMetaEvent('PageView');
  }, [pathname]);

  return (
    <Script id='meta-pixel' strategy='afterInteractive'>
      {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init','${META_PIXEL_ID}');
fbq('track','PageView');`}
    </Script>
  );
}
