// ==============================================================================
// Edvora School Management — Cryptographically Signed Verified Server Sessions
// Never trusts client-supplied actorRole or actorId.
// ==============================================================================

import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { StaffRole } from '../types/backend';
import { config } from '../config';

const SESSION_COOKIE_NAME = 'edvora_session';
const SESSION_EXPIRY_SECONDS = 7 * 24 * 60 * 60; // 7 days

// Secure signing secret derived from environment
const SESSION_SECRET =
  process.env.SESSION_SECRET ||
  config.supabase.serviceRoleKey ||
  'edvora-production-secure-session-signing-secret-key-32b';

export interface StaffSessionActor {
  type: 'staff';
  userId: string;
  staffId: string;
  role: StaffRole;
  email: string;
  name: string;
  assignedClassIds: string[];
  exp: number;
}

export interface StudentSessionActor {
  type: 'student';
  userId: string;
  pupilId: string;
  admissionNumber: string;
  name: string;
  className: string;
  guardianId?: string;
  exp: number;
}

export type SessionActor = StaffSessionActor | StudentSessionActor;

function signPayload(payloadStr: string): string {
  return crypto.createHmac('sha256', SESSION_SECRET).update(payloadStr).digest('base64url');
}

/**
 * Creates a signed session token.
 */
export function createSessionToken(actor: Omit<StaffSessionActor, 'exp'> | Omit<StudentSessionActor, 'exp'>): string {
  const exp = Math.floor(Date.now() / 1000) + SESSION_EXPIRY_SECONDS;
  const payload: SessionActor = { ...actor, exp } as SessionActor;
  const payloadStr = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = signPayload(payloadStr);
  return `${payloadStr}.${signature}`;
}

/**
 * Verifies and parses a signed session token.
 */
export function verifySessionToken(token: string): SessionActor | null {
  if (!token || !token.includes('.')) return null;

  const [payloadStr, signature] = token.split('.');
  if (!payloadStr || !signature) return null;

  const expectedSignature = signPayload(payloadStr);
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (signatureBuffer.length !== expectedBuffer.length) return null;
  if (!crypto.timingSafeEqual(signatureBuffer, expectedBuffer)) return null;

  try {
    const payload = JSON.parse(Buffer.from(payloadStr, 'base64url').toString('utf-8')) as SessionActor;
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null; // Expired
    }
    return payload;
  } catch {
    return null;
  }
}

/**
 * Attaches the session cookie to a NextResponse.
 */
export function setSessionCookie(res: NextResponse, token: string): void {
  res.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_EXPIRY_SECONDS,
    path: '/',
  });
}

/**
 * Clears the session cookie on a NextResponse.
 */
export function clearSessionCookie(res: NextResponse): void {
  res.cookies.set(SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
}

/**
 * Extracts and verifies the session from an incoming NextRequest.
 */
export async function getSession(req: NextRequest | Request): Promise<SessionActor | null> {
  let token: string | undefined;

  if ('cookies' in req && typeof req.cookies.get === 'function') {
    token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  } else {
    const cookieHeader = req.headers.get('cookie') || '';
    const match = cookieHeader.match(new RegExp(`(?:^|; )${SESSION_COOKIE_NAME}=([^;]*)`));
    token = match ? decodeURIComponent(match[1]) : undefined;
  }

  // Also support Authorization: Bearer <token> for testing/API clients
  if (!token) {
    const authHeader = req.headers.get('authorization');
    if (authHeader && authHeader.toLowerCase().startsWith('bearer ')) {
      const candidate = authHeader.slice(7).trim();
      if (candidate.includes('.')) {
        token = candidate;
      }
    }
  }

  if (!token) return null;
  return verifySessionToken(token);
}

/**
 * Strictly asserts an authenticated staff session with optional role constraints.
 */
export async function requireStaffSession(
  req: NextRequest | Request,
  allowedRoles?: StaffRole[]
): Promise<StaffSessionActor> {
  const session = await getSession(req);
  if (!session) {
    const err = new Error('Authentication required');
    (err as any).statusCode = 401;
    throw err;
  }

  if (session.type !== 'staff') {
    const err = new Error('Forbidden: Staff access required');
    (err as any).statusCode = 403;
    throw err;
  }

  if (allowedRoles && !allowedRoles.includes(session.role)) {
    const err = new Error(`Forbidden: Role '${session.role}' is not authorized for this operation`);
    (err as any).statusCode = 403;
    throw err;
  }

  return session;
}

/**
 * Strictly asserts an authenticated student or staff session.
 * If pupilId is provided, guarantees that student can ONLY access their own pupil data.
 */
export async function requireStudentOrStaffSession(
  req: NextRequest | Request,
  pupilId?: string
): Promise<SessionActor> {
  const session = await getSession(req);
  if (!session) {
    const err = new Error('Authentication required');
    (err as any).statusCode = 401;
    throw err;
  }

  if (session.type === 'student') {
    if (pupilId && session.pupilId !== pupilId) {
      const err = new Error('Forbidden: You can only access your own pupil records');
      (err as any).statusCode = 403;
      throw err;
    }
  }

  return session;
}
