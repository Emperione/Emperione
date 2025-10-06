import { Request, Response, NextFunction } from 'express';
import apiLogger from '../utils/logger';

export function errorHandler(err: any, req: Request, res: Response, _next: NextFunction) {
  const isDev = process.env['NODE_ENV'] !== 'production';

  const payload = {
    message: err?.message || 'Unknown error',
    stack: isDev ? err?.stack : undefined,
    meta: err?.meta || undefined,
    status: err?.status || err?.statusCode || 500,
    reqId: (req as any).id,
  };

  try {
    apiLogger.error('error', payload);
  } catch (logErr) {
    // eslint-disable-next-line no-console
    console.error('Error while logging error:', logErr, 'original error:', err);
  }

  const status = err?.status || err?.statusCode || 500;
  const body: any = { error: err?.message || 'Internal Server Error' };
  if (isDev && err?.stack) body.stack = err.stack;

  // Avoid leaking internal details in production
  if (!isDev) delete body.stack;

  res.status(status).json(body);
}
