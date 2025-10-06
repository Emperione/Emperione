import { Request, Response, NextFunction } from 'express';

import redis from '../config/redis';

// Defaults (requests per window)
const ANON_LIMIT = parseInt(process.env['RATE_LIMIT_ANON'] || '60', 10); // anonymous users
const AUTH_LIMIT = parseInt(process.env['RATE_LIMIT_AUTH'] || '600', 10); // authenticated users
const WINDOW_SECONDS = parseInt(
  process.env['RATE_LIMIT_WINDOW_SECONDS'] || '60',
  10
); // window size in seconds

function getIdentifier(req: Request) {
  // Prefer authenticated subject if available (requireAuth middleware should set req.user)
  // Fallback to IP address
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const anyReq = req as any;
  if (anyReq.user && typeof anyReq.user === 'object' && anyReq.user.sub) {
    return `user:${String(anyReq.user.sub)}`;
  }

  // Use request IP (behind proxies, ensure your reverse proxy sets req.ip correctly)
  if (req.ip) return `ip:${req.ip}`;
  return `ip:unknown`;
}

export async function rateLimiter(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const identifier = getIdentifier(req);

  const isAuthenticated = (req as any).user?.sub;
  const limit = isAuthenticated ? AUTH_LIMIT : ANON_LIMIT;

  // Fixed window key per window period
  const now = Math.floor(Date.now() / 1000);
  const windowStart = Math.floor(now / WINDOW_SECONDS) * WINDOW_SECONDS;
  const key = `rate:${identifier}:${windowStart}`;

  try {
    const current = await redis.incr(key);
    if (current === 1) {
      // First request in window — set expiry
      await redis.expire(key, WINDOW_SECONDS);
    }

    const remaining = Math.max(0, limit - Number(current));
    const reset = windowStart + WINDOW_SECONDS; // epoch seconds

    // Set informative headers
    res.setHeader('X-RateLimit-Limit', String(limit));
    res.setHeader('X-RateLimit-Remaining', String(remaining));
    res.setHeader('X-RateLimit-Reset', String(reset));

    if (Number(current) > limit) {
      const retryAfter = reset - now;
      res.setHeader('Retry-After', String(retryAfter));
      res.status(429).json({ error: 'Too many requests', retryAfter });
      return;
    }

    next();
  } catch (err) {
    // Fail-open: if Redis is down, allow requests but log the issue
    // eslint-disable-next-line no-console
    console.warn(
      'Rate limiter error, allowing request (fail-open):',
      err && (err as Error).message
    );
    next();
  }
}

export default rateLimiter;
