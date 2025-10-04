import { Request, Response, NextFunction } from 'express';

export function validator(_req: Request, _res: Response, next: NextFunction) {
  // Placeholder for request validation using Zod/Joi
  next();
}
