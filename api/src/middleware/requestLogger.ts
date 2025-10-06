import { Request, Response, NextFunction } from 'express';
import { randomBytes } from 'crypto';
import apiLogger from '../utils/logger';

// Simple request id generator
function genReqId() {
  return randomBytes(6).toString('hex');
}

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  const reqId = genReqId();
  (req as any).id = reqId;

  apiLogger.info('request:start', { id: reqId, method: req.method, path: req.path });

  res.on('finish', () => {
    const duration = Date.now() - start;
    apiLogger.info('request:finish', { id: reqId, method: req.method, path: req.path, status: res.statusCode, duration });
  });

  next();
}

export default requestLogger;
