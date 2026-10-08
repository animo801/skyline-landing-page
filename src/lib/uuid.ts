// crypto.randomUUID only exists in newer browsers (e.g. Safari 15.4+), and
// older iPhones — including Facebook/Instagram's in-app browsers on them —
// throw when it's called. Fall back to getRandomValues, then Math.random.
export function randomId(): string {
  try {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      const bytes = crypto.getRandomValues(new Uint8Array(16));
      bytes[6] = (bytes[6] & 0x0f) | 0x40;
      bytes[8] = (bytes[8] & 0x3f) | 0x80;
      const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0'));
      return `${hex.slice(0, 4).join('')}-${hex.slice(4, 6).join('')}-${hex
        .slice(6, 8)
        .join('')}-${hex.slice(8, 10).join('')}-${hex.slice(10).join('')}`;
    }
  } catch {
    // Fall through to the Math.random version below.
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}
