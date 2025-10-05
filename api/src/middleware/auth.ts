import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

export interface AuthRequest extends Request {
  user?: Record<string, unknown> | null;
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const auth = String(req.headers['authorization'] || '');
  if (!auth.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing token' });
    return;
  }
  const token = auth.slice('Bearer '.length);
  const payload = verifyToken(token);
  if (!payload) {
    res.status(401).json({ error: 'Invalid token' });
    return;
  }
  req.user = payload;
  next();
  return;
}

export default { requireAuth };
