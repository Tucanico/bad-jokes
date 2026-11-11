import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 10;
const PRUNE_ABOVE = 10_000;

export type RateLimitResult =
  | { ok: true }
  | { ok: false; retryAfterSeconds: number };

// Shared by every server instance once Upstash is configured. Vercel's Upstash integration sets
// the KV_REST_API_* names and a direct Upstash setup the UPSTASH_REDIS_REST_* ones;
// Redis.fromEnv() reads either.
const hasUpstash =
  Boolean(process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL) &&
  Boolean(process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN);

// One quick retry and a 1 s cap: with the defaults (5 retries with backoff) an unreachable
// Upstash held every joke request for over 4 seconds before the fallback kicked in.
const shared = hasUpstash
  ? new Ratelimit({
      redis: Redis.fromEnv({ retry: { retries: 1, backoff: () => 100 } }),
      limiter: Ratelimit.slidingWindow(MAX_REQUESTS, "1 m"),
      prefix: "bad-jokes:completion",
      timeout: 1000,
    })
  : null;

export async function rateLimit(key: string): Promise<RateLimitResult> {
  if (shared) {
    try {
      const result = await shared.limit(key);
      // On a timeout Upstash answers "success" without having counted the request, so fall
      // through to the local counter instead of trusting it.
      if (result.reason !== "timeout") {
        return result.success
          ? { ok: true }
          : {
              ok: false,
              retryAfterSeconds: Math.max(1, Math.ceil((result.reset - Date.now()) / 1000)),
            };
      }
    } catch (error) {
      // An Upstash outage shouldn't take jokes down with it.
      console.error("Shared rate limit unavailable, using the in-memory one", error);
    }
  }
  return memoryRateLimit(key);
}

// Used when Upstash isn't configured or doesn't answer. Kept in memory, so each server instance
// counts on its own and a restart resets it: it stops one client hammering a warm instance, but it
// isn't a hard global cap.
const hits = new Map<string, { count: number; resetAt: number }>();

export function memoryRateLimit(key: string, now: number = Date.now()): RateLimitResult {
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
