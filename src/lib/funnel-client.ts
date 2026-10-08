import { randomId } from './uuid';

const SESSION_KEY = 'funnel_session_id';
const VISITOR_KEY = 'funnel_visitor_id';

// Session ids (sessionStorage) power the per-step funnel counts; the
// visitor id (localStorage) outlives the tab, so the same person coming
// back tomorrow still counts as one unique visitor.
function getId(storage: Storage, key: string): string {
  let id = storage.getItem(key);
  if (!id) {
    id = randomId();
    storage.setItem(key, id);
  }
  return id;
}

// Best-effort log to the funnel on /funnel. Uses sendBeacon so a CTA
// click still gets recorded even though the page navigates away right
// after. Never throws — tracking must not break the page.
export function logFunnelEvent(eventName: string) {
  try {
    const sessionId = getId(sessionStorage, SESSION_KEY);
    let visitorId = sessionId;
    try {
      visitorId = getId(localStorage, VISITOR_KEY);
    } catch {
      // localStorage blocked — fall back to the session id.
    }
    const payload = JSON.stringify({ sessionId, visitorId, eventName });
    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        '/api/funnel-event',
        new Blob([payload], { type: 'application/json' })
      );
    } else {
      fetch('/api/funnel-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        keepalive: true,
      }).catch(() => {});
    }
  } catch {
    // sessionStorage can throw in some private modes — skip the event.
  }
}
