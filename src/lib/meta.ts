// The Pixel ID is public (it ships in the browser snippet), so it lives in
// code rather than an env var. The CAPI access token is secret and stays in
// META_CAPI_ACCESS_TOKEN.
export const META_PIXEL_ID = '250824820970697';

// Custom event fired alongside the standard Lead event when the quote form
// is submitted, so this form's leads can be told apart from other sources.
export const META_FORM_SUBMIT_EVENT = 'Vercel LP Form Submit';

// Browser and server copies of each event must share an event ID for Meta to
// deduplicate them. One ID is generated per submission; the custom event's ID
// is derived from it so the two event types never collide.
export function customEventIdFor(leadEventId: string) {
  return `${leadEventId}-form-submit`;
}
