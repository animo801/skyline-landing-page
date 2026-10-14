// The Pixel ID is public (it ships in the browser snippet), so it lives in
// code rather than an env var. The CAPI access token is secret and stays in
// META_CAPI_ACCESS_TOKEN.
export const META_PIXEL_ID = '250824820970697';

// Custom event sent alongside the standard Lead event when the quote form is
// submitted, so this form's leads can be told apart from other sources. It's
// sent from the server only (Conversions API) so it's never double counted.
export const META_FORM_SUBMIT_EVENT = 'Vercel LP Form Submit';

// The /virtual-quote instant estimate sends its own custom event instead,
// so those leads can be tracked and optimized for separately in Meta. (The
// standard Lead event is shared by every page.)
export const META_VIRTUAL_QUOTE_EVENT = 'Free quote submitted on Vercel site';

export function customEventNameForFunnel(funnel: unknown) {
  return funnel === 'virtual-quote'
    ? META_VIRTUAL_QUOTE_EVENT
    : META_FORM_SUBMIT_EVENT;
}

// One event ID is generated per submission and shared by the browser and
// server Lead events for deduplication. The custom event gets its own ID
// derived from it so the two event types never collide.
export function customEventIdFor(leadEventId: string) {
  return `${leadEventId}-form-submit`;
}
