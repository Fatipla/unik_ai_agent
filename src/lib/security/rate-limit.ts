// Simple in-memory rate limiter (use Redis/Upstash in production)
interface RateLimitStore {
  [key: string]: { count: number; resetAt: number };
}

const store: RateLimitStore = {};

export function rateLimit(
  identifier: string,
  maxRequests: number = 30,
  windowMs: number = 60000 // 1 minute
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const key = `${identifier}:${Math.floor(now / windowMs)}`;

  if (!store[key] || store[key].resetAt < now) {
    store[key] = {
      count: 1,
      resetAt: now + windowMs,
    };
    return { allowed: true, remaining: maxRequests - 1, resetAt: store[key].resetAt };
  }

  store[key].count++;

  if (store[key].count > maxRequests) {
    return { allowed: false, remaining: 0, resetAt: store[key].resetAt };
  }

  return {
    allowed: true,
    remaining: maxRequests - store[key].count,
    resetAt: store[key].resetAt,
  };
}

// Cleanup old entries periodically
setInterval(() => {
  const now = Date.now();
  Object.keys(store).forEach(key => {
    if (store[key].resetAt < now) {
      delete store[key];
    }
  });
}, 300000); // Every 5 minutes
