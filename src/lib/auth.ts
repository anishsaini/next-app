import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface JWTPayload {
  id: string;
  email: string;
  username: string;
}

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '6h' });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

export function getTokenFromRequest(req: NextRequest): string | null {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.split(' ')[1];
}

export function getTokenFromCookie(req: NextRequest): string | null {
  return req.cookies.get('token')?.value || null;
}

export async function authenticateUser(req: NextRequest): Promise<JWTPayload | null> {

  let token = getTokenFromCookie(req);
  if (!token) {
    token = getTokenFromRequest(req);
  }
  
  if (!token) return null;
  
  return verifyToken(token);
}

export function createAuthResponse(data: any, token: string) {
  const response = NextResponse.json(data);
  response.cookies.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 6 * 60 * 60,
  });
  return response;
}

export function clearAuthResponse() {
  const response = NextResponse.json({ message: 'Logged out successfully' });
  response.cookies.delete('token');
  return response;
} 