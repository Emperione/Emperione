import jwt from 'jsonwebtoken';

const JWT_SECRET: jwt.Secret = (process.env['JWT_SECRET'] || 'dev-secret') as jwt.Secret;
const JWT_EXPIRES_IN = process.env['JWT_EXPIRES_IN'] || '7d';

export function signToken(payload: Record<string, unknown>) {
  return jwt.sign(payload as any, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as Record<string, unknown>;
  } catch (err) {
    return null;
  }
}

export default { signToken, verifyToken };
