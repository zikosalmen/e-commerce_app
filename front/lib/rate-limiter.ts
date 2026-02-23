// Simple in-memory rate limiter
// For production: use @upstash/ratelimit with Redis

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

// Clean up old entries every minute
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitMap.entries()) {
    if (now > value.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}, 60000);

export function checkRateLimit(identifier: string, limit: number = 10, windowMs: number = 60000): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(identifier);

  // No entry or expired entry
  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    });
    return true;
  }

  // Increment count
  if (entry.count < limit) {
    entry.count++;
    return true;
  }

  // Rate limit exceeded
  return false;
}

export function getRateLimitInfo(identifier: string): { count: number; resetTime: number } | null {
  return rateLimitMap.get(identifier) || null;
}
