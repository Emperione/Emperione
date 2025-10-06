import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodTypeAny } from 'zod';

function handleParse(resultKey: 'body' | 'query' | 'params', schema: ZodSchema<ZodTypeAny>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse((req as any)[resultKey]);

      // Attach parsed value back to the request. We also expose a `validated` bag for convenience.
      (req as any)[resultKey] = parsed;
      (req as any).validated = { ...(req as any).validated, [resultKey]: parsed };

      next();
      return;
    } catch (err: any) {
      return res.status(400).json({ error: err.errors || err.message });
    }
  };
}

export function validateBody(schema: ZodSchema<any>) {
  return handleParse('body', schema);
}

export function validateQuery(schema: ZodSchema<any>) {
  return handleParse('query', schema);
}

export function validateParams(schema: ZodSchema<any>) {
  return handleParse('params', schema);
}

export default { validateBody, validateQuery, validateParams };
