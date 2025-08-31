import { NextResponse } from 'next/server';
import { createSessionCookie, setAdminClaim } from '@/lib/auth';
import { getAdminApp } from '@/lib/firebase-admin';

export async function POST(request: Request) {
  try {
    const { idToken, userType } = await request.json();

    if (!idToken) {
      return NextResponse.json({ error: 'ID token is required' }, { status: 400 });
    }

    // If the user is an admin, we need to set a custom claim before creating the session cookie
    if (userType === 'admin') {
        const adminAuth = getAdminApp().auth;
        const decodedToken = await adminAuth.verifyIdToken(idToken);
        
        // Ensure this is the correct admin user before setting claims
        if (decodedToken.email !== 'admin@edutraq.com') {
            return NextResponse.json({ error: 'Unauthorized admin user.' }, { status: 403 });
        }
        await setAdminClaim(decodedToken.uid);
    }
    
    await createSessionCookie(idToken);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error('Login API error:', error);
    return NextResponse.json({ error: 'Failed to create session.' }, { status: 401 });
  }
}
