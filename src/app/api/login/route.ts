import { NextResponse } from 'next/server';
import { signInWithAdminEmail, signInWithStudentId } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, password, studentId, userType } = await request.json();

    if (userType === 'admin') {
      if (!email || !password) {
        return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
      }
      await signInWithAdminEmail(email, password);
    } else if (userType === 'student') {
      if (!studentId || !password) {
        return NextResponse.json({ error: 'Student ID and password are required' }, { status: 400 });
      }
      await signInWithStudentId(studentId, password);
    } else {
        return NextResponse.json({ error: 'Invalid user type' }, { status: 400 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error('Login error:', error);
    let errorMessage = 'An unexpected error occurred.';
    if (error.code) {
        switch (error.code) {
            case 'auth/user-not-found':
            case 'auth/wrong-password':
            case 'auth/invalid-credential':
                errorMessage = 'Invalid credentials. Please try again.';
                break;
            default:
                errorMessage = error.message;
        }
    } else {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 401 });
  }
}
