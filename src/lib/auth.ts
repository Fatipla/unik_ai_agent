import { compare, hash } from 'bcryptjs';
import { sign, verify } from 'jsonwebtoken';
import { env } from './env';

const JWT_SECRET = env.NEXTAUTH_SECRET;

export interface JWTPayload {
  userId: string;
  email: string;
  plan: string;
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return hash(password, 12);
}

// Verify password
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return compare(password, hashedPassword);
}

// Generate JWT token
export function generateToken(payload: JWTPayload): string {
  return sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

// Verify JWT token
export function verifyToken(token: string): JWTPayload | null {
  try {
    return verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}

// Generate email verification token
export function generateVerificationToken(email: string): string {
  return sign({ email, type: 'email_verification' }, JWT_SECRET, { expiresIn: '24h' });
}

// Verify email verification token
export function verifyVerificationToken(token: string): { email: string } | null {
  try {
    const payload = verify(token, JWT_SECRET) as any;
    if (payload.type === 'email_verification') {
      return { email: payload.email };
    }
    return null;
  } catch {
    return null;
  }
}

// Extract user from request headers
export function getUserFromHeaders(headers: Headers): JWTPayload | null {
  const authHeader = headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.substring(7);
  return verifyToken(token);
}
