const WINDOW_MS = 60_000;
const MAX_REQUESTS = 10;
const PRUNE_ABOVE = 10_000;

export type RateLimitResult =
  | { ok: true }
  | { ok: false; retryAfterSeconds: number };

// Backstop only: in production a Vercel Firewall rule rate-limits POST /api/completion before
// requests reach this function. This counter covers local runs and anything that gets past the
// rule. It lives in memory, so each server instance counts on its own and a restart resets it.
const hits = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(key: string, now: number = Date.now()): RateLimitResult {
  if (hits.size > PRUNE_ABOVE) {
    hits.forEach((entry, entryKey) => {
      if (entry.resetAt <= now) hits.delete(entryKey);
    });
  }

  const entry = hits.get(key);
  if (!entry || entry.resetAt <= now) {
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true };
  }
  if (entry.count >= MAX_REQUESTS) {
    return { ok: false, retryAfterSeconds: Math.ceil((entry.resetAt - now) / 1000) };
  }
  entry.count++;
  return { ok: true };
}
