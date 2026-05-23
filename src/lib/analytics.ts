const ANALYTICS_KEY = "stepforward-events";

export function trackEvent(name: string, payload: Record<string, string>) {
  try {
    const stored: unknown[] = JSON.parse(localStorage.getItem(ANALYTICS_KEY) ?? "[]");
    stored.push({ event: name, ...payload, ts: new Date().toISOString() });
    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(stored));
  } catch {
    // ignore
  }
}
