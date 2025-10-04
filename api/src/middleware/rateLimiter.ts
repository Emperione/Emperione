import { Request, Response, NextFunction } from 'express';

export function rateLimiter(_req: Request, _res: Response, next: NextFunction) {
  // Placeholder for Redis-backed rate limiting
  next();
}
