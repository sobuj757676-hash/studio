import { NextResponse } from 'next/server';
import { getAdminApp } from '@/lib/firebase-admin';

export async function POST(request: Request) {
  try {
    const { uid } = await request.json();

    if (!uid) {
        return NextResponse.json({ error: 'UID is required' }, { status: 400 });
    }

    const adminAuth = getAdminApp().auth;
    const customToken = await adminAuth.createCustomToken(uid, { role: 'student' });
    
    return NextResponse.json({ token: customToken });

  } catch (error: any) {
    console.error('Token generation error:', error);
    return NextResponse.json({ error: 'Failed to generate token.' }, { status: 500 });
  }
}
