const STORAGE_KEY = 'skyline_test_mode';

// Test mode for trying the quote flows without creating real leads. Turn it
// on by adding ?test=1 to any page URL; it then stays on for that browser
// tab (sessionStorage) until the tab closes or a page is opened with
// ?test=0. While on, nothing is sent to GHL, Meta or the /funnel stats.
// Browser-only: call from effects or event handlers, not during render.
export function isTestMode(): boolean {
  try {
    const param = new URLSearchParams(window.location.search).get('test');
    if (param === '1') {
      sessionStorage.setItem(STORAGE_KEY, '1');
      return true;
    }
    if (param === '0') {
      sessionStorage.removeItem(STORAGE_KEY);
      return false;
    }
    return sessionStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}
