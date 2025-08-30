import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySessionCookie } from '@/lib/auth';

export async function GET() {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get('__session');

  if (!sessionCookie) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const { user } = await verifySessionCookie(sessionCookie.value);
  
  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  return NextResponse.json({ user });
}
